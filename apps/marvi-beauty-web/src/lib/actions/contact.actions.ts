"use server";

import { ContactGroup } from "@repo/components/dashboard/grupo-de-contactos/contact-group-list";
import { createClient } from "@repo/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface Contact {
  id: string;
  full_name: string;
  job_position: string | null;
  phone: string | null;
  mobile: string | null;
  email: string;
  website: string | null;
  title: string | null;
  rfc: string | null;
  curp: string | null;
  notes: string | null;
  birth_date: string | null; 
  related_user_id: string | null;
  related_user?: { // Datos del usuario relacionado
    id: string;
    full_name: string;
    email: string;
    active: boolean;
  } | null;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
  updated_by?: string | null;
}

export interface ContactsResponse {
  contacts: Contact[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface GroupContactsResponse {
  groupContacts: GroupContacts[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
export interface GroupContacts {
  id: string
  id_contact_groups: string
  created_at: string
  updated_at: string
  contact: Contact | null
}

interface CreateGroupContactsPayload {
  id_contact_groups: string
  id_contacts: string
  active?: boolean
  userId: string
}

/**
 * Obtiene contactos con paginación
 * @param page - Número de página (inicia en 1)
 * @param pageSize - Cantidad de items por página
 * @param searchQuery - Término de búsqueda (opcional)
 * @returns Objeto con contactos, total, página actual y total de páginas
 */
export async function getContacts(
  page = 1,
  pageSize = 50,
  searchQuery = ""
): Promise<ContactsResponse> {
  const supabase = await createClient();

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("contacts")
    .select(`
      *,
      related_user:related_user_id (id, full_name, email, active)
    `, { count: "exact" })
    .is("deleted_at", null)
    .order("full_name", { ascending: true });

  if (searchQuery) {
    query = query.or(
      `full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%,notes.ilike.%${searchQuery}%` 
    );
  }

  const { data, error, count } = await query.range(from, to);

  if (error) {
    throw new Error(`Error al obtener contactos: ${error.message}`);
  }

  const totalPages = count ? Math.ceil(count / pageSize) : 0;

  return {
    contacts: data || [],
    total: count || 0,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * Obtiene un contacto por su ID (solo si no está eliminado)
 */
export async function getContactById(contactId: string): Promise<Contact | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("contacts")
    .select(`
      *,
      related_user:related_user_id (id, full_name, email, active)
    `)
    .eq("id", contactId)
    .is("deleted_at", null)
    .single();

  if (error) {
    console.error("Error al obtener contacto:", error);
    return null;
  }

  return data;
}

export async function getContactsByGroupIdPaginated(
  groupId: string,
  page = 1,
  pageSize = 50,
  searchQuery = ""
): Promise<GroupContactsResponse> {
  const supabase = await createClient();

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
  .from("group_contacts")
  .select(`
    id,
    id_contact_groups,
    created_at,
    updated_at,
    contact:id_contacts!inner (  
      *,
      related_user:related_user_id (id, full_name, email, active)
    )
  `, { count: "exact" })
  .eq("id_contact_groups", groupId)
  .eq("active", true)
  .is("deleted_at", null)

  if (searchQuery) {
    query = query.or(`
      contact.full_name.ilike.%${searchQuery}%,
      contact.email.ilike.%${searchQuery}%,
      contact.phone.ilike.%${searchQuery}%,
      contact.notes.ilike.%${searchQuery}%
    `);
  }

  const { data, error, count } = await query.range(from, to);

  if (error) {
    throw new Error("Error al obtener contactos del grupo");
  }

  const groupContacts: GroupContacts[] = (data ?? []).map((item: any) => {
    const contactData = Array.isArray(item.contact) ? item.contact[0] : item.contact;
    
    return {
      id: item.id,
      id_contact_groups: item.id_contact_groups,
      created_at: item.created_at,
      updated_at: item.updated_at,
      contact: contactData ?? null,
    };
  });
  
  const totalPages = count ? Math.ceil(count / pageSize) : 0;

  return {
  groupContacts,
  total: count ?? 0,
  page,
  pageSize,
  totalPages: totalPages,
};
}

/**
 * Obtiene los IDs de contactos en un grupo de contactos
 * @param groupId - ID del grupo de contactos
 * @returns Resultado de la operación
 */
async function getContactIdsInGroup(groupId: string): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("group_contacts")
    .select("id_contacts")
    .eq("id_contact_groups", groupId)
    .eq("active", true)
    .is("deleted_at", null);

  if (error) {
    throw new Error("Error al obtener contactos del grupo");
  }

  return data.map(row => row.id_contacts as string);
}

/**
 * Obtiene contactos disponibles para agregar a un grupo
 */
export async function getAvailableContactsForGroup(
  groupId: string,
  page = 1,
  pageSize = 50,
  searchQuery = ""
): Promise<ContactsResponse> {
  const supabase = await createClient();

  // const excludedIds = await getContactIdsInGroup(groupId);

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("contacts")
    .select(`
      *,
      related_user:related_user_id (id, full_name, email, active)
    `, { count: "exact" })
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  // 🔥 excluir SOLO los del grupo actual
  // if (excludedIds.length > 0) {
  //   query = query.not("id", "in", `(${excludedIds.join(",")})`);
  // }

  if (searchQuery) {
    query = query.or(
      `full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%,notes.ilike.%${searchQuery}%`
    );
  }

  const { data, error, count } = await query.range(from, to);

  if (error) {
    throw new Error(`Error al obtener contactos disponibles: ${error.message}`);
  }

  const totalPages = count ? Math.ceil(count / pageSize) : 0;

  return {
    contacts: data || [],
    total: count || 0,
    page,
    pageSize,
    totalPages,
  };
}



/**
 * Crea un nuevo contacto
 * @param contactData - Datos del contacto a crear
 * @returns Resultado de la operación
 */
export async function createContact(contactData: {
  full_name: string;
  job_position?: string;
  phone?: string;
  mobile?: string;
  email: string;
  website?: string;
  title?: string;
  rfc?: string;
  curp?: string;
  notes?: string; 
  birth_date?: string; 
  related_user_id?: string;
}): Promise<{
  success: boolean;
  message?: string;
  contact?: Contact;
}> {
  const supabase = await createClient();

  if (!contactData.full_name?.trim()) {
    return { success: false, message: "El nombre es obligatorio" };
  }

  if (!contactData.email?.trim()) {
    return { success: false, message: "El correo electrónico es obligatorio" };
  }

  // Validar formato de fecha de nacimiento si se proporciona
  if (contactData.birth_date) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(contactData.birth_date)) {
      return { success: false, message: "Formato de fecha de nacimiento inválido. Use YYYY-MM-DD" };
    }
  }

  // Verificar si el usuario ya está relacionado con otro contacto
  if (contactData.related_user_id) {
    const { data: existingContactWithUser } = await supabase
      .from("contacts")
      .select("id, full_name")
      .eq("related_user_id", contactData.related_user_id)
      .is("deleted_at", null)
      .single();

    if (existingContactWithUser) {
      return { 
        success: false, 
        message: `El usuario seleccionado ya está relacionado con el contacto: ${existingContactWithUser.full_name}` 
      };
    }
  }

  try {
    const { data, error } = await supabase
      .from("contacts")
      .insert({
        full_name: contactData.full_name,
        job_position: contactData.job_position || null,
        phone: contactData.phone || null,
        mobile: contactData.mobile || null,
        email: contactData.email,
        website: contactData.website || null,
        title: contactData.title || null,
        rfc: contactData.rfc || null,
        curp: contactData.curp || null,
        notes: contactData.notes || null, 
        birth_date: contactData.birth_date || null, 
        related_user_id: contactData.related_user_id || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        if (error.message.includes("email")) {
          return { success: false, message: "El correo electrónico ya está en uso por otro contacto." };
        }
        if (error.message.includes("related_user_id")) {
          return { success: false, message: "El usuario seleccionado ya está relacionado con otro contacto." };
        }
      }
      return { success: false, message: error.message };
    }

    revalidatePath("dashboard/contacts");
    return { success: true, contact: data };
  } catch (error: any) {
    console.error("Error inesperado:", error);
    return { success: false, message: "Ocurrió un error inesperado" };
  }
}

export async function createGroupContacts({
  id_contact_groups,
  contactIds,
  active = true,
  userId,
}: {
  id_contact_groups: string;
  contactIds: string[];
  active?: boolean
  userId?: string
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("group_contacts")
    .upsert(
      contactIds.map((id) => ({
        id_contacts: id,
        id_contact_groups,
        active,
        updated_by: userId ?? null,
      })),
      { onConflict: "id_contacts,id_contact_groups" }
    );

  if (error) {
    return { success: false };
  }

  return {
    success: true,
    inserted: contactIds.length,
  };
}

/**
 * Actualiza un contacto existente
 * @param contactId - ID del contacto a actualizar
 * @param contactData - Datos del contacto a actualizar
 * @returns Resultado de la operación
 */
export async function updateContact(
  contactId: string,
  contactData: {
    full_name?: string;
    job_position?: string;
    phone?: string;
    mobile?: string;
    email?: string;
    website?: string;
    title?: string;
    rfc?: string;
    curp?: string;
    notes?: string;
    birth_date?: string | null;
    related_user_id?: string | null;
  }
): Promise<{
  success: boolean;
  message?: string;
  contact?: Contact;
}> {
  try {
    const supabase = await createClient();

    // 1. Verificar que el contacto existe
    const { data: existingContact, error: findError } = await supabase
      .from("contacts")
      .select("id, email, related_user_id")
      .eq("id", contactId)
      .single();

    if (findError || !existingContact) {
      return { success: false, message: "Contacto no encontrado" };
    }

    // 2. Validaciones 
    if (contactData.full_name !== undefined && !contactData.full_name.trim()) {
      return { success: false, message: "El nombre es obligatorio" };
    }

    if (contactData.email !== undefined && !contactData.email.trim()) {
      return { success: false, message: "El correo electrónico es obligatorio" };
    }

    // Validar formato de fecha de nacimiento si se proporciona
    if (contactData.birth_date !== undefined && contactData.birth_date) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(contactData.birth_date)) {
        return { success: false, message: "Formato de fecha de nacimiento inválido. Use YYYY-MM-DD" };
      }
    }

    // 3. Validar email único (si se está cambiando)
    if (contactData.email && contactData.email !== existingContact.email) {
      const { data: duplicate } = await supabase
        .from("contacts")
        .select("id")
        .eq("email", contactData.email)
        .neq("id", contactId)
        .single();

      if (duplicate) {
        return { success: false, message: "El correo electrónico ya está en uso por otro contacto." };
      }
    }

    // Verificar si el usuario ya está relacionado con OTRO contacto
    if (contactData.related_user_id && contactData.related_user_id !== existingContact.related_user_id) {
      const { data: existingContactWithUser } = await supabase
        .from("contacts")
        .select("id, full_name")
        .eq("related_user_id", contactData.related_user_id)
        .neq("id", contactId)
        .is("deleted_at", null)
        .single();

      if (existingContactWithUser) {
        return { 
          success: false, 
          message: `El usuario seleccionado ya está relacionado con el contacto: ${existingContactWithUser.full_name}` 
        };
      }
    }

    // 4. Preparar datos para actualizar
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    // Agregar solo los campos que tienen valor
    if (contactData.full_name !== undefined) updateData.full_name = contactData.full_name;
    if (contactData.job_position !== undefined) updateData.job_position = contactData.job_position;
    if (contactData.phone !== undefined) updateData.phone = contactData.phone;
    if (contactData.mobile !== undefined) updateData.mobile = contactData.mobile;
    if (contactData.email !== undefined) updateData.email = contactData.email;
    if (contactData.website !== undefined) updateData.website = contactData.website;
    if (contactData.title !== undefined) updateData.title = contactData.title;
    if (contactData.rfc !== undefined) updateData.rfc = contactData.rfc;
    if (contactData.curp !== undefined) updateData.curp = contactData.curp;
    if (contactData.notes !== undefined) updateData.notes = contactData.notes; 
    if (contactData.birth_date !== undefined) updateData.birth_date = contactData.birth_date; 

    // Manejar related_user_id (puede ser null para desvincular)
    if (contactData.related_user_id !== undefined) {
      updateData.related_user_id = contactData.related_user_id;
    }

    // 5. Ejecutar el UPDATE
    const { data, error } = await supabase
      .from("contacts")
      .update(updateData)
      .eq("id", contactId)
      .select()
      .single();

    if (error) {
      console.error("Error al actualizar contacto:", error);
      
      // Manejar errores de constraint único
      if (error.code === "23505") {
        return { success: false, message: "El correo electrónico ya está en uso por otro contacto." };
      }

      return { success: false, message: `Error de base de datos: ${error.message}` };
    }

    // 6. Revalidar paths
    revalidatePath("dashboard/contacts");
    revalidatePath("dashboard/contacts/edit");

    return { success: true, contact: data };
  } catch (error: any) {
    console.error("Error general en updateContact:", error);
    return { success: false, message: `Error inesperado: ${error.message}` };
  }
}

/**
 * Elimina un contacto
 * @param contactId - ID del contacto a eliminar
 * @returns Resultado de la operación
 */
export async function deleteContact(contactId: string): Promise<{
  success: boolean;
  message?: string;
}> {
  const supabase = await createClient();

  try {
    // Obtener el usuario autenticado para logged de quién eliminó
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from("contacts")
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by: user?.id || null, 
      })
      .eq("id", contactId);

