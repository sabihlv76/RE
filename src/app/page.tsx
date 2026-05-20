"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, Star, ShieldCheck, Zap, MapPin,
  Clock, Users, Award, ChevronDown, Phone
} from "lucide-react";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";

/* ---- Scroll-reveal hook ---- */
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    const targets = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ---- Static Data ---- */
const DESTINATIONS = [
  { name: "Volcanoes National Park", tag: "Trekking", price: "from $1,500", image: "/volcanoes.png", rating: 4.9 },
  { name: "Akagera National Park",   tag: "Safari",   price: "from $300",   image: "/akagera.png",  rating: 4.8 },
  { name: "Lake Kivu",               tag: "Leisure",  price: "from $150",   image: "/kivu.png",     rating: 4.9 },
];

const STATS = [
  { value: "120+", label: "Verified Partners", icon: <ShieldCheck size={22} className="text-brand-gold" /> },
  { value: "15K+", label: "Happy Travellers",  icon: <Users        size={22} className="text-brand-gold" /> },
  { value: "50+",  label: "Unique Experiences",icon: <Award        size={22} className="text-brand-gold" /> },
  { value: "4.9",  label: "Average Rating",    icon: <Star         size={22} className="text-brand-gold" /> },
];

const WHY_US = [
  { icon: <ShieldCheck size={32} className="text-brand-green" />, title: "RTTA Verified", desc: "Every partner on our platform is licensed and vetted by the Rwanda Tours & Travel Association." },
  { icon: <Zap         size={32} className="text-brand-green" />, title: "Instant Booking", desc: "Confirm your safari, hotel, or experience in seconds with real-time availability." },
  { icon: <Phone       size={32} className="text-brand-green" />, title: "Local Payments",  desc: "Pay securely with MTN MoMo, Airtel Money, Visa, or bank transfer. No hidden fees." },
];

const EXPERIENCES = [
  { title: "Mountain Gorilla Trekking",       location: "Volcanoes NP",     price: "$1,500", duration: "Full Day",   image: "/volcanoes.png" },
  { title: "Akagera Big Five Safari",         location: "Akagera NP",       price: "$350",   duration: "2 Days",     image: "/akagera.png" },
  { title: "Nyungwe Canopy Walk",             location: "Nyungwe Forest",   price: "$120",   duration: "Half Day",   image: "/hero.png" },
  { title: "Lake Kivu Sunset Cruise",        location: "Rubavu",            price: "$85",    duration: "3 Hours",    image: "/kivu.png" },
];

