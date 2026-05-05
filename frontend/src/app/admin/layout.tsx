import { ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-zinc-50 text-zinc-900">
      {/* Sidebar */}
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden bg-zinc-50">
        {/* Header */}
        <div className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-zinc-200 bg-white/80 px-8 backdrop-blur-md">
          <AdminHeader />
        </div>
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
