"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  FileText,
  Database,
  LogOut,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Content", href: "/admin/content", icon: FileText },
  { name: "Imports", href: "/admin/imports", icon: Database },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-zinc-200 bg-white">
      {/* Header */}
      <div className="flex h-16 items-center gap-2 border-b border-zinc-200 px-6">
        <span className="text-lg font-bold tracking-tight text-zinc-950">
          ClearUp Admin
        </span>
      </div>
      {/* Nav */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all duration-300 ${isActive ? "bg-zinc-100 font-medium text-zinc-950 shadow-sm" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"}`}
            >
              <Icon
                size={18}
                className={isActive ? "text-zinc-950" : "text-zinc-500"}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      {/* Leave Admin Dashboard */}
      <div className="p-4 pb-15">
        <Link href="/">
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-zinc-950 transition-all duration-300 hover:bg-red-100 hover:text-red-400">
            <LogOut size={18} />
            Back to Landing
          </button>
        </Link>
      </div>
    </aside>
  );
}
