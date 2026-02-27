"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, useEffect, useCallback } from "react";
import type { UsersResponse } from "@/lib/actions/user.actions";
import { ConfirmDialog } from "@/components/general/confirm-dialog";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/popover";
import { MoreVertical } from "lucide-react";
import Link from "next/link";
import {
  getUserWithPermissions,
  toggleUserActive,
} from "@/lib/actions/user.actions";

type UsersTableProps = {
  initialData: UsersResponse;
  allProfiles?: any[]; // Hacerlo opcional para compatibilidad
};

export default function UsersTable({ initialData, allProfiles = [] }: UsersTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const currentPage = Number(searchParams.get("page")) || 1;
  const currentSearch = searchParams.get("search") || "";
  const currentProfileFilter = searchParams.get("profile") || "";
  const [searchInput, setSearchInput] = useState(currentSearch);
  const [profileFilter, setProfileFilter] = useState(currentProfileFilter);
  const currentSort = searchParams.get("sort") || "full_name";
  const currentOrder = (searchParams.get("order") || "asc") as "asc" | "desc";
  const [togglingUserId, setTogglingUserId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    userId: string;
    currentActive: boolean;
    userName: string;
  } | null>(null);

  const [canReadUsers, setCanReadUsers] = useState<boolean>(false);
  const [loadingPermissions, setLoadingPermissions] = useState(true);
  const [canUpdateUsers, setCanUpdateUsers] = useState(false);

  // Estados para controlar los timeouts de debounce
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [profileTimeout, setProfileTimeout] = useState<NodeJS.Timeout | null>(null);

  // Traer usuario y permisos
  useEffect(() => {
    const fetchPermissions = async () => {
      const userWithPermissions = await getUserWithPermissions();

      const permissions: string[] = Array.isArray(
        userWithPermissions?.permissions,
      )
        ? userWithPermissions.permissions.map((p: any) => p.code)
        : [];

      setCanReadUsers(permissions.includes("read:users"));
      setCanUpdateUsers(permissions.includes("update:users"));
      setCurrentUserId(userWithPermissions?.id ?? null);
      setLoadingPermissions(false);
    };
    fetchPermissions();
  }, []);

  const handleToggleActive = async (
    userId: string,
    currentActive: boolean,
    userName: string,
  ) => {
    if (!canUpdateUsers) {
      toast.error(
        "No tienes permisos para actualizar el estado de los usuarios.",
      );
      return;
    }

    setConfirmDialog({
      isOpen: true,
      userId,
      currentActive,
      userName,
    });
  };

  const confirmToggle = async () => {
    if (!confirmDialog) return;

    setTogglingUserId(confirmDialog.userId);
    setConfirmDialog(null);

    const result = await toggleUserActive(
      confirmDialog.userId,
      confirmDialog.currentActive,
    );

    if (result.success) {
      toast.success(
        confirmDialog.currentActive
          ? "Usuario desactivado exitosamente"
          : "Usuario activado exitosamente",
      );
      router.refresh();
    } else {
      toast.error(result.error || "Error al actualizar el usuario");
    }

    setTogglingUserId(null);
  };

  // Función para actualizar parámetros sin ciclo infinito
  const updateParams = useCallback(
    (updates: Record<string, string | number>, resetPage: boolean = false) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value || value === 0) {
          params.set(key, value.toString());
        } else {
          params.delete(key);
        }
      });

      // Solo resetear página si se indica explícitamente
      if (resetPage) {
        params.set("page", "1");
      }

      startTransition(() => {
        router.push(`?${params.toString()}`);
      });
    },
    [searchParams, router],
  );

  // Handler para cambio de búsqueda con debounce
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    
    // Limpiar timeout anterior
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Crear nuevo timeout
    const timeout = setTimeout(() => {
      updateParams({ search: value }, true); // Resetear página al buscar
    }, 500);
    
    setSearchTimeout(timeout);
  };

  // Handler para cambio de filtro de perfil con debounce
  const handleProfileFilterChange = (value: string) => {
    setProfileFilter(value);
    
    // Limpiar timeout anterior
    if (profileTimeout) {
      clearTimeout(profileTimeout);
    }
    
    // Crear nuevo timeout
    const timeout = setTimeout(() => {
      updateParams({ profile: value }, true); // Resetear página al filtrar
    }, 300);
    
    setProfileTimeout(timeout);
  };

  const handleSort = (column: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (currentSort === column) {
      params.set("order", currentOrder === "asc" ? "desc" : "asc");
    } else {
      params.set("sort", column);
      params.set("order", "asc");
    }
    
    // Mantener la página actual al ordenar
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const getSortIcon = (column: string) => {
    if (currentSort !== column) {
      return (
        <svg
          className="h-4 w-4 text-neutral-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      );
    }
    return currentOrder === "asc" ? (
      <svg
        className="h-4 w-4 text-[#c6a365]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>
    ) : (
      <svg
        className="h-4 w-4 text-[#c6a365]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    );
  };

  const clearFilters = () => {
    // Limpiar timeouts
    if (searchTimeout) {
      clearTimeout(searchTimeout);
      setSearchTimeout(null);
    }
    if (profileTimeout) {
      clearTimeout(profileTimeout);
      setProfileTimeout(null);
    }
    
    setSearchInput("");
    setProfileFilter("");
    
    // Limpiar filtros manteniendo solo la página
    const params = new URLSearchParams();
    params.set("page", currentPage.toString());
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  // Cleanup de timeouts al desmontar
  useEffect(() => {
    return () => {
      if (searchTimeout) clearTimeout(searchTimeout);
      if (profileTimeout) clearTimeout(profileTimeout);
    };
  }, [searchTimeout, profileTimeout]);

  // Handler para cambio de página (SIMPLIFICADO)
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  if (loadingPermissions) return null;

  if (!canReadUsers) {
    return (
      <div className="bg-[#fdeaea] rounded-lg border border-[#f5efe6] p-6 text-center text-[#c62828]">
        No tienes permisos para ver los usuarios.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Búsqueda */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-neutral-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 md:py-2 py-2.5 border border-[#CFC7B8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c6a365] focus:ring-opacity-20 bg-white text-neutral-900 placeholder-neutral-500 text-base transition-all duration-200"
          />
        </div>
        {/* Filtro por perfil - Solo mostrar si hay perfiles */}
        {allProfiles.length > 0 && (
          <div className="w-full md:w-64">
            <select
              value={profileFilter}
              onChange={(e) => handleProfileFilterChange(e.target.value)}
              className="w-full px-3 md:py-2 py-2.5 border border-[#CFC7B8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c6a365] focus:ring-opacity-20 bg-white text-neutral-900 text-base transition-all duration-200"
            >
              <option value="" className="bg-white text-neutral-900">
                Todos los perfiles
              </option>
              {allProfiles.map((profile) => (
                <option 
                  key={profile.id} 
                  value={profile.id}
                  className="bg-white text-neutral-900"
                >
                  {profile.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Botón limpiar filtros */}
        {(searchInput || profileFilter) && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm text-neutral-600 hover:text-[#c6a365] border border-[#CFC7B8] rounded-lg hover:bg-[#f5efe6] transition-all duration-200"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Loading indicator */}
      {isPending && (
        <div className="flex justify-center">
          <div className="bg-[#f5efe6] text-[#c6a365] px-4 py-2 rounded-lg text-sm border border-[#e6d7a3]">
            Cargando...
          </div>
        </div>
      )}

      {/* Loading skeleton */}
      {isPending && initialData.users.length === 0 && (
        <>
          {/* Skeleton Desktop */}
          <div className="hidden md:block bg-white rounded-lg border border-[#f5efe6] overflow-hidden">
            <div className="animate-pulse">
              <div className="bg-[#faf8f3] px-6 py-3 flex justify-between items-center text-neutral-600">
                <div className="flex gap-4">
                  <div className="h-4 bg-[#f5efe6] rounded-sm w-24"></div>
                  <div className="h-4 bg-[#f5efe6] rounded-sm w-32"></div>
                  {allProfiles.length > 0 && (
                    <div className="h-4 bg-[#f5efe6] rounded-sm w-24"></div>
                  )}
                  <div className="h-4 bg-[#f5efe6] rounded-sm w-20"></div>
                </div>
                <div className="h-4 bg-[#f5efe6] rounded-sm w-16"></div>
              </div>

              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="border-t border-[#f5efe6] px-6 py-4 flex justify-between items-center"
                >
                  <div className="flex gap-8 items-center">
                    <div className="h-4 bg-[#f5efe6] rounded-sm w-40"></div>
                    <div className="h-4 bg-[#f5efe6] rounded-sm w-56"></div>
                    {allProfiles.length > 0 && (
                      <div className="h-4 bg-[#f5efe6] rounded-sm w-32"></div>
                    )}
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-12 bg-[#f5efe6] rounded-full"></div>
                      <div className="h-4 w-16 bg-[#f5efe6] rounded-full"></div>
                    </div>
                  </div>
                  <div className="h-5 w-5 bg-[#f5efe6] rounded-full"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Skeleton Mobile */}
          <div className="md:hidden space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg border border-[#f5efe6] p-4 animate-pulse"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[#f5efe6] rounded-sm w-32"></div>
                    <div className="h-3 bg-[#f5efe6] rounded-sm w-48"></div>
                    {allProfiles.length > 0 && (
                      <div className="h-3 bg-[#f5efe6] rounded-sm w-24"></div>
                    )}
                  </div>
                  <div className="h-5 w-5 bg-[#f5efe6] rounded-full ml-3"></div>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <div className="h-6 w-12 bg-[#f5efe6] rounded-full"></div>
                  <div className="h-4 w-16 bg-[#f5efe6] rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Tabla - Desktop / Cards - Mobile */}
      {!isPending && (
        <>
          {/* Vista Desktop - Tabla */}
          <div className="hidden md:block bg-white rounded-lg border border-[#f5efe6] overflow-hidden shadow-sm">
            <table className="min-w-full divide-y divide-[#f5efe6]">
              <thead className="bg-[#EAD9A5]">
                <tr>
                  <th
                    onClick={() => handleSort("full_name")}
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#3A2A00] cursor-pointer hover:bg-[#D4C295] select-none transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      Nombre
                      {getSortIcon("full_name")}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort("email")}
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#3A2A00] cursor-pointer hover:bg-[#D4C295] select-none transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      Correo
                      {getSortIcon("email")}
                    </div>
                  </th>
                  {allProfiles.length > 0 && (
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#3A2A00]">
                      Tipo de Usuario
                    </th>
                  )}
                  <th
                    onClick={() => handleSort("active")}
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#3A2A00] cursor-pointer hover:bg-[#D4C295] select-none transition-colors duration-200"
                  >
                    Estado
                  </th>
                  {canUpdateUsers && (
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-[#3A2A00]">
                      Acciones
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-[#f5efe6]">
                {initialData.users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={canUpdateUsers ? (allProfiles.length > 0 ? 5 : 4) : (allProfiles.length > 0 ? 4 : 3)}
                      className="px-6 py-4 text-center text-neutral-600"
                    >
                      No se encontraron usuarios
                    </td>
                  </tr>
                ) : (
                  initialData.users.map((user) => (
                    <tr key={user.id} className="hover:bg-[#faf8f3] transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-neutral-900">{user.full_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-neutral-700">{user.email}</div>
                      </td>
                      {allProfiles.length > 0 && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-900">
                            {user.profile_name || <span className="italic text-neutral-600">Sin perfil</span>}
                          </div>
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleToggleActive(user.id, user.active, user.full_name)}
                            disabled={togglingUserId === user.id || currentUserId === user.id}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#c6a365] disabled:opacity-50 disabled:cursor-not-allowed ${
                              user.active ? "bg-green-500" : "bg-red-400"
                            }`}
                            title={user.active ? "Click para desactivar" : "Click para activar"}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-200 ${
                                user.active ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                          <span
                            className={`ml-3 px-2.5 py-1 inline-flex items-center text-xs font-semibold rounded-full ${
                              user.active ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"
                            }`}
                          >
                            {user.active ? "Activo" : "Inactivo"}
                          </span>
                        </div>
                      </td>

                      {canUpdateUsers && (
                        <td className="px-6 py-4 text-right align-middle">
                          <Popover>
                            <PopoverTrigger asChild>
                              <button className="p-2 rounded-full hover:bg-[#f5efe6] transition-all duration-200">
                                <MoreVertical
                                  size={18}
                                  className="text-neutral-700 hover:text-[#c6a365] transition-colors"
                                />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-40 p-2 bg-white border border-[#f5efe6] rounded-md shadow-sm"
                              align="end"
                            >
                              <Link href={`/dashboard/seguridad/usuarios/editar/${user.id}`}>
                                <button className="w-full text-left px-3 py-2 text-sm text-neutral-700 hover:bg-[#f5efe6] hover:text-[#c6a365] rounded-md transition-all duration-200">
                                  Editar
                                </button>
                              </Link>
                            </PopoverContent>
                          </Popover>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Vista Mobile - Cards */}
          <div className="md:hidden space-y-3">
            {initialData.users.length === 0 ? (
              <div className="bg-white rounded-lg border border-[#f5efe6] p-6 text-center text-neutral-600">
                No se encontraron usuarios
              </div>
            ) : (
              initialData.users.map((user) => (
                <div
                  key={user.id}
                  className="bg-white rounded-lg border border-[#f5efe6] p-4 hover:border-[#e6d7a3] transition-all duration-200"
                >
                  <div className="flex flex-col gap-2">
                    <div>
                      <h3 className="text-base font-semibold text-neutral-900 mb-1">
                        {user.full_name}
                      </h3>
                      <p className="text-sm text-neutral-700">{user.email}</p>
                      {allProfiles.length > 0 && (
                        <p className="text-sm text-neutral-600 mt-1">
                          Tipo: {user.profile_name || "Sin perfil"}
                        </p>
                      )}
                    </div>

                    {/* Botones de estado y edición */}
                    <div className="flex items-center justify-between mt-2">
                      {/* Toggle estado */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            handleToggleActive(
                              user.id,
                              user.active,
                              user.full_name,
                            )
                          }
                          disabled={
                            togglingUserId === user.id ||
                            currentUserId === user.id
                          }
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#c6a365] disabled:opacity-50 disabled:cursor-not-allowed ${
                            user.active ? "bg-green-500" : "bg-red-400"
                          }`}
                          title={
                            user.active
                              ? "Click para desactivar"
                              : "Click para activar"
                          }
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-200 ${
                              user.active ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                        <span
                          className={`px-2.5 py-1 inline-flex items-center text-xs font-semibold rounded-full ${
                            user.active
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : "bg-red-100 text-red-700 border border-red-200"
                          }`}
                        >
                          {user.active ? "Activo" : "Inactivo"}
                        </span>
                      </div>

                      {/* Botón 3 puntos - redirección a edición */}
                      {canUpdateUsers && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="p-1 rounded-full hover:bg-[#f5efe6] transition-all duration-200">
                              <MoreVertical 
                                size={18}
                                className="text-neutral-700 hover:text-[#c6a365] transition-colors"
                              />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-40 p-2 bg-white border border-[#f5efe6] shadow-sm" align="end">
                            <button
                              onClick={() =>
                                router.push(
                                  `/dashboard/seguridad/usuarios/editar/${user.id}`,
                                )
                              }
                              className="w-full text-left px-3 py-2 text-sm text-neutral-700 hover:bg-[#f5efe6] hover:text-[#c6a365] rounded-md transition-all duration-200"
                            >
                              Editar
                            </button>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Paginación */}
      {initialData.totalPages > 1 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-neutral-600">
            {(currentPage - 1) * initialData.pageSize + 1} -{" "}
            {Math.min(currentPage * initialData.pageSize, initialData.total)} de{" "}
            {initialData.total}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isPending}
              className="px-3 py-2 border border-[#CFC7B8] rounded-md text-sm font-medium text-neutral-700 hover:bg-[#f5efe6] hover:text-[#c6a365] disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-all duration-200"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="flex gap-1">
              {Array.from({ length: initialData.totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  // Mostrar primeras 2, últimas 2, y páginas cercanas a la actual
                  return (
                    p === 1 ||
                    p === initialData.totalPages ||
                    (p >= currentPage - 1 && p <= currentPage + 1)
                  );
                })
                .map((p, idx, arr) => {
                  // Agregar "..." entre gaps
                  const prevPage = arr[idx - 1];
                  const showEllipsis = prevPage && p - prevPage > 1;

                  return (
                    <div key={p} className="flex gap-1">
                      {showEllipsis && (
                        <span className="px-3 py-1 text-neutral-500">...</span>
                      )}
                      <button
                        onClick={() => handlePageChange(p)}
                        disabled={isPending}
                        className={`px-3 py-1 border rounded-md text-sm font-medium transition-all duration-200 ${
                          p === currentPage
                            ? "bg-[#c6a365] text-white border-[#c6a365] hover:bg-[#b59555]"
                            : "border-[#CFC7B8] text-neutral-700 hover:bg-[#f5efe6] hover:text-[#c6a365]"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {p}
                      </button>
                    </div>
                  );
                })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === initialData.totalPages || isPending}
              className="px-3 py-2 border border-[#CFC7B8] rounded-md text-sm font-medium text-neutral-700 hover:bg-[#f5efe6] hover:text-[#c6a365] disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-all duration-200"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Diálogo de confirmación */}
      {confirmDialog && (
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title={
            confirmDialog.currentActive
              ? "Desactivar usuario"
              : "Activar usuario"
          }
          message={`¿Estás seguro de que deseas ${
            confirmDialog.currentActive ? "desactivar" : "activar"
          } a ${confirmDialog.userName}?`}
          confirmText={confirmDialog.currentActive ? "Desactivar" : "Activar"}
          cancelText="Cancelar"
          onConfirm={confirmToggle}
          onCancel={() => setConfirmDialog(null)}
        />
      )}
    </div>
  );
}