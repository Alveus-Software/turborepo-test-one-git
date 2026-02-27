type PageProps = {
  searchParams: Promise<{
    page?: string;
    search?: string;
    sort?: string;
    order?: string;
  }>;
};

import ManagementPagePackage from "@repo/dashboard/inventarios/almacenes/page"

export default async function ManagementPage({ searchParams }: PageProps) {
  return(
    <ManagementPagePackage searchParams={searchParams}/>
  )
}
