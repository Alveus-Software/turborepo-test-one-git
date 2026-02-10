'use server'

import { revalidatePath } from "next/cache";
import { NewProfilePayload } from "../utils/definitions";
import { createClient } from "../supabase/server";
import { type ProfilesResponse } from '../utils/definitions'
import { getCurrentUser } from "./user.actions";

export async function createProfile(profileData: NewProfilePayload): Promise <
  { success: true } | { success: false; field: 'code'; message: string }
> {
  const supabase = await createClient()
  const { data, error  } = await supabase.from('profiles').insert([profileData]).select();
  
  if (error) {
    console.error('Error creating profile:', error)
    
    if (error.code === '23505') {
      if (error.message.includes('profiles_code_active_unique')) {
        return { 
          success: false, 
          field: 'code', 
          message: 'El código ingresado ya se encuentra registrado.' 
        }
      }
    }
    
    return { 
      success: false, 
      field: 'code', 
      message: 'No se pudo crear el perfil. Intente de nuevo.' 
    }
  }  

  revalidatePath('/dashboard/seguridad/perfiles')
  return { success: true }
}

export async function getProfiles(
  page: number = 1,
  pageSize: number = 10,
  search: string = '',
  sortBy: 'code' | 'name' | 'active' = 'name',
  sortOrder: 'asc' | 'desc' = 'asc'
): Promise<ProfilesResponse> {
  const supabase = await createClient();
 
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  
  let query = supabase
    .from('profiles')
    .select('id, code, name, active', { count: 'exact' })
    .is('deleted_at', null)
    .order(sortBy, { ascending: sortOrder === 'asc' });
  
  if (search.trim()) {
    query = query.or(`name.ilike.%${search}%, code.ilike.%${search}%`);
  }
  
  query = query.range(from, to);
  
  const { data, error, count } = await query;
  
  if (error) {
    console.error('Error fetching profiles:', error);
    throw new Error('Error al cargar perfiles');
  }
  
  const totalPages = count ? Math.ceil(count / pageSize) : 0;
  
  return {
    profiles: data || [],
    total: count || 0,
    page,
    pageSize,
    totalPages
  };
}

export async function getOneProfile(profileId: string): Promise<any> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select(`*`)
    .eq("id", profileId)
    .is('deleted_at', null)
    .single()

  if (error || !data) {
    return {}
  }

  return data
}

export async function getProfileWithPermissions(profileId: string): Promise<any> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id,
      name,
      permissions_profiles (
        active,
        permissions (
          id,
          name,
          code,
          description
        )
      )
    `)
    .eq('id', profileId)
    .is('deleted_at', null)
    .single();

  if (error || !data) {
    console.error(error);
    return {};
  }

  const permissions = (data.permissions_profiles || []).map((p: any) => {
    return { ...p.permissions, active: !!p.active };
  });

  const { permissions_profiles, ...extra } = data;

  return {
    ...extra,
    permissions,
  };
}



export async function updateProfile(
  profileId: string,
  profileData: NewProfilePayload
): Promise<{ success: true } | { success: false; field: 'code' | 'path'; message: string }> {
  const supabase = await createClient()
  const currentUser = await getCurrentUser();

  const { error } = await supabase
    .from('profiles')
    .update({...profileData, updated_by: currentUser?.data?.user?.id, updated_at: new Date()})
    .eq('id', profileId) 

  if (error) {
    console.error('Error updating profile:', error)
    
    if (error.code === '23505') {
      if (error.message.includes('profiles_code_active_unique')) {
        return { 
          success: false, 
          field: 'code', 
          message: 'El código ingresado ya se encuentra registrado.' 
        }
      }
    }
    
    return { 
      success: false, 
      field: 'code', 
      message: 'No se pudo actualizar el perfil. Intente de nuevo.' 
    }
  }

  revalidatePath('/dashboard/seguridad/perfiles')
  return { success: true }
}

export async function updateProfilePermissions(
  profileId: string,
  currentPermissionStates: Record<string, boolean>,
  originalPermissionStates: Record<string, boolean>
) {
  const supabase = await createClient();
  const inserts: any[] = [];
  const updates: any[] = [];

  for (const [permissionId, currentValue] of Object.entries(currentPermissionStates)) {
    const originalValue = originalPermissionStates[permissionId];

    if (originalValue === undefined) {
      // Si no existía antes y ahora está activo → insertar
      if (currentValue) inserts.push({ id_profile: profileId, id_permission: permissionId, active: true });
      // Si está en false → no hacemos nada
    } else if (originalValue !== currentValue) {
      // Si existía y cambió → actualizar
      updates.push({ id_profile: profileId, id_permission: permissionId, active: currentValue });
    }
  }

  try {
    // Insertar nuevos permisos activos
    if (inserts.length > 0) {
      const { error } = await supabase.from("permissions_profiles").insert(inserts);
      if (error) throw error;
    }

    // Actualizar permisos existentes que cambiaron
    for (const update of updates) {
      const { error } = await supabase
        .from("permissions_profiles")
        .update({ active: update.active })
        .eq("id_profile", update.id_profile)
        .eq("id_permission", update.id_permission);
      if (error) throw error;
    }

    return { success: true, count: inserts.length + updates.length };
  } catch (err: any) {
    console.error("Error actualizando permisos:", err);
    return { success: false, error: err.message };
  }
}

export async function deleteProfile(
  profileId: string,
  confirmationCode: string
): Promise<{ success: true } | { success: false; message: string }> {
  const supabase = await createClient()
  const currentUser = await getCurrentUser()
 
  const { data: profileData, error: fetchError } = await supabase
    .from('profiles')
    .select('code')
    .eq('id', profileId)
    .is('deleted_at', null)
    .single()
 
  if (fetchError || !profileData) {
    return {
      success: false,
      message: 'No se encontró el perfil.'
    }
  }
 
  if (profileData.code !== confirmationCode) {
    return {
      success: false,
      message: 'El código ingresado no coincide.'
    }
  }
 
  //** 
  // TODO: NO PERMITIR ELIMINAR PERFILES CON USUARIOS ASIGNADOS, U ACTUALIZARLOS A UN PERFIL BASE*/

  // if (profileData.parent_module_id === null) {
  //   const { data: childModules, error: childError } = await supabase
  //     .from('modules')
  //     .select('id')
  //     .eq('parent_module_id', profileId)
  //     .is('deleted_at', null)
    
  //   if (childError) {
  //     console.error('Error checking child modules:', childError)
  //     return {
  //       success: false,
  //       message: 'No se pudo verificar los módulos relacionados.'
  //     }
  //   }
    
  //   if (childModules && childModules.length > 0) {
  //     return {
  //       success: false,
  //       message: 'No se puede eliminar un perfil padre que tiene submódulos asociados.'
  //     }
  //   }
  // }
 
  const { error } = await supabase
    .from('profiles')
    .update({
      deleted_at: new Date().toISOString(),
      deleted_by: currentUser?.data?.user?.id,
      active: false
    })
    .eq('id', profileId)
 
  if (error) {
    console.error('Error deleting profile:', error)
    return {
      success: false,
      message: 'No se pudo eliminar el perfil. Intente de nuevo.'
    }
  }
 
  revalidatePath('/dashboard/seguridad/perfiles')
  return { success: true }
}
