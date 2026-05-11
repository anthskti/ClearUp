"use client";

import { usePathname } from "next/navigation";

const titles: { prefix: string; title: string }[] = [
  { prefix: "/admin/dashboard", title: "Dashboard" },
  { prefix: "/admin/users", title: "Users Information" },
  { prefix: "/admin/content", title: "Content + Guides" },
  { prefix: "/admin/imports", title: "Data Imports" },
];

export default function AdminHeader() {
  const pathname = usePathname();
  const match = titles.find((t) => pathname.startsWith(t.prefix));
  const title = match?.title ?? "Admin";

  return (
    <div className="text-xl font-semibold tracking-tight text-zinc-900">
      {title}
    </div>
  );
}
