"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import ProceduralWave from "@/components/themes/ProceduralWave";

type UiState = "idle" | "loading" | "success" | "invalid" | "expired" | "error";

// Complete password reset with token from email link. For unauthenticated users.
// Need to wire authClient.resetPassword (or equivalent) + map API errors to invalid/expired.
function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [state, setState] = useState<UiState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (state !== "success") return;
    const id = window.setTimeout(() => {
      router.push("/login");
    }, 5000);
    return () => window.clearTimeout(id);
  }, [state, router]);

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-sm text-zinc-500">
          Missing reset token. Use the link from your email.
        </p>
        <Link
          href="/forgot-password"
          className="text-sm underline hover:text-zinc-600 transition-all duration-300"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  if (state === "success") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3">
        <p className="font-medium text-green-700">Password updated.</p>
        <p className="text-sm text-zinc-500">
          Redirecting to sign in in 5 seconds…
        </p>
        <Link href="/login">
          <Button variant="secondary" className="w-full">
            Sign in now
          </Button>
        </Link>
      </div>
    );
  }

  if (state === "invalid" || state === "expired") {
    return (
      <div className="mx-auto max-w-md p-8 text-center space-y-4">
        <p className="text-sm text-zinc-700">
          {state === "expired"
            ? "This reset link has expired."
            : "This reset link is invalid or was already used."}
        </p>
        <Link href="/forgot-password" className="text-sm underline">
          Request a new link
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    setErrorMessage(null);
    setState("loading");
    try {
      const { error } = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (error) {
        const msg = (error.message || "").toLowerCase();
        if (msg.includes("expired") || msg.includes("expire")) {
          setState("expired");
        } else if (
          msg.includes("invalid") ||
          msg.includes("token") ||
          error.message === "INVALID_TOKEN"
        ) {
          setState("invalid");
        } else {
          setState("error");
          setErrorMessage(error.message || "Could not reset password. Try again.");
        }
        return;
      }

      setState("success");
    } catch {
      setState("error");
      setErrorMessage("Could not reset password. Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <ProceduralWave seed={4} height={190} />
      <div className="w-2/5">
        <h1 className="text-2xl font-semibold mb-4">Set a New Password!</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border p-2 text-sm"
            placeholder="Your new password"
            autoComplete="new-password"
          />
          <input
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full rounded border p-2 text-sm"
            placeholder="Confirm password"
            autoComplete="new-password"
          />
          {errorMessage && (
            <p className="text-sm text-red-600">{errorMessage}</p>
          )}
          <Button type="submit" variant="outline" className="w-full">
            Update password
          </Button>
        </form>
        <Link
          href="/login"
          className="mt-4 block text-center text-sm text-zinc-500 underline hover:text-zinc-700 transition-all duration-300"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}

export default function PasswordResetPage() {
  return (
    <Suspense fallback={<p className="p-8 text-center text-sm">Loading…</p>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
