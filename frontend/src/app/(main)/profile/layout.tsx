import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSession } from "@/lib/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | ClearUp",
  description: "Your profile.",
};

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const cookieString = headersList.get("cookie") || "";

  try {
    const session = await getSession(cookieString);
    if (!session?.user?.id) {
      redirect("/login");
    }
  } catch {
    redirect("/login");
  }

  return <>{children}</>;
}
