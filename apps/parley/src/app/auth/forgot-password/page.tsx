import ErrorPagePackage from "@repo/auth/error/page"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  return (
    <ErrorPagePackage searchParams={searchParams}/>
  )
}
