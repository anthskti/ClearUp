"use client";

import { useCrossTabSignOut } from "@/hooks/useCrossTabSignOut";

// Syncing sign out for multiple tabs
export function AuthSync() {
  useCrossTabSignOut();
  return null;
}