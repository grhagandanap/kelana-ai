"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, User } from "lucide-react";
import { logout } from "@/services/authService";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Re-check on every route change — covers login/logout/register redirects
    setIsAuthenticated(!!localStorage.getItem("access_token"));
  }, [pathname]);

  function handleLogout() {
    logout();
    setIsAuthenticated(false);
    router.push("/login");
  }

  const publicLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
  ];

  const authedLinks = [
    { href: "/", label: "Home" },
    { href: "/trips", label: "Trip" },
    { href: "/about", label: "About" },
  ];

  const links = isAuthenticated ? authedLinks : publicLinks;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
          >
            Kelana AI
          </Link>

          <div className="flex items-center gap-8">
            {links.map((link) => {
              const isActive =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-bold transition ${
                    isActive ? "text-cyan-400" : "text-slate-300 hover:text-cyan-400"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  className={`flex items-center gap-1.5 font-bold transition ${
                    pathname.startsWith("/profile")
                      ? "text-cyan-400"
                      : "text-slate-300 hover:text-cyan-400"
                  }`}
                >
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 font-bold text-slate-300 transition hover:text-red-400"
                >
                  Log Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-2 font-bold text-slate-950 transition hover:from-cyan-300 hover:to-blue-400"
              >
                Log In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}