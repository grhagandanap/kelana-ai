"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import TripCard from "@/components/TripCard";
import { Trip } from "@/types/trip";

const CATEGORY_OPTIONS = [
  { value: "all", label: "All styles" },
  { value: "budget", label: "Budget-friendly" },
  { value: "solo", label: "Solo adventure" },
  { value: "family", label: "Family trip" },
  { value: "luxury", label: "Luxury experience" },
  { value: "adventure", label: "Adventure seeker" },
  { value: "relaxation", label: "Relaxation & wellness" },
];

export default function TripsList({ initialTrips }: { initialTrips: Trip[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filteredTrips = useMemo(() => {
    return initialTrips.filter((trip) => {
      const matchesSearch = trip.destination
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        category === "all" || trip.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [initialTrips, search, category]);

  const hasActiveFilters = search.length > 0 || category !== "all";

  return (
    <>
      <div className="mb-10">
        <h1 className="text-3xl font-semibold sm:text-4xl">Your Trips</h1>
        <p className="mt-2 text-slate-300">
          {filteredTrips.length > 0
            ? `${filteredTrips.length} ${filteredTrips.length === 1 ? "itinerary" : "itineraries"} generated so far`
            : "No trips yet — plan your first one to see it here."}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Search by destination"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-white/20 bg-slate-900/50 px-5 py-4 text-white placeholder-slate-500 outline-none transition-all duration-300 focus:border-cyan-400/50 focus:bg-slate-900/80 focus:shadow-lg focus:shadow-cyan-400/10 sm:px-6"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full shrink-0 rounded-2xl border border-white/20 bg-slate-900/50 px-5 py-4 text-white outline-none transition-all duration-300 focus:border-cyan-400/50 focus:bg-slate-900/80 focus:shadow-lg focus:shadow-cyan-400/10 sm:w-56 sm:px-6"
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredTrips.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center text-slate-400">
          <p className="mb-6">
            {initialTrips.length === 0
              ? "You haven't created any trips yet."
              : hasActiveFilters
              ? "No trips match your filters."
              : "No trips match your search."}
          </p>
          {initialTrips.length === 0 && (
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 font-semibold text-slate-950 transition hover:from-cyan-300 hover:to-blue-400"
            >
              Plan a trip
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </>
  );
}