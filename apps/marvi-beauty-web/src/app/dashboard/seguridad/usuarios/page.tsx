import UsersPackage from "@repo/dashboard/seguridad/usuarios/page"

type PageProps = {
  searchParams: Promise<{
    page?: string
    search?: string
    profile?: string 
    sort?: string
    order?: string
  }>
}

export default async function Page({ searchParams }: PageProps) {
  return (
    <UsersPackage searchParams={searchParams}/>
  )
}