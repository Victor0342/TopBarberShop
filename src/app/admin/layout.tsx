import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/admin-sidebar";
import { getAdminSession } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session?.user?.email || session.user.role !== "ADMIN") {
    redirect("/admin/login?callbackUrl=/admin");
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 px-6 pb-16 pt-10">{children}</main>
      </div>
    </div>
  );
}
