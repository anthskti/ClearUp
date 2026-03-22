"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import ProceduralWave from "@/components/themes/ProceduralWave";

type UiState = "idle" | "loading" | "success" | "error";

// Pipelined for "fogort-password", ui for changing the password
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<UiState>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("loading");
    setMessage(null);
    try {
      const { error } = await authClient.requestPasswordReset({
        email: email.trim(),
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setState("error");
        setMessage(error.message || "Could not send reset email. Try again.");
        return;
      }

      // Same copy whether or not the email exists (Better Auth + good UX practice).
      setState("success");
      setMessage(
        "If an account exists for that email, check your inbox for a reset link (and spam).",
      );
    } catch (err: unknown) {
      setState("error");
      setMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong. Try again later.",
      );
    }
  };

  if (state === "success") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-sm text-zinc-500">{message}</p>
        <Link
          href="/login"
          className="mt-4 inline-block text-sm underline hover:text-zinc-500 transition-all duration-300"
        >
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <ProceduralWave seed={4} height={190} />
      <div className="w-2/5">
        <h1 className="text-2xl font-semibold mb-4">Forgot your password?</h1>
        <p className="mb-6 text-sm text-zinc-500">
          Enter your email and you will get a reset link!
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border p-2 text-sm"
            placeholder="your@email.com"
          />
          {state === "error" && message && (
            <p className="text-sm text-red-600">{message}</p>
          )}
          <Button type="submit" variant="secondary" className="w-full">
            Send reset link
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
