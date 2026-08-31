"use client";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import TripCard from "@/components/TripCard";
import { Trip } from "@/types/trip";
import { getTrips } from "@/services/tripService";

const TRAVEL_STYLE_OPTIONS = [
  { value: "All", label: "All styles" },
  { value: "Couple", label: "Couple" },
  { value: "Solo", label: "Solo" },
  { value: "Family", label: "Family" },
];

const PAGE_SIZE = 10;

export default function TripsList() {
  const [initialTrips, setInitialTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [travelStyle, setTravelStyle] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function loadTrips() {
      try {
        const data = await getTrips();
        setInitialTrips(data);
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : "Failed to load trips");
      } finally {
        setIsLoading(false);
      }
    }
    loadTrips();
  }, []);

  const filteredTrips = useMemo(() => {
    return initialTrips.filter((trip) => {
      const matchesSearch = trip.destination
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesTravelStyle = travelStyle === "All" || trip.travel_style === travelStyle;
      return matchesSearch && matchesTravelStyle;
    });
  }, [initialTrips, search, travelStyle]);

  useEffect(() => {
    setPage(1);
  }, [search, travelStyle]);

  const totalPages = Math.max(1, Math.ceil(filteredTrips.length / PAGE_SIZE));

  const paginatedTrips = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredTrips.slice(start, start + PAGE_SIZE);
  }, [filteredTrips, page]);

  const hasActiveFilters = search.length > 0 || travelStyle !== "All";

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-3xl border border-red-400/30 bg-red-400/10 p-12 text-center text-red-300">
        {loadError}
      </div>
    );
  }

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

          <div className="relative w-full shrink-0 sm:w-56">
            <select
              value={travelStyle}
              onChange={(e) => setTravelStyle(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-white/20 bg-slate-900/50 py-4 pl-6 pr-10 text-white outline-none transition-all duration-300 focus:border-cyan-400/50 focus:bg-slate-900/80 focus:shadow-lg focus:shadow-cyan-400/10"
            >
              {TRAVEL_STYLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
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
        <>
          <div className="">
            {paginatedTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 rounded-xl border border-white/20 px-4 py-2 text-sm text-white transition disabled:opacity-40 disabled:cursor-not-allowed hover:border-cyan-400/50"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </button>

              <span className="px-4 text-sm text-slate-300">
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1 rounded-xl border border-white/20 px-4 py-2 text-sm text-white transition disabled:opacity-40 disabled:cursor-not-allowed hover:border-cyan-400/50"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}