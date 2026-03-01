"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import ProceduralWave from "@/components/themes/ProceduralWave";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await authClient.signUp.email({
      email,
      password,
      name,
    });

    if (error) {
      alert(error.message);
    } else {
      router.push("/");
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const { data, error } = await authClient.signIn.social({
      provider: "google",
    });
    if (error) {
      alert(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <ProceduralWave seed={4} height={190} />
      <div className="w-2/5">
        <h1 className="text-2xl font-semibold mb-4">Create an Account</h1>
        {/* Google OAuth Button */}
        <Button
          type="button"
          variant="outline"
          className="w-full mb-4 flex items-center justify-center gap-2"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </Button>
        <div className="flex items-center my-4">
          <div className="grow border-t border-zinc-200"></div>
          <span className="mx-4 text-xs text-zinc-400 uppercase">OR</span>
          <div className="grow border-t border-zinc-200"></div>
        </div>
        <form onSubmit={handleRegister} className="">
          <div className="py-2">
            <div className="py-1">
              <span className="font-bold text-zinc-900 uppercase text-sm md:text-xs tracking-wide">
                User
              </span>
              <input
                type="text"
                placeholder="display name"
                className="text-sm w-full p-2 border border-zinc-400 rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="py-1">
              <span className="font-bold text-zinc-900 uppercase text-sm md:text-xs tracking-wide">
                Email
              </span>
              <input
                type="text"
                placeholder="your@email.com"
                className="text-sm w-full p-2 border border-zinc-400 rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="py-1">
              <span className="font-bold text-zinc-900 uppercase text-sm md:text-xs tracking-wide">
                Password
              </span>
              <div className="relative">
                <input
                  type={isVisible ? "text" : "password"}
                  placeholder="clear up your skin safely"
                  className="text-sm w-full p-2 border border-zinc-400 rounded"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={toggleVisibility}
                  className="absolute inset-y-1 right-0 flex items-center pr-3"
                  aria-label={isVisible ? "Hide password" : "Show password"}
                >
                  {isVisible ? (
                    <Eye className="h-5 w-5 text-zinc-400" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-zinc-400" />
                  )}
                </button>
              </div>
              <div className="mt-2 text-sm">
                <p className="text-zinc-600 mb-1">Password requirements:</p>
                <ul className="space-y-1">
                  <li
                    className={`flex items-center space-x-2 ${
                      password.length >= 7 ? "text-green-600" : "text-zinc-500"
                    }`}
                  >
                    <span className="text-xs">
                      {password.length >= 7 ? "✓" : "○"}
                    </span>
                    <span>At least 7 characters long</span>
                  </li>
                  <li
                    className={`flex items-center space-x-2 ${
                      /[A-Z]/.test(password)
                        ? "text-green-600"
                        : "text-zinc-500"
                    }`}
                  >
                    <span className="text-xs">
                      {/[A-Z]/.test(password) ? "✓" : "○"}
                    </span>
                    <span>One uppercase letter</span>
                  </li>
                  <li
                    className={`flex items-center space-x-2 ${
                      /[a-z]/.test(password)
                        ? "text-green-600"
                        : "text-zinc-500"
                    }`}
                  >
                    <span className="text-xs">
                      {/[a-z]/.test(password) ? "✓" : "○"}
                    </span>
                    <span>One lowercase letter</span>
                  </li>
                  <li
                    className={`flex items-center space-x-2 ${
                      /[!@#$%^&*(),.?":{}|<>]/.test(password)
                        ? "text-green-600"
                        : "text-zinc-500"
                    }`}
                  >
                    <span className="text-xs">
                      {/[!@#$%^&*(),.?":{}|<>]/.test(password) ? "✓" : "○"}
                    </span>
                    <span>One special character</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <Button variant="secondary" className="mt-2">
            Sign In
          </Button>
        </form>
        <div className="items-start text-xs py-4">
          <div className="py-2">
            Already have an account?{" "}
            <Link href="/login" className="text-stone-900 hover:text-zinc-700">
              Login
            </Link>
          </div>
          <div className="py-2">
            This site is protected by hCaptcha. Its Privacy Policy and Terms of
            Service apply.
          </div>
        </div>
      </div>
    </div>
  );
}
