interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    product_id?: string;
    from_location?: string;
    to_location?: string;
    date_from?: string;
    date_to?: string;
    movement_type?: string;
  }>;
}

import MovementsPagePackage from "@repo/dashboard/inventarios/historial/page"

export default async function MovementsPage({ searchParams }: PageProps) {
  return(
    <MovementsPagePackage searchParams={searchParams}/>
  )
}
