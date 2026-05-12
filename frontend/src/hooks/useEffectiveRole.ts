"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

type EffectiveRole = "user" | "admin";

type EffectiveUser = {
  id: string;
  email: string | null;
  role: EffectiveRole;
};

export function useEffectiveRole() {
  const { data: session, isPending } = authClient.useSession();
  const [user, setUser] = useState<EffectiveUser | null>(null);
  const [isLoadingRole, setIsLoadingRole] = useState(true);

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      setUser(null);
      setIsLoadingRole(false);
      return;
    }

    let isCancelled = false;
    setIsLoadingRole(true);

    const run = async () => {
      try {
        const res = await fetch(`${window.location.origin}/api/auth/me`, {
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          setUser(null);
          return;
        }

        const data = (await res.json()) as EffectiveUser;
        if (!isCancelled) {
          setUser(data);
        }
      } catch {
        if (!isCancelled) {
          setUser(null);
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingRole(false);
        }
      }
    };

    void run();

    return () => {
      isCancelled = true;
    };
  }, [session, isPending]);

  return {
    isPendingSession: isPending,
    isLoadingRole,
    effectiveUser: user,
    effectiveRole: user?.role ?? null,
    isAdmin: user?.role === "admin",
  };
}
