// Not implementing it yet. Until everything is complete

"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

type UiState = "loading" | "success" | "invalid" | "expired" | "error" | "idle";

/**
 * Skeleton: verify email from link (?token=...) + optional "resend" when session exists.
 * TODO: Wire verify + sendVerificationEmail to better-auth client API.
 */
function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const verified = searchParams.get("verified") === "1";
  const verifyError = searchParams.get("error");
  const callbackURL = searchParams.get("callbackURL") || "/";
  const emailFromQuery = searchParams.get("email");
  const [state, setState] = useState<UiState>(
    token ? "loading" : verified ? "success" : "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (state !== "success") return;
    const id = window.setTimeout(() => {
      if (session?.user?.id) {
        router.push("/");
      } else {
        router.push("/login");
      }
    }, 2500);
    return () => window.clearTimeout(id);
  }, [state, session, router]);

  useEffect(() => {
    if (!verifyError) return;
    const msg = verifyError.toLowerCase();
    if (msg.includes("expired")) {
      setState("expired");
      return;
    }
    if (msg.includes("invalid") || msg.includes("token")) {
      setState("invalid");
      return;
    }
    setState("error");
    setErrorMessage("Verification failed. Try again.");
  }, [verifyError]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const { error } = await authClient.verifyEmail({
          query: { token, callbackURL },
        });
        if (cancelled) return;
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
            setErrorMessage(error.message || "Verification failed.");
          }
          return;
        }
        setState("success");
      } catch (e: any) {
        if (!cancelled) {
          const msg = (e?.message || "").toLowerCase();
          if (msg.includes("expired") || msg.includes("expire")) {
            setState("expired");
          } else if (msg.includes("invalid") || msg.includes("token")) {
            setState("invalid");
          } else {
            setState("error");
            setErrorMessage("Verification failed. Try again.");
          }
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleResend = async () => {
    const targetEmail = session?.user?.email || emailFromQuery;
    if (!targetEmail) return;
    setState("loading");
    setErrorMessage(null);
    try {
      const { error } = await authClient.sendVerificationEmail({
        email: targetEmail,
        callbackURL: `${window.location.origin}/verify-email?verified=1`,
      });
      if (error) {
        setState("error");
        setErrorMessage(
          error.message || "Could not resend verification email.",
        );
        return;
      }
      setState("idle");
    } catch {
      setState("error");
      setErrorMessage("Could not resend verification email.");
    }
  };

  if (state === "loading" && token) {
    return (
      <p className="p-8 text-center text-sm text-zinc-500">
        Verifying your email…
      </p>
    );
  }

  if (state === "success") {
    return (
      <div className="mx-auto max-w-md p-8 text-center space-y-4">
        <p className="font-medium text-green-700">Email verified successfully.</p>
        <p className="text-sm text-zinc-500">
          Redirecting you in a moment...
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/" className="text-sm underline">
            Continue to app
          </Link>
          <Link href="/login" className="text-sm underline">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  if (state === "invalid" || state === "expired") {
    return (
      <div className="mx-auto max-w-md p-8 text-center space-y-4">
        <p className="text-sm text-zinc-700">
          {state === "expired"
            ? "This link has expired. Request a new verification email."
            : "This link is invalid or was already used."}
        </p>
        {session?.user?.email && (
          <Button type="button" onClick={handleResend}>
            Resend verification email
          </Button>
        )}
        <Link href="/login" className="block text-sm underline">
          Back to login
        </Link>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="mx-auto max-w-md py-32 text-center space-y-4">
        <h1 className="text-xl font-semibold">Verify your email</h1>
        <p className="text-sm text-zinc-600">
          We sent a verification link to your inbox. Open that link to continue.
        </p>
        <p className="text-xs text-zinc-500">
          If you do not see it, check spam and promotions.
        </p>
        {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
        {(session?.user?.email || emailFromQuery) && (
          <Button type="button" onClick={handleResend}>
            Resend verification email
          </Button>
        )}
        {!session?.user?.email && emailFromQuery && (
          <p className="text-xs text-zinc-500">Sending to: {emailFromQuery}</p>
        )}
        <Link href="/login" className="block text-sm underline">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md p-8 text-center">
      <p className="text-sm text-red-600">
        {errorMessage ||
          "Verification failed. Try again or request a new link."}
      </p>
      <Link href="/login" className="mt-4 inline-block text-sm underline">
        Back to login
      </Link>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<p className="p-8 text-center text-sm">Loading…</p>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
