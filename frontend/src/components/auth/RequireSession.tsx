"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

/**
 * Use under Vercel + API on another origin: session cookies live on the API host,
 * so Next.js `headers().get("cookie")` on the frontend never includes them. Client
 * `authClient.useSession()` matches the browser cookie jar used for `/api/auth` on Render.
 */
export default function RequireSession({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-zinc-500">
        Loading…
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return <>{children}</>;
}
