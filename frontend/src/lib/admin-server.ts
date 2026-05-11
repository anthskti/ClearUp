import "server-only";
import { cookies } from "next/headers";
import type { RoutineWithProducts, FeaturedRoutine } from "@/types/routine";
import type { AdminDashboardStats } from "@/types/routine-admin";
import type { AdminUsersPagePayload } from "@/types/admin";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

async function cookieHeader(): Promise<string> {
  const store = await cookies();
  return store
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
}

async function fetchWithCookies(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const cookie = await cookieHeader();
  return fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...init?.headers,
      cookie,
    },
    cache: "no-store",
  });
}

export async function getAdminDashboardStatsServer(
  days = 14,
): Promise<AdminDashboardStats> {
  const res = await fetchWithCookies(
    `/api/routines/admin/stats?days=${encodeURIComponent(String(days))}`,
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { error?: string }).error || "Failed to load admin stats",
    );
  }
  return res.json();
}

export async function getFeaturedRoutinesServer(): Promise<FeaturedRoutine[]> {
  const res = await fetchWithCookies("/api/routines/admin/featured");
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { error?: string }).error || "Failed to load featured routines",
    );
  }
  return res.json();
}

export async function getAdminUsersServer(params: {
  limit?: number;
  offset?: number;
}): Promise<AdminUsersPagePayload> {
  const limit = params.limit ?? 25;
  const offset = params.offset ?? 0;
  const res = await fetchWithCookies(
    `/api/users/admin?limit=${limit}&offset=${offset}`,
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { error?: string }).error || "Failed to load users",
    );
  }
  return res.json();
}

export async function getAllRoutinesServer(
  limit = 100,
  offset = 0,
): Promise<RoutineWithProducts[]> {
  const res = await fetch(
    `${API_URL}/api/routines?limit=${limit}&offset=${offset}`,
    { cache: "no-store" },
  );
  if (!res.ok) {
    throw new Error("Failed to load routines");
  }
  return res.json();
}
