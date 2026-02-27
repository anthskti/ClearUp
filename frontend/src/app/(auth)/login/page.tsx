"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import ProceduralWave from "@/components/themes/ProceduralWave";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      router.push("/");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <ProceduralWave seed={4} height={190} />
      <form onSubmit={handleLogin} className="w-2/5">
        <h1 className="text-2xl font-semibold mb-4">Sign In to ClearUp</h1>
        <div className="py-2">
          <div className="py-1">
            <span className="font-bold text-zinc-900 uppercase text-sm md:text-xs tracking-wide">
              Email
            </span>
            <input
              type="text"
              placeholder="your@email.com"
              className="text-sm w-full p-2 border rounded"
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
                className="text-sm w-full p-2 border rounded"
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
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </div>
        <Button variant="secondary" className="mt-2">
          Login
        </Button>
      </form>
      <div className="flex flex-col items-start text-xs py-4 w-2/5">
        <div className="py-2">
          Need an account?{" "}
          <Link href="/register" className="text-stone-900 hover:text-gray-700">
            Sign up
          </Link>
        </div>
        <div className="py-2">
          Forgot your password?{" "}
          <Link
            href="/reset-password"
            className="text-stone-900 hover:text-gray-700"
          >
            Reset it
          </Link>
        </div>
      </div>
    </div>
  );
}
