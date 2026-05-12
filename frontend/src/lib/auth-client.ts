import { createAuthClient } from "better-auth/react";
import { getAppOrigin } from "./app-origin";

const authBaseURL =
  typeof window !== "undefined" ? window.location.origin : getAppOrigin();

export const authClient = createAuthClient({
  baseURL: authBaseURL,
});
