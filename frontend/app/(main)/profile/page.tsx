"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe, logout } from "@/services/authService";
import { User } from "@/types/auth";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getMe();
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="rounded-3xl border border-red-400/30 bg-red-400/10 p-8 text-center text-red-300">
          {error ?? "Something went wrong"}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-start justify-center bg-slate-950 px-4 py-12 pt-28 text-white">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8 shadow-2xl backdrop-blur-xl sm:p-10">
        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-purple-400/10 blur-3xl" />

        <div className="relative">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-2xl font-bold text-slate-950">
              {(user.name ?? user.email).charAt(0).toUpperCase()}
            </div>
            <h1 className="text-2xl font-semibold">{user.name ?? "Traveler"}</h1>
            <p className="mt-1 text-slate-400">{user.email}</p>
          </div>

          <div className="space-y-4 border-t border-white/10 pt-6">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Name</span>
              <span className="font-medium">{user.name ?? "—"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Email</span>
              <span className="font-medium">{user.email}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="mt-8 w-full rounded-2xl border border-red-400/30 bg-red-400/10 px-6 py-3 font-semibold text-red-300 transition hover:bg-red-400/20"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}