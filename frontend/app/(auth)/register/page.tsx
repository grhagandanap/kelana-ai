"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser, loginUser } from "@/services/authService";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const name = String(formData.get("name") ?? "");
      const email = String(formData.get("email") ?? "");
      const password = String(formData.get("password") ?? "");

      await registerUser({ name, email, password });

      // Auto-login right after registering, so the user doesn't
      // have to type their credentials twice
      const loginResponse = await loginUser({ email, password });
      localStorage.setItem("access_token", loginResponse.access_token);

      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-white">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8 shadow-2xl backdrop-blur-xl sm:p-10">
        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-purple-400/10 blur-3xl" />

        <div className="relative">
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-3xl font-semibold text-white sm:text-4xl">
              Create Account
            </h1>
            <p className="text-slate-300">
              Sign up to start planning trips with AI
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <label htmlFor="name" className="text-base font-medium text-slate-200">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Jane Doe"
                className="w-full rounded-2xl border border-white/20 bg-slate-900/50 px-5 py-4 text-white placeholder-slate-500 outline-none transition-all duration-300 focus:border-cyan-400/50 focus:bg-slate-900/80 focus:shadow-lg focus:shadow-cyan-400/10"
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="email" className="text-base font-medium text-slate-200">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-white/20 bg-slate-900/50 px-5 py-4 text-white placeholder-slate-500 outline-none transition-all duration-300 focus:border-cyan-400/50 focus:bg-slate-900/80 focus:shadow-lg focus:shadow-cyan-400/10"
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="password" className="text-base font-medium text-slate-200">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                placeholder="At least 8 characters"
                className="w-full rounded-2xl border border-white/20 bg-slate-900/50 px-5 py-4 text-white placeholder-slate-500 outline-none transition-all duration-300 focus:border-cyan-400/50 focus:bg-slate-900/80 focus:shadow-lg focus:shadow-cyan-400/10"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500 px-8 py-4 font-semibold text-slate-950 transition-all duration-300 hover:from-cyan-300 hover:via-cyan-400 hover:to-blue-400 hover:shadow-lg hover:shadow-cyan-400/25 disabled:opacity-60"
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="relative flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  "Sign Up"
                )}
              </span>
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-cyan-400 hover:text-cyan-300">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}