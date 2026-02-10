import DashboardClientLayout from "./dashboard-client-layout";
import { getModulesHierarchy } from "@repo/lib/actions/module.actions";
import { getCurrentUser, User } from "@repo/lib/actions/user.actions"

export default async function DashboardContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const modules = await getModulesHierarchy(true);
  const { data } = await getCurrentUser();
  
  const currentUser = data?.user 
    ? {
        id: data.user.id,
        email: data.user.email ?? '',
        full_name: data.user.user_metadata?.full_name ?? '',
        active: data.user.user_metadata?.active ?? true
      }
    : null;

  return (
    <DashboardClientLayout
      modules={modules}
      currentUser={currentUser as User}
    >
      {children}
    </DashboardClientLayout>
  );
}