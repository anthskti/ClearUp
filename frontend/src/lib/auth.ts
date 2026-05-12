import "server-only";
import { headers } from "next/headers";
import { getAppOrigin } from "./app-origin";

/** Prefer the live request host (www vs apex) over NEXT_PUBLIC_APP_URL so SSR cookies match the browser. */
async function resolveAuthFetchOrigin(): Promise<string> {
  try {
    const h = await headers();
    const hostRaw = h.get("x-forwarded-host") ?? h.get("host");
    if (hostRaw) {
      const host = hostRaw.split(",")[0].trim();
      if (host) {
        const protoRaw = (h.get("x-forwarded-proto") ?? "")
          .split(",")[0]
          .trim()
          .toLowerCase();
        const proto =
          protoRaw === "http" || protoRaw === "https"
            ? protoRaw
            : host.startsWith("localhost") || host.startsWith("127.0.0.1")
              ? "http"
              : "https";
        return `${proto}://${host}`;
      }
    }
  } catch {
    // headers() unavailable outside a request
  }
  return getAppOrigin();
}

export const getSession = async (cookieString: string): Promise<any> => {
  const origin = await resolveAuthFetchOrigin();
  const res = await fetch(`${origin}/api/auth/get-session`, {
    headers: { cookie: cookieString },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to get session");
  return res.json();
};

export const getEffectiveUser = async (
  cookieString: string,
): Promise<{ id: string; email: string | null; role: "user" | "admin" } | null> => {
  const origin = await resolveAuthFetchOrigin();
  const res = await fetch(`${origin}/api/auth/me`, {
    headers: { cookie: cookieString },
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
};
