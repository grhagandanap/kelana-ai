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
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <a href="/" className="text-sm text-cyan-300 hover:underline">
          ← Plan another trip
        </a>

        <h1 className="mt-6 text-4xl font-bold tracking-tight">
          {trip.destination}
        </h1>
        <p className="mt-2 text-slate-300">
          {trip.days} days · {trip.category} · budget {trip.budget} · daily{" "}
          {trip.daily_budget}
        </p>

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-lg font-semibold">AI recommendation</h2>
          {trip.ai_recommendation ? (
            <MarkdownContent content={trip.ai_recommendation} />
          ) : (
            <p className="text-slate-400">No recommendation yet.</p>
          )}
        </section>
      </div>
    </main>
  );
}
