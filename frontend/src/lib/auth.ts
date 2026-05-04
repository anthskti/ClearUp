const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

export const getSession = async (cookieString: string): Promise<any> => {
  const res = await fetch(`${API_URL}/api/auth/get-session`, {
    headers: { cookie: cookieString },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to get session");
  return res.json();
};

export const getEffectiveUser = async (
  cookieString: string,
): Promise<{ id: string; email: string | null; role: "user" | "admin" } | null> => {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    headers: { cookie: cookieString },
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
};
