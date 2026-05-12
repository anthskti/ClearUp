import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getEffectiveUser } from "@/lib/auth";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const cookieString = headersList.get("cookie") || "";
  const user = await getEffectiveUser(cookieString).catch(() => null);

  if (!user?.id) {
    redirect("/login");
  }

  return <>{children}</>;
}
