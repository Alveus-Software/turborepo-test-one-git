type PageProps = {
  searchParams: Promise<{
    page?: string;
    search?: string;
    sort?: string;
    order?: string;
  }>;
};

import ProfilesPagePackage from "@repo/dashboard/seguridad/perfiles/page"

export default async function ProfilesPage({ searchParams }: PageProps) {
  return (
    <ProfilesPagePackage searchParams={searchParams}/>
  )
}
