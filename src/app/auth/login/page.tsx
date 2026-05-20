"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Mail, Lock, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      const redirectTo = localStorage.getItem("redirectTo");
      if (redirectTo) {
        localStorage.removeItem("redirectTo");
        window.location.href = redirectTo;
        return;
      }

      // Route based on role
      const { data: userResponse } = await supabase.auth.getUser();
      if (userResponse?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", userResponse.user.id)
          .single();

        if (profile?.role === "admin") {
          window.location.href = "/admin";
        } else if (profile?.role === "partner") {
          window.location.href = "/partner";
        } else {
          window.location.href = "/dashboard";
        }
      } else {
        window.location.href = "/dashboard";
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-6 py-24">
      <div className="bg-card max-w-md w-full rounded-3xl shadow-xl border border-border overflow-hidden">
        <div className="bg-brand-green p-8 text-white text-center">
          <div className="flex justify-center mb-4">
            <ShieldCheck size={48} />
          </div>
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="opacity-80">Sign in to manage your bookings</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-2 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="email"
                required
                className="w-full bg-muted/50 border-border rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-brand-green transition-all"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="password"
                required
                className="w-full bg-muted/50 border-border rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-brand-green transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-green text-white py-4 rounded-xl font-bold hover:bg-brand-green/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
            <ArrowRight size={20} />
          </button>

          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/auth/register" className="text-brand-green font-bold hover:underline">
              Create Account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
