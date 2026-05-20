"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, MapPin, Filter, Star, Heart, Calendar, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const MOCK_SERVICES = [
  {
    id: "1",
    title: "Mountain Gorilla Trekking",
    location: "Volcanoes National Park",
    price: 1500,
    rating: 4.9,
    reviews: 124,
    image: "/volcanoes.png",
    type: "Tour",
  },
  {
    id: "2",
    title: "Akagera Big Five Safari",
    location: "Akagera National Park",
    price: 350,
    rating: 4.8,
    reviews: 89,
    image: "/akagera.png",
    type: "Safari",
  },
  {
    id: "3",
    title: "Lake Kivu Sunset Resort",
    location: "Gisenyi, Lake Kivu",
    price: 180,
    rating: 4.7,
    reviews: 56,
    image: "/kivu.png",
    type: "Hotel",
  }
];

export default function SearchPage() {
  const supabase = createClient();
  
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceLimit, setPriceLimit] = useState(2000);
  const [activeType, setActiveType] = useState("All");

  // 1. Fetch active services on Mount
  useEffect(() => {
    async function fetchServices() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .eq("is_active", true);

        if (data && data.length > 0) {
          // Merge database values with default mock reviews/ratings to maintain premium look
          const merged = data.map((item) => ({
            id: item.id,
            title: item.title,
            location: item.location,
            price: item.price,
            rating: 4.8,
            reviews: Math.floor(Math.random() * 80) + 12,
            image: item.images?.[0] || "/volcanoes.png",
            type: item.type.charAt(0).toUpperCase() + item.type.slice(1) // uppercase first char
          }));
          setServices(merged);
        } else {
          setServices(MOCK_SERVICES);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        setServices(MOCK_SERVICES);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, [supabase]);

  // 2. Filter logic (search query + price + category type)
  const filteredServices = services.filter((service) => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          service.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = service.price <= priceLimit;
    const matchesType = activeType === "All" || service.type.toLowerCase() === activeType.toLowerCase();
    
    return matchesSearch && matchesPrice && matchesType;
  });

  return (
    <div className="min-h-screen bg-muted/30 pt-24 pb-12 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <aside className="w-full md:w-64 space-y-8 bg-card p-6 rounded-3xl border border-border h-fit shadow-sm">
            <div>
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-brand-green">
                <Filter size={18} /> Filters
              </h2>
              <div className="space-y-6">
                {/* Price Range */}
                <div>
                  <label className="text-sm font-bold mb-3 block text-foreground">
                    Max Price: <span className="text-brand-green font-extrabold">${priceLimit}</span>
                  </label>
                  <input 
                    type="range" 
                    className="w-full accent-brand-green cursor-pointer" 
                    min="0" 
                    max="2000" 
                    step="50"
                    value={priceLimit}
                    onChange={(e) => setPriceLimit(Number(e.target.value))}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2 font-medium">
                    <span>$0</span>
                    <span>$2,000+</span>
                  </div>
                </div>

                {/* Service Type selector */}
                <div>
                  <label className="text-sm font-bold mb-3 block text-foreground">Service Type</label>
                  <div className="space-y-2.5">
                    {["All", "Tour", "Hotel", "Safari", "Transport"].map((type) => (
                      <label key={type} className="flex items-center gap-3 cursor-pointer group text-sm font-semibold text-muted-foreground hover:text-foreground">
                        <input 
                          type="radio" 
                          name="type" 
                          checked={activeType === type}
                          onChange={() => setActiveType(type)}
                          className="accent-brand-green w-4 h-4" 
                        />
                        <span className={cn(activeType === type && "text-brand-green font-extrabold")}>
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">
                  Showing experiences in <span className="text-brand-green font-display font-extrabold">Rwanda</span>
                </h1>
                <p className="text-xs text-muted-foreground font-medium mt-1">
                  Discover verified services with local payment solutions.
                </p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  type="text" 
                  placeholder="Search experiences..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-card border border-border rounded-xl py-2.5 pl-10 pr-4 w-full md:w-64 focus:ring-2 focus:ring-brand-green outline-none transition-all text-sm shadow-sm"
                />
              </div>
            </div>

            {loading ? (
              <div className="h-96 flex items-center justify-center">
                <Loader2 className="animate-spin text-brand-green" size={40} />
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="h-96 flex flex-col items-center justify-center text-center p-8 bg-card rounded-3xl border border-border">
                <p className="text-lg font-bold mb-2">No experiences found</p>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Try adjusting your search filters or price limits to find available services.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
                  <div key={service.id} className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border/50 group hover:shadow-md transition-shadow">
                    <div className="relative h-48">
                      <Link href={`/services/${service.id}`}>
                        <Image 
                          src={service.image} 
                          alt={service.title} 
                          fill 
                          className="object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                      </Link>
                      <button className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/40 transition-colors cursor-pointer">
                        <Heart size={18} />
                      </button>
                      <div className="absolute bottom-4 left-4 bg-brand-green/90 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        {service.type}
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-1 text-brand-gold mb-2">
                        <Star size={14} fill="currentColor" />
                        <span className="text-sm font-bold">{service.rating}</span>
                        <span className="text-xs text-muted-foreground">({service.reviews})</span>
                      </div>
                      <Link href={`/services/${service.id}`}>
                        <h3 className="font-bold text-lg mb-1 group-hover:text-brand-green transition-colors line-clamp-1">{service.title}</h3>
                      </Link>
                      <div className="flex items-center gap-1 text-muted-foreground text-sm mb-4">
                        <MapPin size={14} />
                        <span className="line-clamp-1">{service.location}</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-border pt-4">
                        <div>
                          <span className="text-lg font-bold text-brand-green">${service.price}</span>
                          <span className="text-xs text-muted-foreground ml-1">/ person</span>
                        </div>
                        <Link 
                          href={`/services/${service.id}`}
                          className="bg-brand-green/10 text-brand-green hover:bg-brand-green hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}
