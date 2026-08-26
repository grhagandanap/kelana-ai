import Link from "next/link";
import MarkdownContent from "./MarkdownContent";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type Trip = {
  id: number;
  destination: string;
  days: number;
  budget: number;
  daily_budget: number;
  category: string;
  ai_recommendation: string | null;
};

async function getTrip(id: string): Promise<Trip> {
  const response = await fetch(`${API_URL}/api/v1/trips/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Trip not found");
  }

  return response.json();
}

export default async function TripRecommendationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trip = await getTrip(id);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🌌</span>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Kelana AI
              </span>
            </Link>
            <div className="flex items-center gap-8">
              <Link href="/" className="text-slate-300 hover:text-cyan-400 transition font-medium">Home</Link>
              <Link href="/" className="text-slate-300 hover:text-cyan-400 transition font-medium">Trip</Link>
              <Link href="/about" className="text-slate-300 hover:text-cyan-400 transition font-medium">About</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition font-medium"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Plan another trip
          </Link>

          <div className="mt-8">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              {trip.destination}
            </h1>
            <div className="mt-4 flex flex-wrap gap-4 text-slate-300">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                {trip.days} days
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-400" />
                {trip.category}
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-purple-400" />
                ${trip.budget.toLocaleString()} budget
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-pink-400" />
                ${trip.daily_budget.toLocaleString()}/day
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="px-4 pb-16 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8 shadow-2xl backdrop-blur-xl sm:p-10 md:p-12">
            {/* Decorative elements */}
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-purple-400/10 blur-3xl" />
            
            <div className="relative">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-white sm:text-3xl">
                  Your Personalized Itinerary
                </h2>
              </div>
              
              <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur sm:p-8">
                {trip.ai_recommendation ? (
                  <MarkdownContent content={trip.ai_recommendation} />
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-4 rounded-full bg-slate-800/50 p-4">
                      <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-slate-400">Your recommendation is being prepared...</p>
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
