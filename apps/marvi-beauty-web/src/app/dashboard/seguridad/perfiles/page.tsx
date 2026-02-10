import ProfilesPagePackage from "@repo/dashboard/seguridad/perfiles/page"

type PageProps = {
  searchParams: Promise<{
    page?: string;
    search?: string;
    sort?: string;
    order?: string;
  }>;
};

export default async function ProfilesPage({ searchParams }: PageProps) {
  return (
    <ProfilesPagePackage searchParams={searchParams}/>
  )
}
