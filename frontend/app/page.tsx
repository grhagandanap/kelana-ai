"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const payload = {
        destination: String(formData.get("destination") ?? ""),
        days: Number(formData.get("days")),
        budget: Number(formData.get("budget")),
        travel_style: String(formData.get("travel_style") ?? ""),
      };
      const response = await fetch(`${API_URL}/api/v1/trips`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Failed to create trip");
      }
      const trip = await response.json();
      router.push(`/trips/${trip.id}`);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10">
          <p className="mb-3 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-300">
            Kelana AI
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Plan your next trip with AI
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
            Tell us where you want to go, how long you will travel, your budget,
            and your preferred travel style. Kelana AI will help generate your
            trip plan.
          </p>
        </div>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
          <form className="grid gap-6" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <label
                htmlFor="destination"
                className="text-sm font-medium text-slate-200"
              >
                Destination
              </label>
              <input
                id="destination"
                name="destination"
                type="text"
                placeholder="e.g. Bali, Yogyakarta, Tokyo"
                className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
              />
            </div>

            <div className="grid gap-2 sm:grid-cols-2 sm:gap-6">
              <div className="grid gap-2">
                <label
                  htmlFor="days"
                  className="text-sm font-medium text-slate-200"
                >
                  Days
                </label>
                <input
                  id="days"
                  name="days"
                  type="number"
                  min="1"
                  placeholder="e.g. 3"
                  className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
                />
              </div>

              <div className="grid gap-2">
                <label
                  htmlFor="budget"
                  className="text-sm font-medium text-slate-200"
                >
                  Budget
                </label>
                <input
                  id="budget"
                  name="budget"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 1500000"
                  className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="travelStyle"
                className="text-sm font-medium text-slate-200"
              >
                Travel Style
              </label>
              <select
                id="travelStyle"
                name="travel_style"
                defaultValue=""
                className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
              >
                <option value="" disabled>
                  Select your style
                </option>
                <option value="budget">Budget</option>
                <option value="solo">Solo</option>
                <option value="family">Family</option>
                <option value="luxury">Luxury</option>
                <option value="adventure">Adventure</option>
                <option value="relaxation">Relaxation</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 inline-flex items-center justify-center rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
                </>
              ) : (
                "Generate Trip Plan"
              )}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
