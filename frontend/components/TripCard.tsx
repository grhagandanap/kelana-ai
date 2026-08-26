import Link from "next/link";
import { Trip } from "@/types/trip";

const CATEGORY_STYLES: Record<string, string> = {
  budget: "bg-emerald-400/10 text-emerald-300 border-emerald-400/30",
  solo: "bg-purple-400/10 text-purple-300 border-purple-400/30",
  family: "bg-amber-400/10 text-amber-300 border-amber-400/30",
  luxury: "bg-pink-400/10 text-pink-300 border-pink-400/30",
  adventure: "bg-orange-400/10 text-orange-300 border-orange-400/30",
  relaxation: "bg-cyan-400/10 text-cyan-300 border-cyan-400/30",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function TripCard({ trip }: { trip: Trip }) {
  const badgeStyle =
    CATEGORY_STYLES[trip.category] ??
    "bg-slate-400/10 text-slate-300 border-slate-400/30";

  return (
    <Link
      href={`/trips/${trip.id}`}
      className="group relative block overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/30 hover:shadow-cyan-400/10"
    >
      <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl transition-opacity duration-300 group-hover:opacity-80" />

      <div className="relative space-y-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-semibold text-white">
            {trip.destination}
          </h3>
          {trip.category && (
            <span
              className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium capitalize ${badgeStyle}`}
            >
              {trip.category}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300">
          <div className="flex items-center gap-1.5">
            <svg className="h-4 w-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {trip.days} {trip.days === 1 ? "day" : "days"}
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="h-4 w-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V6m0 10v2" />
            </svg>
            {formatCurrency(trip.budget)} total
          </div>
        </div>

        <div className="border-t border-white/10 pt-3 text-sm text-slate-400">
          {formatCurrency(trip.daily_budget)} / day
        </div>

        <div className="flex items-center gap-1.5 text-sm font-medium text-cyan-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          View itinerary
          <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </div>
    </Link>
  );
}