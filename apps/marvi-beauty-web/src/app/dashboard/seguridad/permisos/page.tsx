import PermissionsPagePackage from "@repo/dashboard/seguridad/permisos/page"

type PageProps = {
  searchParams: Promise<{
    page?: string;
    search?: string;
    sort?: string;
    order?: string;
    module?: string;
  }>;
};

// Código del permiso que permite crear permisos
const CREATE_PERMISSION_CODE = "create:permissions";

export default async function PermissionsPage({ searchParams }: PageProps) {
  return (
    <PermissionsPagePackage searchParams={searchParams}/>
  )
}