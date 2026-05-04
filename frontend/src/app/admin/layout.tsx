import { ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-white text-black">
      {/* Admin Sidebar */}
      <AdminSidebar />
      {/* Header */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/80 px-8 backdrop-blur-md">
          <div className="text-xl font-semibold text-zinc-950">Dashboard</div>
        </div>
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
