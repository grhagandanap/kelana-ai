import Link from "next/link";
import { notFound } from "next/navigation";
import { getTrip } from "@/services/tripService";
import MarkdownContent from "./MarkdownContent";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tripId = Number(id);

  if (Number.isNaN(tripId)) {
    notFound();
  }

  let trip;
  try {
    trip = await getTrip(tripId);
  } catch {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <main className="px-4 py-12 pt-28 sm:px-6 md:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/trips"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-cyan-400"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            Back to trips
          </Link>

          <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8 shadow-2xl backdrop-blur-xl sm:p-10">
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-purple-400/10 blur-3xl" />

            <div className="relative">
              <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-semibold sm:text-4xl">
                    {trip.destination}
                  </h1>
                  {trip.category && (
                    <span className="mt-3 inline-block rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium capitalize text-cyan-300">
                      {trip.category}
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Duration</p>
                  <p className="mt-1 text-xl font-semibold text-white">
                    {trip.days} {trip.days === 1 ? "day" : "days"}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Total budget</p>
                  <p className="mt-1 text-xl font-semibold text-white">
                    {formatCurrency(trip.budget)}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Daily budget</p>
                  <p className="mt-1 text-xl font-semibold text-white">
                    {formatCurrency(trip.daily_budget)}
                  </p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h2 className="mb-4 text-xl font-semibold text-white">
                  AI Recommendation
                </h2>
                {trip.ai_recommendation ? (
                  <MarkdownContent content={trip.ai_recommendation} />
                ) : (
                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/50 p-6 text-slate-400">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-400/30 border-t-cyan-400" />
                    Your recommendation is still being generated. Check back shortly.
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}