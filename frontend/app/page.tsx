"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const scrollToForm = () => {
    document.getElementById('trip-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const payload = {
        destination: String(formData.get("destination") ?? ""),
        days: Number(formData.get("days")),
        budget: Number(formData.get("budget")),
        travel_style: String(formData.get("travel_style") ?? ""),
      };
      const response = await fetch(`${API_URL}/api/v1/trips`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Failed to create trip");
      }
      const trip = await response.json();
      router.push(`/trips/${trip.id}`);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Kelana AI
              </span>
            </div>
            <div className="flex items-center gap-8">
              <a href="#" className="text-slate-300 hover:text-cyan-400 transition font-bold">Home</a>
              <button onClick={scrollToForm} className="text-slate-300 hover:text-cyan-400 transition font-bold">Trip</button>
              <a href="/about" className="text-slate-300 hover:text-cyan-400 transition font-bold">About</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1531366936337-7c912a4589a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-slate-950" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white drop-shadow-2xl sm:text-5xl md:text-6xl lg:text-7xl">
            Plan Your Next Trip with AI
          </h1>
          <p className="max-w-2xl text-lg text-slate-200 drop-shadow-lg sm:text-xl md:text-2xl">
            Tell us where you want to go, how long you'll travel, your budget,
            and your preferred travel style. We'll generate your perfect trip plan.
          </p>
          <div className="mt-8 flex animate-bounce">
            <svg className="h-8 w-8 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="px-4 py-12 sm:px-6 md:px-8 lg:px-12 pt-24">
        <div className="mx-auto max-w-4xl">
          <section id="trip-form" className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8 shadow-2xl backdrop-blur-xl sm:p-10 md:p-12">
            {/* Decorative elements */}
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-purple-400/10 blur-3xl" />
            
            <div className="relative">
              <div className="mb-8 text-center">
                <h2 className="mb-3 text-3xl font-semibold text-white sm:text-4xl">
                  Let's Plan Your Adventure
                </h2>
                <p className="text-slate-300">
                  Tell us about your dream trip and we'll craft the perfect itinerary for you
                </p>
              </div>
              
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="space-y-3">
                  <label
                    htmlFor="destination"
                    className="text-base font-medium text-slate-200"
                  >
                    Where do you want to go?
                  </label>
                  <input
                    id="destination"
                    name="destination"
                    type="text"
                    placeholder="Bali, Yogyakarta, Tokyo..."
                    className="w-full rounded-2xl border border-white/20 bg-slate-900/50 px-5 py-4 text-white placeholder-slate-500 outline-none transition-all duration-300 focus:border-cyan-400/50 focus:bg-slate-900/80 focus:shadow-lg focus:shadow-cyan-400/10 sm:px-6"
                  />
                </div>

                <div className="grid gap-8 sm:grid-cols-2">
                  <div className="space-y-3">
                    <label
                      htmlFor="days"
                      className="text-base font-medium text-slate-200"
                    >
                      How many days?
                    </label>
                    <input
                      id="days"
                      name="days"
                      type="number"
                      min="1"
                      placeholder="3 days"
                      className="w-full rounded-2xl border border-white/20 bg-slate-900/50 px-5 py-4 text-white placeholder-slate-500 outline-none transition-all duration-300 focus:border-cyan-400/50 focus:bg-slate-900/80 focus:shadow-lg focus:shadow-cyan-400/10 sm:px-6"
                    />
                  </div>

                  <div className="space-y-3">
                    <label
                      htmlFor="budget"
                      className="text-base font-medium text-slate-200"
                    >
                      What's your budget?
                    </label>
                    <input
                      id="budget"
                      name="budget"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="$1,500"
                      className="w-full rounded-2xl border border-white/20 bg-slate-900/50 px-5 py-4 text-white placeholder-slate-500 outline-none transition-all duration-300 focus:border-cyan-400/50 focus:bg-slate-900/80 focus:shadow-lg focus:shadow-cyan-400/10 sm:px-6"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label
                    htmlFor="travelStyle"
                    className="text-base font-medium text-slate-200"
                  >
                    What's your travel style?
                  </label>
                  <select
                    id="travelStyle"
                    name="travel_style"
                    defaultValue=""
                    className="w-full rounded-2xl border border-white/20 bg-slate-900/50 px-5 py-4 text-white outline-none transition-all duration-300 focus:border-cyan-400/50 focus:bg-slate-900/80 focus:shadow-lg focus:shadow-cyan-400/10 sm:px-6"
                  >
                    <option value="" disabled className="text-slate-500">
                      Choose your vibe...
                    </option>
                    <option value="budget">Budget-friendly</option>
                    <option value="solo">Solo adventure</option>
                    <option value="family">Family trip</option>
                    <option value="luxury">Luxury experience</option>
                    <option value="adventure">Adventure seeker</option>
                    <option value="relaxation">Relaxation & wellness</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500 px-8 py-5 font-semibold text-slate-950 transition-all duration-300 hover:from-cyan-300 hover:via-cyan-400 hover:to-blue-400 hover:shadow-lg hover:shadow-cyan-400/25 sm:px-10"
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="relative flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
                        <span>Crafting your journey...</span>
                      </>
                    ) : (
                      <>
                        <span>Start Planning</span>
                        <svg className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </span>
                </button>
              </form>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-900/50 px-4 py-8 sm:px-6 md:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Kelana AI</h3>
              <p className="text-sm text-slate-400">
                Your AI-powered travel planning assistant. Create perfect itineraries in seconds.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-white">Quick Links</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-cyan-400 transition">Home</a></li>
                <li><a href="/about" className="hover:text-cyan-400 transition">About</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-white">Support</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-cyan-400 transition">Help Center</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition">Contact Us</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition">FAQ</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-slate-400">
            <p>&copy; {new Date().getFullYear()} Kelana AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
