import { Trip, TripInput } from "@/types/trip";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getTrips(): Promise<Trip[]> {
  const res = await fetch(`${API_URL}/trips`, {
    cache: "no-store",
    headers: {
      ...authHeaders(),
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch trips: ${res.status}`);
  }
  return res.json();
}

export async function getTrip(id: number): Promise<Trip> {
  const res = await fetch(`${API_URL}/trips/${id}`, {
    cache: "no-store",
    headers: {
      ...authHeaders(),
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch trip ${id}: ${res.status}`);
  }
  return res.json();
}

export async function generateTrip(data: TripInput): Promise<Trip> {
  const res = await fetch(`${API_URL}/trips`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Failed to create trip: ${res.status}`);
  }
  return res.json();
}