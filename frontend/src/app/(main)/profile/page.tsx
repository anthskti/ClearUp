"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Trash2, User, Settings, ChevronDown } from "lucide-react";

import { getRoutinesByUserId } from "@/lib/routines";

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [routines, setRoutines] = useState([]);
  const [isLoadingRoutines, setIsLoadingRoutines] = useState(true);

  useEffect(() => {
    if (session?.user) {
      setUsername(session.user.name || "");
      const routineList = getRoutinesByUserId(session.user.id);
    }
  }, [session]);

  const handleUpdateProfile = async () => {
    await authClient.updateUser({
      name: username,
      // image: "new-pfp-url"
    });
    alert("Profile updated!");
  };

  const handleDeleteAccount = async () => {
    if (confirm("Are you absolutely sure? This cannot be undone.")) {
      await authClient.deleteUser();
      router.push("/");
    }
  };

  if (isPending)
    return <div className="p-10 text-center">Loading session...</div>; // TODO: PROCEDURAL WAVE LOAD
  if (!session) return <div className="p-10 text-center">Please log in.</div>; // TODO: REDIRECT

  return (
    <div className="flex flex-col items-center justify-center min-h-screen pt-20">
      <div className="w-2/4">
        {/* Top */}
        <div>
          <div className="text-2xl font-semibold mb-4">Preferences</div>
        </div>
        {/* Account Information Section */}
        <div className="text-xl font-semibold mb-4 pt-8">
          Profile Information
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
          {/* Email Row (with sub-label) */}
          <div className="flex items-center justify-between p-6 border-b border-zinc-200">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-zinc-900">
                Primary email
              </label>
            </div>
            <div className="relative w-2/3">
              <select className="w-full appearance-none border border-zinc-400 rounded-lg px-4 py-2 text-sm text-zinc-900 focus:outline-none">
                <option>your@email.com</option>
              </select>
              <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-zinc-500 pointer-events-none" />
            </div>
          </div>

          {/* Username Row */}
          <div className="flex items-center justify-between p-6 border-b border-zinc-200">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-zinc-900">
                Username
              </label>
              <span className="text-xs text-zinc-500 mt-1">
                Display name used across ClearUp
              </span>
            </div>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-2/3 border border-zinc-400"
            />
          </div>
          <div className="flex items-center justify-between p-6">
            <span></span>
            <Button variant="outline" size="sm">
              Save
            </Button>
          </div>
        </div>
        {/* Website Theme; Light, Dark, or System */}
        <div className="py-10">
          <div className="text-2xl font-semibold mb-4">Appearance</div>
          <div className="text-sm mb-4">Choose how ClearUp looks.</div>
          <div className="bg-white border border-zinc-200 rounded-lg p-6">
            <div className="">1</div>
          </div>
        </div>
        {/* Passsword and Auth from outside thing. Will either have Password, update, or oauth connection */}
        <div className="py-10">
          <div className="text-2xl font-semibold mb-4">
            Password and Authentication
          </div>
        </div>
        {/* Account Removal */}
        <div className="py-10">
          <div className="text-2xl font-semibold mb-4">Account Removal</div>
          Permanently delete your ClearUp Account.
          <div className="border border-red-700/50 bg-red-700/10 p-6 rounded-lg">
            <div className="flex flex-col gap-2">
              <div className="text-sm font-bold">
                Request for account deletion
              </div>
              <div className="text-sm">
                Request for account deletion. Deleting your account is permanent
                and cannot be undone. Your data will be deleted within 30 days.
              </div>
              <Button variant="destructive" onClick={handleDeleteAccount}>
                <Trash2 className="w-4 h-4 mr-2" /> Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
