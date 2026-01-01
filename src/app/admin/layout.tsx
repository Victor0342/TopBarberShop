import AdminSidebar from "@/components/admin/admin-sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 px-6 pb-16 pt-10">{children}</main>
      </div>
    </div>
  );
}
