"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, Box, Search, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Footer from "@/components/Footer";

export default function PackagesPage() {
  const supabase = createClient();
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchPackages() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .eq("is_active", true)
          .eq("type", "package");

        if (data && data.length > 0) {
          const formatted = data.map((item) => ({
            id: item.id,
            title: item.title,
            location: item.location,
            price: item.price,
            rating: 4.9,
            reviews: 48,
            image: item.images?.[0] || "/hero.png",
          }));
          setPackages(formatted);
        } else {
          // Rich mock combo packages fallback
          setPackages([
            {
              id: "5",
              title: "Rwanda Ultimate Gorilla & Savannah Combo",
              location: "Volcanoes & Akagera National Parks",
              price: 1950,
              rating: 4.9,
              reviews: 48,
              image: "/hero.png",
            },
            {
              id: "6",
              title: "Kivu Resort & Nyungwe Trek Package",
              location: "Lakeside Resort & Canopy Forest",
              price: 580,
              rating: 4.8,
              reviews: 32,
              image: "/kivu.png",
            }
          ]);
        }
      } catch (err) {
        console.error("Error fetching packages:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPackages();
  }, [supabase]);

  const filteredPackages = packages.filter((pkg) =>
    pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div className="flex-grow">
        {/* Banner header */}
        <section className="relative h-[45vh] flex items-center justify-center overflow-hidden">
          <Image
            src="/hero.png"
            alt="Packages in Rwanda"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-background" />
          <div className="relative z-10 text-center text-white px-6">
            <span className="bg-brand-gold/90 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest mb-4 inline-block shadow-md">
              Combos
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold font-display leading-tight">
              Curated Holiday Packages
            </h1>
            <p className="text-sm md:text-base mt-2 max-w-xl mx-auto opacity-90 font-medium">
              Combine Gorilla permits, professional local guides, transfers, and high-end retreats.
            </p>
          </div>
        </section>

        {/* List section */}
        <section className="py-16 container mx-auto px-6 max-w-5xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-border">
            <div>
              <h2 className="text-xl font-bold font-display text-brand-green">Inclusive Travel Bundles</h2>
              <p className="text-xs text-muted-foreground font-medium mt-1">Stress-free premium experiences managed by top-tier local operators.</p>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                type="text"
                placeholder="Search packages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-card border border-border rounded-xl py-2.5 pl-10 pr-4 w-full text-xs font-semibold focus:ring-2 focus:ring-brand-green outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-24 text-center">
              <Loader2 className="animate-spin text-brand-green mx-auto mb-4" size={32} />
              <p className="text-sm text-muted-foreground">Loading active bundles...</p>
            </div>
          ) : filteredPackages.length === 0 ? (
            <div className="py-24 text-center text-muted-foreground">
              <Box className="mx-auto text-muted-foreground/30 mb-3 animate-pulse" size={48} />
              <p className="font-bold text-lg">No packages found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredPackages.map((pkg) => (
                <div key={pkg.id} className="bg-card rounded-2xl overflow-hidden border border-border/50 group hover:shadow-md transition-shadow flex flex-col md:flex-row shadow-sm">
                  <div className="relative w-full md:w-44 h-48 md:h-auto shrink-0 overflow-hidden">
                    <Image
                      src={pkg.image}
                      alt={pkg.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 flex flex-col justify-between flex-grow">
                    <div>
                      <div className="flex items-center gap-1 text-brand-gold text-xs font-bold mb-2">
                        <Star size={12} fill="currentColor" />
                        <span>{pkg.rating}</span>
                        <span className="text-muted-foreground font-medium">({pkg.reviews})</span>
                      </div>
                      <Link href={`/services/${pkg.id}`}>
                        <h3 className="font-bold text-base text-foreground group-hover:text-brand-green transition-colors font-display line-clamp-1">{pkg.title}</h3>
                      </Link>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1.5">
                        <MapPin size={12} /> {pkg.location}
                      </p>
                    </div>

                    <div className="flex justify-between items-center border-t border-border pt-4 mt-6">
                      <div>
                        <span className="text-base font-extrabold text-brand-green">${pkg.price}</span>
                        <span className="text-[10px] text-muted-foreground ml-1">/ bundle rate</span>
                      </div>
                      <Link
                        href={`/services/${pkg.id}`}
                        className="bg-brand-green text-white hover:bg-brand-green/90 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                      >
                        Book Combo
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
}
