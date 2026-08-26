import Link from "next/link";

export default function Footer() {
  return (
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
  );
}