"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Section from "@/components/Section";
import { useAuth } from "@/contexts/AuthContext";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setError("");
    setLoading(true);
    // Mock auth — redirect to dashboard after short delay
    await new Promise((r) => setTimeout(r, 800));
    login();
    router.push("/app");
  };

  return (
    <Section size="hero">
      <div className="max-w-sm mx-auto lg:mx-0">
        <p className="label-caps mb-8">Member Access</p>
        <h1 className="font-serif text-5xl lg:text-6xl text-c-text leading-[1.0] mb-10">
          Sign In
        </h1>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="label-caps">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border border-c-border text-c-text text-sm px-4 py-3 placeholder:text-c-muted/50 focus:outline-none focus:border-c-muted transition-colors duration-200"
              placeholder="you@example.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="label-caps">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border border-c-border text-c-text text-sm px-4 py-3 placeholder:text-c-muted/50 focus:outline-none focus:border-c-muted transition-colors duration-200"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-c-border" />
            <span className="text-xs text-c-muted">or</span>
            <div className="flex-1 border-t border-c-border" />
          </div>

          <Link
            href="/apply"
            className="w-full text-center text-sm font-medium text-c-text bg-[rgb(var(--c-surface))] border border-c-border px-4 py-3 hover:opacity-80 transition-opacity duration-150"
          >
            Apply for Membership
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-c-border" />
            <span className="text-xs text-c-muted">or</span>
            <div className="flex-1 border-t border-c-border" />
          </div>

          <Link
            href="/book-demo"
            className="w-full text-center text-sm font-medium text-c-text bg-[rgb(var(--c-surface))] border border-c-border px-4 py-3 hover:opacity-80 transition-opacity duration-150"
          >
            Book a Demo
          </Link>
        </div>
      </div>
    </Section>
  );
}