export default function HomePage() {
  const { t } = useTranslation();
  useScrollReveal();

  return (
    <div className="flex flex-col min-h-screen bg-background">

      {/* ========== HERO ========== */}
      <section className="relative h-screen min-h-[620px] flex flex-col items-center justify-center overflow-hidden">
        <Image
          src="/hero.png"
          alt="Rwanda — Land of a Thousand Hills"
          fill
          className="object-cover object-center scale-105"
          priority
          quality={90}
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest mb-8 text-white/90">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
            {t("home.badge", "Welcome to Rwanda")}
          </div>

          <h1 className="font-display font-bold text-white leading-none mb-6 drop-shadow-2xl"
            style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)" }}>
            {t("home.hero_title", "Discover the Heart")}
            <br />
            <span className="text-gradient-gold">{t("home.hero_title2", "of Africa")}</span>
          </h1>

          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-white/85 font-medium leading-relaxed drop-shadow-md">
            {t("home.hero_subtitle", "Book verified gorilla treks, luxury eco-lodges, and immersive cultural experiences across Rwanda's breathtaking landscapes.")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/tours"
              className="btn-primary text-base px-8 py-4 shadow-xl hover:shadow-2xl"
            >
              {t("home.explore", "Explore Tours")}
              <ArrowRight size={18} />
            </Link>
            <Link href="/agencies"
              className="inline-flex items-center gap-2 px-7 py-4 border border-white/40 text-white rounded-full font-semibold text-base hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              <ShieldCheck size={18} />
              {t("home.view_agencies", "View Verified Agencies")}
            </Link>
          </div>
        </div>

        {/* Scroll cue */}
        <button
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/60 hover:text-white transition-colors"
        >
          <span className="text-[10px] font-semibold uppercase tracking-widest">Scroll</span>
          <ChevronDown size={18} className="animate-bounce" />
        </button>
      </section>

      {/* ========== STATS BAR ========== */}
      <section className="relative z-10 bg-brand-green">
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-white/20">
          {STATS.map((stat, i) => (
            <div key={i} className="flex items-center gap-4 md:justify-center px-4 reveal" style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="bg-white/10 p-2.5 rounded-xl shrink-0">{stat.icon}</div>
              <div>
                <p className="text-2xl font-extrabold font-display text-white">{stat.value}</p>
                <p className="text-xs text-white/70 font-semibold">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========== DESTINATIONS ========== */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div className="reveal-left">
              <span className="text-brand-gold text-sm font-bold uppercase tracking-widest">Destinations</span>
              <h2 className="font-display mt-2">Popular Destinations</h2>
              <p className="text-muted-foreground mt-2 max-w-md">Handpicked iconic locations across Rwanda's extraordinary landscape.</p>
            </div>
            <Link href="/tours" className="reveal-right inline-flex items-center gap-2 text-brand-green font-bold hover:underline text-sm">
              View all destinations <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DESTINATIONS.map((dest, i) => (
              <div key={i} className={`reveal card-hover delay-${(i + 1) * 100}`}>
                <div className="group relative h-96 rounded-2xl overflow-hidden shadow-lg cursor-pointer">
                  <Image src={dest.image} alt={dest.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-brand-gold text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {dest.tag}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/15 backdrop-blur-sm rounded-full px-2 py-1">
                    <Star size={11} fill="white" className="text-white" />
                    <span className="text-white text-xs font-bold">{dest.rating}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-display text-xl font-bold text-white mb-1">{dest.name}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-white/80 text-sm">{dest.price}</p>
                      <span className="text-xs bg-white/15 backdrop-blur-sm text-white px-3 py-1 rounded-full font-semibold">Explore →</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== ABOUT STRIP ========== */}
      <section className="py-20 px-6 bg-muted/40">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="reveal-left">
            <span className="text-brand-gold text-sm font-bold uppercase tracking-widest">About Rwanda</span>
            <h2 className="font-display mt-3 mb-5">The Land of a<br /><span className="text-brand-green">Thousand Hills</span></h2>
            <p className="text-muted-foreground leading-relaxed mb-5">
              Rwanda is one of Africa's most extraordinary destinations — a small country packed with biodiversity, dramatic scenery, rich culture, and remarkable resilience. From the mist-covered Volcanoes National Park, home to endangered mountain gorillas, to the crystal-clear waters of Lake Kivu and the vast savannahs of Akagera, every corner of Rwanda tells a unique story.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Our platform connects you directly with Rwanda's best-vetted, RTTA-certified tour operators to ensure your experience is authentic, safe, and unforgettable.
            </p>
            <Link href="/about" className="btn-primary">
              Learn More <ArrowRight size={16} />
            </Link>
          </div>
          <div className="relative reveal-right">
            <div className="relative h-[420px] rounded-2xl overflow-hidden shadow-xl">
              <Image src="/akagera.png" alt="Rwanda Landscape" fill className="object-cover" />
            </div>
            {/* Floating accent card */}
            <div className="absolute -bottom-6 -left-6 bg-card border border-border rounded-2xl p-5 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-green/10 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="text-brand-green" size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm">RTTA Certified</p>
                  <p className="text-xs text-muted-foreground">All partners verified</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FEATURED TOURS ========== */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 reveal">
            <span className="text-brand-gold text-sm font-bold uppercase tracking-widest">Experiences</span>
            <h2 className="font-display mt-2">Top Experiences</h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">Curated adventures for every type of traveller — from the thrill-seeker to the luxury lounger.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {EXPERIENCES.map((exp, i) => (
              <Link href="/tours" key={i} className={`reveal delay-${(i + 1) * 100} card-hover`}>
                <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm group">
                  <div className="relative h-52 overflow-hidden">
                    <Image src={exp.image} alt={exp.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-1 text-muted-foreground text-xs mb-2">
                      <MapPin size={12} /> {exp.location}
                    </div>
                    <h3 className="font-bold text-sm font-display mb-3 group-hover:text-brand-green transition-colors leading-snug">
                      {exp.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-brand-green font-extrabold text-base">{exp.price}</span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock size={11} /> {exp.duration}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12 reveal">
            <Link href="/tours" className="btn-outline">
              Browse All Tours <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ========== WHY CHOOSE US ========== */}
      <section className="py-24 px-6 bg-brand-green relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-white" />
        </div>
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-14 reveal">
            <span className="text-brand-gold text-sm font-bold uppercase tracking-widest">Why Rwanda Explore</span>
            <h2 className="font-display mt-2 text-white">Book with Confidence</h2>
            <p className="text-white/70 mt-3 max-w-lg mx-auto">The most trusted tourism marketplace in Rwanda — built for travellers, powered by locals.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {WHY_US.map((item, i) => (
              <div key={i} className={`reveal delay-${(i + 1) * 100} bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-8 text-center hover:bg-white/15 transition-colors`}>
                <div className="bg-white/15 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  {item.icon}
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-white/70 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CALL TO ACTION ========== */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="max-w-3xl mx-auto text-center reveal">
          <span className="text-brand-gold text-sm font-bold uppercase tracking-widest">Ready to Explore?</span>
          <h2 className="font-display mt-3 mb-5">Your Rwanda Adventure<br />Starts Here</h2>
          <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
            Join thousands of happy travellers who discovered Rwanda's magic with us. Book your personalised experience today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/tours" className="btn-primary text-base px-8 py-4">
              Start Planning <ArrowRight size={18} />
            </Link>
            <Link href="/auth/register" className="btn-outline text-base px-8 py-4">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
