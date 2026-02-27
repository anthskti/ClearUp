import { createAuthClient } from "better-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

export const authClient = createAuthClient({
    baseURL: API_URL,
});