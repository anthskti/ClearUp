"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  // If there is a session token, DO NOT show these auth pages.
  useEffect(() => {
    if (!isPending && session) {
      router.push("/");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex items-center justify-start">
        {/* Add Icon or change next line to custom image*/}
        <p className="font-bold tracking-widest text-lg">CLEARUP</p>
      </div>
      {children}
    </div>
  );
}
