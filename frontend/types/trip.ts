export interface Trip {
  id: number;
  destination: string;
  days: number;
  budget: number;
  daily_budget: number;
  category: string;
  travel_style: string;
  ai_recommendation: string | null;
}

export interface TripInput {
  destination: string;
  days: number;
  budget: number;
  travel_style: string;
}