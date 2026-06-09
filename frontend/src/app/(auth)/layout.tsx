"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { usePathname, useRouter } from "next/navigation";
import BrandedLoadingScreen from "@/components/BrandedLoadingScreen";
import ClearupLogoLink from "@/components/ClearupLogoLink";

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
      <BrandedLoadingScreen
        fullScreen
        title="Loading session"
        subtitle="Checking your Clearup account."
      />
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="fixed top-0 left-0 z-20 px-4 py-4 md:px-6 md:py-5">
        <ClearupLogoLink priority />
      </div>
      {children}
    </div>
  );
}
