import Link from "next/link";
import { getTrips } from "@/services/tripService";
import TripCard from "@/components/TripCard";

export default async function TripsPage() {
  const trips = await getTrips();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Kelana AI
            </Link>
            <div className="flex items-center gap-8">
              <Link href="/" className="text-slate-300 hover:text-cyan-400 transition font-bold">Home</Link>
              <Link href="/trips" className="text-cyan-400 font-bold">Trip</Link>
              <Link href="/about" className="text-slate-300 hover:text-cyan-400 transition font-bold">About</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="px-4 py-12 pt-28 sm:px-6 md:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <h1 className="text-3xl font-semibold sm:text-4xl">Your Trips</h1>
            <p className="mt-2 text-slate-300">
              {trips.length > 0
                ? `${trips.length} ${trips.length === 1 ? "itinerary" : "itineraries"} generated so far`
                : "No trips yet — plan your first one to see it here."}
            </p>
          </div>

          {trips.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center text-slate-400">
              <p className="mb-6">You haven't created any trips yet.</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 font-semibold text-slate-950 transition hover:from-cyan-300 hover:to-blue-400"
              >
                Plan a trip
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {trips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}