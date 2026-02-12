type PageProps = {
  searchParams: Promise<{
    page?: string;
    search?: string;
    sort?: string;
    order?: string;
    module?: string;
  }>;
};

import PermissionsPagePackage from "@repo/dashboard/seguridad/permisos/page"

// Código del permiso que permite crear permisos
const CREATE_PERMISSION_CODE = "create:permissions";

export default async function PermissionsPage({ searchParams }: PageProps) {
  return (
    <PermissionsPagePackage searchParams={searchParams}/>
  )
}
