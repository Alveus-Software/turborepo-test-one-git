import EditContactPagePackage from "@repo/dashboard/contacts-parent/contacts/edit/id/page"

interface EditContactPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditContactPage({ params }: EditContactPageProps) {
  return (
    <EditContactPagePackage params={params}/>
  )
}
 