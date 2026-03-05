const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

export const getSession = async (cookieString: string): Promise<any> => {
  const res = await fetch(`${API_URL}/api/auth/get-session`, {
    headers: { cookie: cookieString },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to get session");
  return res.json();
};