    if (error) {
      console.error("Error al eliminar contacto:", error);
      return { success: false, message: error.message };
    }

    revalidatePath("dashboard/contacts");
    return { success: true };
  } catch (error: any) {
    console.error("Error inesperado:", error);
    return { success: false, message: "Ocurrió un error inesperado" };
  }
}

/**
 * Elimina un contacto de un grupo de contactos
 * @param id - ID del contacto a eliminar
 * @returns Resultado de la operación
 */
export async function deleteGroupContacts(id: string) {
  const supabase = await createClient();
   
    const { data, error } = await supabase
      .from("group_contacts")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error al eliminar contacto del grupo:", error);
      return { success: false, message: error.message };
    }

    return { success: true, data };
}

/**
 * Obtiene todos los contactos (sin paginación, solo los no eliminados)
 */
export async function getAllContacts(): Promise<Contact[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .is("deleted_at", null) // ← FILTRO IMPORTANTE
    .order("full_name", { ascending: true });

  if (error) {
    console.error("Error al obtener contactos:", error);
    return [];
  }

  return data || [];
}

/**
 * Busca contactos por nombre o email (solo los no eliminados)
 */
export async function searchContacts(query: string): Promise<Contact[]> {
  const supabase = await createClient();

  if (query.trim().length < 2) return [];

  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .is("deleted_at", null)
    .or(`full_name.ilike.%${query}%,email.ilike.%${query}%,notes.ilike.%${query}%`) 
    .order("full_name", { ascending: true })
    .limit(10);

  if (error) {
    console.error("Error al buscar contactos:", error);
    return [];
  }

  return data || [];
}