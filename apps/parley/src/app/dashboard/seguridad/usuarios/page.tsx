type PageProps = {
  searchParams: Promise<{
    page?: string
    search?: string
    profile?: string 
    sort?: string
    order?: string
  }>
}

import UsersPackage from "@repo/dashboard/seguridad/usuarios/page"

export default async function Page({ searchParams }: PageProps) {
  return (
    <UsersPackage searchParams={searchParams}/>
  )
}
