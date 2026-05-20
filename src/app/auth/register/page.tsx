"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Mail, Lock, User, ArrowRight, Briefcase, CheckCircle2, MailCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"tourist" | "partner">("tourist");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Sign up the user with a dynamic redirect back to this site's callback
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        // 2. Insert profile row (may fail if email confirmation is pending — that's OK)
        await supabase.from("profiles").upsert({
          id: data.user.id,
          full_name: fullName,
          email: email,
          role: role,
        });

        // 3. Show email verification prompt — do NOT redirect yet
        setSuccess(true);
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Email Verification Success Screen ───────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-card max-w-md w-full rounded-3xl shadow-xl border border-border overflow-hidden text-center"
        >
          <div className="bg-brand-green p-8 text-white">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-4"
            >
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <MailCheck size={40} className="text-white" />
              </div>
            </motion.div>
            <h1 className="text-2xl font-bold font-display">Check Your Email!</h1>
            <p className="opacity-80 text-sm mt-2">
              We&apos;ve sent a verification link to
            </p>
            <p className="font-bold text-brand-gold mt-1 break-all">{email}</p>
          </div>

          <div className="p-8 space-y-5">
            <div className="space-y-3 text-left">
              {[
                "Open the email from RwandaExplore",
                "Click the \"Confirm your email\" button",
                "You'll be redirected to sign in",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-brand-green text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">{step}</p>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left">
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-amber-600 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-700 font-medium">
                  Can&apos;t find the email? Check your spam or junk folder. The link expires in 24 hours.
                </p>
              </div>
            </div>

            <Link
              href="/auth/login"
              className="block w-full text-center bg-brand-green text-white py-3.5 rounded-xl font-bold hover:bg-brand-green/90 transition-all"
            >
              Go to Sign In
            </Link>
            <p className="text-xs text-center text-muted-foreground">
              Wrong email?{" "}
              <button
                onClick={() => { setSuccess(false); setEmail(""); setPassword(""); }}
                className="text-brand-green font-bold hover:underline"
              >
                Register again
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── Registration Form ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-card max-w-lg w-full rounded-3xl shadow-xl border border-border overflow-hidden"
      >
        {/* Top Header Card */}
        <div className="bg-brand-green p-8 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.2),transparent)]" />
          <div className="flex justify-center mb-4 relative z-10">
            <ShieldCheck size={48} className="text-brand-gold animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold font-display relative z-10">Create Your Account</h1>
          <p className="opacity-80 text-sm mt-1 relative z-10">Start your adventure or manage your tourism business</p>
        </div>

        <form onSubmit={handleRegister} className="p-6 sm:p-8 space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 font-medium"
            >
              {error}
            </motion.div>
          )}

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 ml-1">
              I want to join as a
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("tourist")}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                  role === "tourist"
                    ? "border-brand-green bg-brand-green/5 text-brand-green shadow-sm font-semibold"
                    : "border-border bg-card text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <User size={24} className={role === "tourist" ? "text-brand-green mb-2" : "text-muted-foreground mb-2"} />
                <span className="text-sm font-bold">Tourist</span>
                <span className="text-[10px] opacity-80 mt-1">Book services &amp; events</span>
              </button>

              <button
                type="button"
                onClick={() => setRole("partner")}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                  role === "partner"
                    ? "border-brand-green bg-brand-green/5 text-brand-green shadow-sm font-semibold"
                    : "border-border bg-card text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <Briefcase size={24} className={role === "partner" ? "text-brand-green mb-2" : "text-muted-foreground mb-2"} />
                <span className="text-sm font-bold">Partner</span>
                <span className="text-[10px] opacity-80 mt-1">List &amp; offer experiences</span>
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold mb-2 ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                required
                className="w-full bg-muted/50 border border-border rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all outline-none"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-sm font-semibold mb-2 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="email"
                required
                className="w-full bg-muted/50 border border-border rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all outline-none"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold mb-2 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="password"
                required
                minLength={6}
                className="w-full bg-muted/50 border border-border rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all outline-none"
                placeholder="•••••••• (Min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-green text-white py-4 rounded-xl font-bold hover:bg-brand-green/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-lg hover:shadow-xl"
          >
            {loading ? "Creating Account..." : "Sign Up & Verify Email"}
            <ArrowRight size={20} />
          </button>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-brand-green font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
