"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { 
  Star, 
  MapPin, 
  Calendar, 
  Users, 
  CheckCircle, 
  Info, 
  ChevronRight, 
  Share2, 
  Heart, 
  Zap, 
  ShieldCheck, 
  Loader2,
  Phone,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [service, setService] = useState<any>(null);
  const [loadingService, setLoadingService] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  // Booking Form State
  const [date, setDate] = useState("");
  const [guestsCount, setGuestsCount] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // 1. Fetch User Session on Mount
  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        // Pre-populate name if available
        setCustomerName(user.user_metadata?.full_name || "");
      }
    }
    checkUser();
  }, [supabase]);

  // 2. Fetch Service Data dynamically (with fallback)
  useEffect(() => {
    async function fetchService() {
      setLoadingService(true);
      try {
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .eq("id", params.id)
          .single();

        if (data) {
          // Merge dynamic data with rich mock arrays so the page still looks amazing
          setService({
            ...data,
            rating: 4.9,
            reviews: 124,
            itinerary: Array.isArray(data.itinerary) ? data.itinerary : [
              { day: 1, title: "Arrival & Briefing", desc: "Arrive at the park headquarters for a safety briefing and group assignment." },
              { day: 2, title: "The Experience", desc: "Set out with experienced guides and trackers to explore the unique landscape and wildlife." },
              { day: 3, title: "Cultural & Community Interaction", desc: "Interact with local communities and discover Rwanda's rich conservation story." }
            ],
            includes: ["Professional guide", "Bottled water", "Basic first aid", "Park entry briefing"],
            excludes: ["International flights", "Accommodation", "Personal tips", "Travel insurance"]
          });
        } else {
          const mockServices: Record<string, any> = {
            "t1": { title: "Mountain Gorilla Trekking", location: "Volcanoes National Park, Rwanda", price: 1500, type: "tour", images: ["/volcanoes.png", "/hero.png", "/akagera.png"] },
            "t2": { title: "Akagera Big Five Savannah Safari", location: "Akagera National Park, Rwanda", price: 350, type: "tour", images: ["/akagera.png", "/volcanoes.png", "/hero.png"] },
            "t3": { title: "Nyungwe Canopy Walkway", location: "Nyungwe Forest, Rwanda", price: 120, type: "tour", images: ["/hero.png", "/kivu.png", "/volcanoes.png"] },
            "t4": { title: "Lake Kivu Boat Cruise & Coffee Tour", location: "Rubavu, Lake Kivu", price: 85, type: "tour", images: ["/kivu.png", "/hero.png", "/akagera.png"] },
            "t5": { title: "Kigali City Historical Tour", location: "Kigali, Rwanda", price: 50, type: "tour", images: ["/akagera.png", "/hero.png", "/volcanoes.png"] },
            "t6": { title: "Golden Monkey Tracking", location: "Volcanoes National Park", price: 100, type: "tour", images: ["/volcanoes.png", "/hero.png", "/kivu.png"] },
            "h1": { title: "Lake Kivu Sunset Resort", location: "Gisenyi, Lake Kivu, Rwanda", price: 180, type: "hotel", images: ["/kivu.png", "/hero.png", "/akagera.png"] },
            "h2": { title: "Nyungwe Forest Retreat", location: "Nyungwe National Park, Rwanda", price: 320, type: "hotel", images: ["/hero.png", "/volcanoes.png", "/kivu.png"] },
            "h3": { title: "Kigali Horizon Hotel", location: "Kigali City Center, Rwanda", price: 150, type: "hotel", images: ["/akagera.png", "/hero.png", "/volcanoes.png"] },
            "h4": { title: "Bisate Lodge Wilderness", location: "Musanze, Volcanoes NP, Rwanda", price: 850, type: "hotel", images: ["/volcanoes.png", "/hero.png", "/kivu.png"] },
            "h5": { title: "Akagera Game Lodge", location: "Akagera National Park, Rwanda", price: 210, type: "hotel", images: ["/akagera.png", "/hero.png", "/volcanoes.png"] },
            "h6": { title: "Cleo Lake Kivu Hotel", location: "Karongi, Western Province", price: 290, type: "hotel", images: ["/kivu.png", "/hero.png", "/akagera.png"] }
          };

          const mockMatch = mockServices[params.id as string] || mockServices["t1"];

          // Fallback mock data if the ID does not exist in the DB
          setService({
            id: params.id,
            title: mockMatch.title,
            location: mockMatch.location,
            price: mockMatch.price,
            rating: 4.9,
            reviews: 124,
            description: "Experience the thrill of a lifetime with this verified, local Rwandan destination. This guided booking offers an intimate and unforgettable connection with beautiful scenery.",
            images: mockMatch.images,
            itinerary: [
              { day: 1, title: "Arrival & Welcome", desc: "Arrive at the destination for a warm welcome and briefing." },
              { day: 2, title: "The Experience", desc: "Explore the unique landscape and engage with the activities." },
              { day: 3, title: "Departure", desc: "Enjoy a rich breakfast and prepare for departure." }
            ],
            includes: ["Premium access", "Professional guide/staff", "Bottled water", "Basic first aid"],
            excludes: ["International flights", "Personal tips", "Travel insurance"]
          });
        }
      } catch (err) {
        console.error("Error fetching service:", err);
      } finally {
        setLoadingService(false);
      }
    }

    if (params.id) {
      fetchService();
    }
  }, [params.id, supabase]);

  // 3. Booking Submit Handler
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);

    // Verify session
    if (!user) {
      // Store redirect URL in localStorage to return after login
      localStorage.setItem("redirectTo", `/services/${params.id}`);
      router.push("/auth/login");
      return;
    }

    if (!date) {
      setBookingError("Please select a travel date.");
      return;
    }

    if (!phone) {
      setBookingError("Please enter your Mobile Money / Phone number.");
      return;
    }

    if (!customerName) {
      setBookingError("Please enter your full name.");
      return;
    }

    setBookingLoading(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_id: service.id,
          date: date,
          guests_count: guestsCount,
          phone: phone,
          customer_name: customerName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initiate booking.");
      }

      if (data.status === "success" && data.payment_url) {
        // Redirect directly to Flutterwave payment prompt
        window.location.href = data.payment_url;
      } else {
        throw new Error("Unable to obtain payment link.");
      }
    } catch (err: any) {
      console.error("Booking error:", err);
      setBookingError(err.message || "An unexpected error occurred. Please try again.");
      setBookingLoading(false);
    }
  };

  if (loadingService) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="animate-spin text-brand-green mx-auto mb-4" size={48} />
          <p className="text-muted-foreground font-semibold">Loading adventure details...</p>
        </div>
      </div>
    );
  }

  if (!service) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 pt-24 pb-12">
        
        {/* Header & Gallery */}
        <header className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-brand-green font-bold text-sm mb-2 uppercase tracking-wider">
                <MapPin size={16} /> {service.location}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">{service.title}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-brand-gold">
                  <Star size={18} fill="currentColor" />
                  <span className="font-bold">{service.rating}</span>
                  <span className="text-muted-foreground text-sm">({service.reviews} reviews)</span>
                </div>
                <div className="w-1.5 h-1.5 bg-border rounded-full" />
                <span className="text-sm font-semibold text-muted-foreground underline cursor-pointer">Verified Tour</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 border border-border px-4 py-2 rounded-xl text-sm font-bold hover:bg-muted transition-all cursor-pointer">
                <Share2 size={18} /> Share
              </button>
              <button className="flex items-center gap-2 border border-border px-4 py-2 rounded-xl text-sm font-bold hover:bg-muted transition-all cursor-pointer">
                <Heart size={18} /> Save
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[500px]">
            <div className="md:col-span-2 md:row-span-2 relative rounded-3xl overflow-hidden shadow-lg">
              <Image src={service.images?.[0] || "/hero.png"} alt="Main" fill className="object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="relative rounded-3xl overflow-hidden shadow-lg">
              <Image src={service.images?.[1] || "/volcanoes.png"} alt="Gallery 1" fill className="object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="relative rounded-3xl overflow-hidden shadow-lg">
              <Image src={service.images?.[2] || "/akagera.png"} alt="Gallery 2" fill className="object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="relative rounded-3xl overflow-hidden shadow-lg">
              <Image src={service.images?.[0] || "/hero.png"} alt="Gallery 3" fill className="object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="relative rounded-3xl overflow-hidden shadow-lg">
              <Image src={service.images?.[1] || "/volcanoes.png"} alt="Gallery 4" fill className="object-cover hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold text-lg cursor-pointer">
                View All +12
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Info size={24} className="text-brand-green" /> Overview
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {service.description}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Calendar size={24} className="text-brand-green" /> Itinerary
              </h2>
              <div className="space-y-6">
                {service.itinerary.map((item: any, i: number) => (
                  <div key={i} className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-brand-green text-white rounded-full flex items-center justify-center font-bold shrink-0">
                        {item.day}
                      </div>
                      {i !== service.itinerary.length - 1 && <div className="w-0.5 flex-1 bg-border my-2" />}
                    </div>
                    <div className="pb-4">
                      <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-muted/30 p-8 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-8 border border-border/50">
              <div>
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <CheckCircle size={20} className="text-green-500" /> What's Included
                </h3>
                <ul className="space-y-3">
                  {service.includes.map((item: string, i: number) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <XCircle size={20} className="text-red-500" /> Not Included
                </h3>
                <ul className="space-y-3">
                  {service.excludes.map((item: string, i: number) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>

          {/* Booking Widget */}
          <aside>
            <div className="bg-card p-8 rounded-3xl shadow-xl border border-border sticky top-24">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <p className="text-sm text-muted-foreground font-semibold mb-1">Price</p>
                  <p className="text-3xl font-bold text-brand-green">${service.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground font-bold mb-1 uppercase tracking-wider">Per Person</p>
                  <p className="text-sm font-bold text-brand-gold">All Inclusive</p>
                </div>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-4 mb-8">
                {bookingError && (
                  <div className="bg-red-50 text-red-600 p-3.5 rounded-xl text-xs font-semibold border border-red-100">
                    {bookingError}
                  </div>
                )}

                {/* Name Input */}
                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block ml-1">Your Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input 
                      type="text" 
                      required
                      placeholder="John Doe"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-muted/50 border border-border rounded-xl py-3 pl-12 pr-4 font-semibold focus:ring-2 focus:ring-brand-green transition-all outline-none" 
                    />
                  </div>
                </div>

                {/* Date Input */}
                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block ml-1">Select Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input 
                      type="date" 
                      required
                      min={new Date().toISOString().split("T")[0]}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-muted/50 border border-border rounded-xl py-3 pl-12 pr-4 font-semibold focus:ring-2 focus:ring-brand-green transition-all outline-none" 
                    />
                  </div>
                </div>

                {/* Guests Selection */}
                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block ml-1">Guests</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <select 
                      value={guestsCount} 
                      onChange={(e) => setGuestsCount(Number(e.target.value))}
                      className="w-full bg-muted/50 border border-border rounded-xl py-3 pl-12 pr-4 font-semibold focus:ring-2 focus:ring-brand-green appearance-none outline-none"
                    >
                      <option value={1}>1 Guest</option>
                      <option value={2}>2 Guests</option>
                      <option value={3}>3 Guests</option>
                      <option value={4}>4 Guests</option>
                      <option value={5}>5 Guests</option>
                    </select>
                  </div>
                </div>

                {/* Mobile Money Number */}
                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block ml-1">Mobile Money Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input 
                      type="tel" 
                      required
                      placeholder="e.g. 078XXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-muted/50 border border-border rounded-xl py-3 pl-12 pr-4 font-semibold focus:ring-2 focus:ring-brand-green transition-all outline-none" 
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1 ml-1 block">For MTN MoMo or Airtel Money payment push</span>
                </div>

                {/* Book Action Button */}
                <button 
                  type="submit" 
                  disabled={bookingLoading}
                  className="w-full bg-brand-green text-white py-5 rounded-2xl font-bold text-lg hover:bg-brand-green/90 transition-all shadow-lg hover:shadow-xl mt-4 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {bookingLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Processing Checkout...
                    </>
                  ) : (
                    <>
                      Book Adventure <ChevronRight size={20} />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-xs text-muted-foreground">
                {!user ? "Sign in to complete booking." : "Secure connection. Verified platform."}
              </p>

              <hr className="my-8 border-border" />
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-brand-gold/10 p-2 rounded-lg text-brand-gold">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Secure Payment</p>
                    <p className="text-[10px] text-muted-foreground">MoMo, Airtel & Cards supported</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg text-blue-500">
                    <Zap size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Instant Confirmation</p>
                    <p className="text-[10px] text-muted-foreground">Receive your voucher via Email/SMS</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>
      <Footer />
    </div>
  );
}

function XCircle({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );
}
