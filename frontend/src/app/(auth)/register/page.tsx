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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <ProceduralWave seed={4} height={190} />
      <form onSubmit={handleRegister} className="w-2/5">
        <h1 className="text-2xl font-semibold mb-4">Create an Account</h1>
        <div className="py-2">
          <div className="py-1">
            <span className="font-bold text-zinc-900 uppercase text-sm md:text-xs tracking-wide">
              User
            </span>
            <input
              type="text"
              placeholder="display name"
              className="text-sm w-full p-2 border rounded"
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
            <div className="mt-2 text-sm">
              <p className="text-gray-600 mb-1">Password requirements:</p>
              <ul className="space-y-1">
                <li
                  className={`flex items-center space-x-2 ${
                    password.length >= 7 ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  <span className="text-xs">
                    {password.length >= 7 ? "✓" : "○"}
                  </span>
                  <span>At least 7 characters long</span>
                </li>
                <li
                  className={`flex items-center space-x-2 ${
                    /[A-Z]/.test(password) ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  <span className="text-xs">
                    {/[A-Z]/.test(password) ? "✓" : "○"}
                  </span>
                  <span>One uppercase letter</span>
                </li>
                <li
                  className={`flex items-center space-x-2 ${
                    /[a-z]/.test(password) ? "text-green-600" : "text-gray-500"
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
                      : "text-gray-500"
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
      <div className="flex flex-col items-start text-xs py-4 w-2/5">
        <div className="py-2">
          Already have an account?{" "}
          <Link href="/login" className="text-stone-900 hover:text-gray-700">
            Login
          </Link>
        </div>
        <div className="py-2">
          This site is protected by hCaptcha. Its Privacy Policy and Terms of
          Service apply.
        </div>
      </div>
    </div>
  );
}
