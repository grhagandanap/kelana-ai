import { getTrips } from "@/services/tripService";
import TripsList from "@/components/TripsList";

export default async function TripsPage() {
  const trips = await getTrips();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="px-4 py-12 pt-28 sm:px-6 md:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <TripsList initialTrips={trips} />
        </div>
      </main>
    </div>
  );
}