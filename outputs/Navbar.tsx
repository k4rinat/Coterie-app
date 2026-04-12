"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "Pricing",      href: "/pricing"      },
  { label: "For Brands",   href: "/brands"        },
  { label: "Contact",      href: "/contact"       },
];

const accountLinks = [
  { label: "Dashboard",      href: "/app"                  },
  { label: "My Profile",     href: "/app/profile"          },
  { label: "Opportunities",  href: "/app/opportunities"    },
  { label: "Events",         href: "/app/events"           },
  { label: "Introductions",  href: "/app/introductions"    },
];

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="w-8 h-8 flex items-center justify-center text-c-muted hover:text-c-text transition-colors duration-200"
    >
      {theme === "dark" ? (
        <svg width="14" height="14" viewBox="0 0 15 15" fill="none" aria-hidden="true">
          <circle cx="7.5" cy="7.5" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14M3.05 3.05l1.06 1.06M10.89 10.89l1.06 1.06M10.89 4.11l1.06-1.06M3.05 11.95l1.06-1.06" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      ) : (
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M12.5 9A6 6 0 0 1 5 1.5a6 6 0 1 0 7.5 7.5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </button>
  );
}

function AccountDropdown() {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => { logout(); setOpen(false); router.push("/home"); };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="label-caps text-c-muted hover:text-c-text transition-colors duration-200 flex items-center gap-2"
      >
        Account
        <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-4 w-44 bg-c-bg border border-c-border z-50">
          {accountLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
              className="block px-5 py-3 label-caps text-c-muted hover:text-c-text transition-colors duration-150">
              {link.label}
            </Link>
          ))}
          <div className="border-t border-c-border">
            <button onClick={handleLogout}
              className="w-full text-left px-5 py-3 label-caps text-c-muted hover:text-c-text transition-colors duration-150">
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileAccountOpen, setMobileAccountOpen] = useState(false);
  const pathname = usePathname();
  const { isLoggedIn, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  const handleMobileLogout = () => { logout(); setOpen(false); router.push("/home"); };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
      scrolled ? "bg-c-bg border-b border-c-border" : "bg-transparent"
    }`}>
      <nav aria-label="Main navigation"
        className="max-w-8xl mx-auto px-8 lg:px-16 h-20 flex items-center justify-between">

        {/* Wordmark */}
        <Link href="/home" aria-label="Coterie — home"
          className="font-serif text-2xl text-c-text tracking-[0.16em] hover:opacity-70 transition-opacity duration-200">
          Coterie
        </Link>

        {/* Desktop nav — centered */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}
              className={`label-caps transition-colors duration-200 hover:text-c-text ${
                pathname === link.href ? "text-c-text" : "text-c-muted"
              }`}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop right — theme + auth */}
        <div className="hidden md:flex items-center gap-5">
          <ThemeToggle />
          {!isLoading && (
            isLoggedIn ? (
              <AccountDropdown />
            ) : (
              <>
                <Link href="/sign-in" className="label-caps text-c-muted hover:text-c-text transition-colors duration-200">
                  Sign In
                </Link>
                <Link href="/apply" className="btn-primary py-2 px-5 text-[10px]">
                  Apply
                </Link>
              </>
            )
          )}
        </div>

        {/* Mobile: theme + hamburger */}
        <div className="md:hidden flex items-center gap-1">
          <ThemeToggle />
          <button onClick={() => setOpen(!open)} className="p-2 -mr-2"
            aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
            <span className={`block w-5 h-px bg-c-text transition-all duration-200 mb-1.5 ${open ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-px bg-c-text transition-all duration-200 mb-1.5 ${open ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-px bg-c-text transition-all duration-200 ${open ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-c-bg border-t border-c-border px-8 py-10 flex flex-col gap-7">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}
              className="label-caps text-c-muted hover:text-c-text transition-colors duration-200">
              {link.label}
            </Link>
          ))}
          <div className="border-t border-c-border pt-7 flex flex-col gap-6">
            {!isLoading && (
              isLoggedIn ? (
                <>
                  <button onClick={() => setMobileAccountOpen(!mobileAccountOpen)}
                    className="label-caps text-c-muted hover:text-c-text transition-colors duration-200 text-left flex items-center justify-between">
                    Account
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true"
                      className={`transition-transform duration-200 ${mobileAccountOpen ? "rotate-180" : ""}`}>
                      <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  {mobileAccountOpen && (
                    <div className="flex flex-col gap-5 pl-4 border-l border-c-border">
                      {accountLinks.map((link) => (
                        <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
                          className="label-caps text-c-muted hover:text-c-text transition-colors duration-200">
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}
                  <button onClick={handleMobileLogout}
                    className="label-caps text-c-muted hover:text-c-text transition-colors duration-200 text-left">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/sign-in" className="label-caps text-c-muted hover:text-c-text transition-colors duration-200">
                    Sign In
                  </Link>
                  <Link href="/apply" className="btn-primary self-start">
                    Apply for Membership
                  </Link>
                </>
              )
            )}
          </div>
        </div>
      )}
    </header>
  );
}
