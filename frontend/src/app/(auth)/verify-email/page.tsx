// Not implementing it yet. Until everything is complete

"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

type UiState = "loading" | "success" | "invalid" | "expired" | "error" | "idle";

/**
 * Skeleton: verify email from link (?token=...) + optional "resend" when session exists.
 * TODO: Wire verify + sendVerificationEmail to better-auth client API.
 */
function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [state, setState] = useState<UiState>(token ? "loading" : "idle");
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        // TODO: await authClient.verifyEmail({ token }) or equivalent
        throw new Error(
          "Wire verify-email API (see docs/ACCOUNT_LIFECYCLE_SKELETON.md)",
        );
      } catch (e: any) {
        if (!cancelled) {
          // TODO: map error codes to expired / invalid
          setState("error");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleResend = async () => {
    if (!session?.user?.email) return;
    setState("loading");
    try {
      // TODO: await authClient.sendVerificationEmail({ email: session.user.email })
      setState("success");
    } catch {
      setState("error");
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
      <div className="mx-auto max-w-md p-8 text-center">
        <p className="font-medium text-green-700">Email verified.</p>
        <Link href="/" className="mt-4 inline-block text-sm underline">
          Continue
        </Link>
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
      <div className="mx-auto max-w-md p-8 text-center space-y-4">
        <p className="text-sm text-zinc-600">
          No verification token in the URL.
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

  return (
    <div className="mx-auto max-w-md p-8 text-center">
      <p className="text-sm text-red-600">
        Verification failed. Try again or request a new link.
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
