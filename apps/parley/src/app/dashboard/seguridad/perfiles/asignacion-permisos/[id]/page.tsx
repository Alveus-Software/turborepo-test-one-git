"use client"

import PermissionsManagerPackage from "@repo/dashboard/seguridad/perfiles/asignacion-permisos/id/page"

type Permission = {
  id: string
  code: string
  name: string
  active?: boolean
}

type ModuleType = {
  id: string
  code: string
  name: string
  active: boolean
  parent_module_id: string | null
  permissions: Permission[]
  children?: ModuleType[]
}

export default function PermissionsManager() {
  return (
    <PermissionsManagerPackage/>
  )
}