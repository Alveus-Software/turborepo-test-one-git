import EditTaxPagePackage from "@repo/dashboard/impuestos/gestion/editar/id/page"

interface EditTaxPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditTaxPage({ params }: EditTaxPageProps) {
  return(
    <EditTaxPagePackage params={params}/>
  )
}