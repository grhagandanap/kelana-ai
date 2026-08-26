import Link from "next/link";

export default function AboutPage() {
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
              <Link href="/about" className="text-cyan-400 font-medium">About</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden pt-16">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-slate-950" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white drop-shadow-2xl sm:text-5xl md:text-6xl">
            About Kelana AI
          </h1>
          <p className="max-w-2xl text-lg text-slate-200 drop-shadow-lg sm:text-xl">
            Discover how AI is revolutionizing travel planning
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="px-4 py-16 sm:px-6 md:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl space-y-16">
          {/* Mission Section */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur sm:p-10">
            <h2 className="mb-4 text-2xl font-semibold text-white sm:text-3xl">Our Mission</h2>
            <p className="text-slate-300 leading-relaxed">
              At Kelana AI, we believe that travel planning should be exciting, not exhausting. 
              Our mission is to harness the power of artificial intelligence to create personalized, 
              memorable travel experiences for everyone. We combine cutting-edge technology with 
              deep travel insights to help you discover the world in ways you never thought possible.
            </p>
          </section>

          {/* How It Works Section */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur sm:p-10">
            <h2 className="mb-6 text-2xl font-semibold text-white sm:text-3xl">How It Works</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/20 text-cyan-400">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white">Tell Us Your Dreams</h3>
                <p className="text-sm text-slate-400">Share your destination, duration, budget, and travel style preferences.</p>
              </div>
              <div className="space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-400/20 text-blue-400">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white">AI Creates Your Plan</h3>
                <p className="text-sm text-slate-400">Our AI analyzes your preferences and crafts a personalized itinerary.</p>
              </div>
              <div className="space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-400/20 text-purple-400">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white">Explore & Enjoy</h3>
                <p className="text-sm text-slate-400">Review your detailed plan and embark on your perfect adventure.</p>
              </div>
            </div>
          </section>

          {/* Technology Section */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur sm:p-10">
            <h2 className="mb-4 text-2xl font-semibold text-white sm:text-3xl">Powered by Advanced AI</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Kelana AI leverages state-of-the-art machine learning models and natural language processing 
              to understand your unique travel preferences. Our system continuously learns from millions of 
              travel experiences to provide recommendations that are both personalized and practical.
            </p>
            <p className="text-slate-300 leading-relaxed">
              We use AWS Bedrock's powerful AI services to ensure fast, accurate, and secure trip planning. 
              Your data is processed with the highest standards of privacy and security.
            </p>
          </section>

          {/* CTA Section */}
          <section className="rounded-2xl border border-cyan-400/30 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 p-8 text-center backdrop-blur sm:p-10">
            <h2 className="mb-4 text-2xl font-semibold text-white sm:text-3xl">Ready to Start Your Journey?</h2>
            <p className="mb-6 text-slate-300">
              Create your first AI-powered trip plan in just a few clicks.
            </p>
            <Link 
              href="/"
              className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-8 py-4 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Plan Your Trip
            </Link>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-900/50 px-4 py-8 sm:px-6 md:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col items-center gap-8 text-center sm:flex-row sm:justify-center sm:gap-12">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Kelana AI</h3>
              <p className="text-sm text-slate-400">
                Your AI-powered travel planning assistant. Create perfect itineraries in seconds.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-white">Quick Links</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/" className="hover:text-cyan-400 transition">Home</Link></li>
                <li><Link href="/about" className="hover:text-cyan-400 transition">About</Link></li>
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
