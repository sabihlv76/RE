"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Globe, User, LogOut, LayoutDashboard, Compass } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "react-i18next";

const NAV_LINKS = [
  { href: "/tours",     label: "nav.tours",     en: "Tours" },
  { href: "/hotels",    label: "nav.hotels",     en: "Hotels" },
  { href: "/packages",  label: "nav.packages",   en: "Packages" },
  { href: "/agencies",  label: "nav.agencies",   en: "Agencies" },
  { href: "/about",     label: "nav.about",      en: "About" },
];

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "rw", label: "Kinyarwanda", flag: "🇷🇼" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const { t, i18n } = useTranslation();

  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [currentLang, setCurrentLang] = useState(LANGUAGES[0]);

  // Detect scroll position + progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(scrollTop > 60);
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync language from i18n
  useEffect(() => {
    const found = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];
    setCurrentLang(found);
  }, [i18n.language]);

  // Fetch user session
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) {
        supabase.from("profiles").select("role,full_name").eq("id", data.user.id).single()
          .then(({ data: p }) => setProfile(p));
      }
    });
  }, [supabase]);

  const switchLang = useCallback((lang: typeof LANGUAGES[0]) => {
    i18n.changeLanguage(lang.code);
    localStorage.setItem("language", lang.code);
    setCurrentLang(lang);
    setLangOpen(false);
  }, [i18n]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const isHomePage = pathname === "/";
  const isTransparent = isHomePage && !scrolled;

  return (
    <>
      {/* Scroll progress bar */}
      <div
        className="scroll-progress"
        style={{ width: `${scrollProgress}%` }}
      />

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isTransparent
            ? "bg-transparent"
            : "bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="w-9 h-9 bg-brand-green rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Compass size={20} className="text-white" />
              </div>
              <div>
                <span className={`font-display font-bold text-lg leading-none transition-colors duration-300 ${
                  isTransparent ? "text-white" : "text-foreground"
                }`}>
                  Rwanda<span className="text-brand-gold">Explore</span>
                </span>
                <p className={`text-[9px] font-semibold uppercase tracking-[0.15em] leading-none mt-0.5 transition-colors duration-300 ${
                  isTransparent ? "text-white/70" : "text-muted-foreground"
                }`}>
                  Land of a Thousand Hills
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive(link.href)
                      ? "bg-brand-green text-white shadow-sm"
                      : isTransparent
                        ? "text-white/90 hover:text-white hover:bg-white/10"
                        : "text-foreground/80 hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {t(link.label, link.en)}
                </Link>
              ))}
            </nav>

            {/* Right Controls */}
            <div className="flex items-center gap-2">

              {/* Language Switcher */}
              <div className="relative hidden md:block">
                <button
                  onClick={() => { setLangOpen(!langOpen); setUserMenuOpen(false); }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isTransparent
                      ? "text-white/90 hover:bg-white/10"
                      : "text-foreground/80 hover:bg-muted"
                  }`}
                >
                  <Globe size={15} />
                  <span>{currentLang.flag} {currentLang.code.toUpperCase()}</span>
                  <ChevronDown size={13} className={`transition-transform ${langOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 top-full mt-2 w-44 bg-card rounded-xl border border-border shadow-lg overflow-hidden"
                    >
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => switchLang(lang)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors hover:bg-muted ${
                            currentLang.code === lang.code ? "text-brand-green bg-muted/50" : "text-foreground"
                          }`}
                        >
                          <span className="text-base">{lang.flag}</span>
                          {lang.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Auth controls */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => { setUserMenuOpen(!userMenuOpen); setLangOpen(false); }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                      isTransparent ? "text-white/90 hover:bg-white/10" : "text-foreground/80 hover:bg-muted"
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-brand-green text-white flex items-center justify-center text-xs font-bold">
                      {profile?.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                    </div>
                    <ChevronDown size={13} className={`transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-52 bg-card rounded-xl border border-border shadow-lg overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-border">
                          <p className="font-bold text-sm truncate">{profile?.full_name || "User"}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                        <Link href={profile?.role === "admin" ? "/admin" : "/dashboard"}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm font-semibold hover:bg-muted transition-colors"
                        >
                          <LayoutDashboard size={16} className="text-brand-green" />
                          Dashboard
                        </Link>
                        <button onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link href="/auth/login"
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      isTransparent ? "text-white/90 hover:bg-white/10" : "text-foreground/80 hover:bg-muted"
                    }`}
                  >
                    Sign In
                  </Link>
                  <Link href="/auth/register"
                    className="px-4 py-2 bg-brand-green text-white rounded-lg text-sm font-semibold hover:bg-brand-green/90 transition-all shadow-sm hover:shadow-md"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`lg:hidden p-2 rounded-lg transition-all ${
                  isTransparent ? "text-white hover:bg-white/10" : "text-foreground hover:bg-muted"
                }`}
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="lg:hidden bg-card border-t border-border overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive(link.href)
                        ? "bg-brand-green text-white"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {t(link.label, link.en)}
                  </Link>
                ))}
                <div className="pt-2 border-t border-border mt-2 space-y-1">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { switchLang(lang); setMobileOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        currentLang.code === lang.code ? "bg-brand-green/10 text-brand-green" : "text-foreground hover:bg-muted"
                      }`}
                    >
                      {lang.flag} {lang.label}
                    </button>
                  ))}
                </div>
                {!user && (
                  <div className="pt-2 border-t border-border mt-2 flex flex-col gap-2">
                    <Link href="/auth/login" onClick={() => setMobileOpen(false)}
                      className="w-full text-center px-4 py-3 rounded-xl text-sm font-semibold border border-border hover:bg-muted transition-all"
                    >
                      Sign In
                    </Link>
                    <Link href="/auth/register" onClick={() => setMobileOpen(false)}
                      className="w-full text-center px-4 py-3 bg-brand-green text-white rounded-xl text-sm font-bold hover:bg-brand-green/90 transition-all"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
