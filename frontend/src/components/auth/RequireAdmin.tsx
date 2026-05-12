"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useEffectiveRole } from "@/hooks/useEffectiveRole";

/**
 * Same-origin SSR cannot see cross-site API cookies; admin check must run in the
 * browser where `credentials: "include"` reaches Render.
 */
export default function RequireAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const { isAdmin, isLoadingRole } = useEffectiveRole();

  const busy = sessionPending || (session?.user && isLoadingRole);

  useEffect(() => {
    if (sessionPending) return;
    if (!session?.user) {
      router.replace("/login");
      return;
    }
    if (!isLoadingRole && !isAdmin) {
      router.replace("/");
    }
  }, [sessionPending, session, isLoadingRole, isAdmin, router]);

  if (busy) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-zinc-500">
        Loading…
      </div>
    );
  }

  if (!session?.user || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}
