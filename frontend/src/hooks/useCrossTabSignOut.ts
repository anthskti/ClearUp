"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const CHANNEL_NAME = "clearup-auth";
const STORAGE_KEY = "clearup:signout-at";

// Skeleton: when another tab signs out, sync this tab.
// Call `broadcastSignOut()` from the same place you call `authClient.signOut()`.
// TODO: Tune behavior for sign out only.
export function broadcastSignOut() {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    // ignore
  }
  try {
    const ch = new BroadcastChannel(CHANNEL_NAME);
    ch.postMessage({ type: "sign-out" });
    ch.close();
  } catch {
    // ignore
  }
}

export function useCrossTabSignOut() {
  const router = useRouter();

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || e.newValue == null) return;
      void authClient.signOut().finally(() => router.push("/login"));
    };

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel(CHANNEL_NAME);
      bc.onmessage = (event) => {
        if (event?.data?.type === "sign-out") {
          void authClient.signOut().finally(() => router.push("/login"));
        }
      };
    } catch {
      // ignore
    }

    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      bc?.close();
    };
  }, [router]);
}
