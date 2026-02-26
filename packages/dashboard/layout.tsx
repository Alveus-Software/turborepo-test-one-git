import DashboardContent from "@repo/dashboard/dashboard-content";

export default function DashboardLayoutPackage({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardContent>{children}</DashboardContent>;
} 