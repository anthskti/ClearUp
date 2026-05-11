"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { usePathname, useRouter } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  // If there is a session token, DO NOT show auth pages,
  // except verify-email which must be reachable after sign-up.
  useEffect(() => {
    if (!isPending && session && pathname !== "/verify-email") {
      router.push("/");
    }
  }, [isPending, session, pathname, router]);

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return <div className="">{children}</div>;
}
