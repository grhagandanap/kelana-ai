import { Trip, TripInput } from "@/types/trip";

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function getTrips(): Promise<Trip[]> {
  const res = await fetch(`${API_URL}/trips`, {
    // re-fetch on every request; swap to { next: { revalidate: 60 } } if you want caching
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch trips: ${res.status}`);
  }
  return res.json();
}

export async function getTrip(id: number): Promise<Trip> {
  const res = await fetch(`${API_URL}/trips/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch trip ${id}: ${res.status}`);
  }
  return res.json();
}

export async function generateTrip(data: TripInput): Promise<Trip> {
  const res = await fetch(`${API_URL}/trips`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Failed to create trip: ${res.status}`);
  }
  return res.json();
}