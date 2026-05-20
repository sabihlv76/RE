"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ShoppingBag, 
  MessageSquare, 
  User, 
  CheckCircle2, 
  Clock, 
  Calendar,
  ChevronRight,
  Plus,
  Briefcase,
  DollarSign,
  Percent,
  PlusCircle,
  MapPin,
  TrendingUp,
  Loader2,
  FileText,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

export default function PartnerDashboard() {
  const router = useRouter();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Listing creation form state
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newType, setNewType] = useState<"tour" | "hotel" | "package" | "transport">("tour");
  const [newLocation, setNewLocation] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newImage, setNewImage] = useState("/volcanoes.png");
  
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);

  // 1. Fetch user profile, services, and bookings
  const loadDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }
      setUser(user);

      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (profileData?.role !== "partner" && profileData?.role !== "admin") {
        router.push("/dashboard");
        return;
      }
      setProfile(profileData);

      // Fetch partner's services
      const { data: servicesData } = await supabase
        .from("services")
        .select("*")
        .eq("partner_id", user.id)
        .order("created_at", { ascending: false });

      if (servicesData) {
        setServices(servicesData);

        // Fetch bookings matching partner's services
        if (servicesData.length > 0) {
          const serviceIds = servicesData.map(s => s.id);
          const { data: bookingsData } = await supabase
            .from("bookings")
            .select("*, services(*)")
            .in("service_id", serviceIds)
            .order("created_at", { ascending: false });
          
          if (bookingsData) {
            setBookings(bookingsData);
          }
        }
      }
    } catch (err) {
      console.error("Error loading partner dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [supabase, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  // 2. Listing Submit Handler
  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    setCreateSuccess(false);

    if (!newTitle || !newDescription || !newLocation || !newPrice) {
      setCreateError("All fields are required.");
      return;
    }

    setCreateLoading(true);

    try {
      const { error } = await supabase.from("services").insert({
        partner_id: user.id,
        title: newTitle,
        description: newDescription,
        type: newType,
        location: newLocation,
        price: Number(newPrice),
        images: [newImage],
        itinerary: [
          { day: 1, title: "Arrival & Reception", desc: "Welcome and hotel check-in briefing." },
          { day: 2, title: "Adventure Tour", desc: "Enjoy your dynamic sightseeing and local guiding session." },
          { day: 3, title: "Departure", desc: "Wrap up the tour and checklist details." }
        ],
        availability: { monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true, sunday: true },
        is_active: true
      });

      if (error) throw error;

      setCreateSuccess(true);
      setNewTitle("");
      setNewDescription("");
      setNewLocation("");
      setNewPrice("");
      setShowAddForm(false);
      
      // Reload listings
      await loadDashboardData();
    } catch (err: any) {
      console.error("Listing creation error:", err);
      setCreateError(err.message || "Failed to publish service. Please try again.");
    } finally {
      setCreateLoading(false);
    }
  };

  // Compute stats
  const totalOrdersCount = bookings.length;
  
  const confirmedBookings = bookings.filter(b => b.status === "confirmed" || b.status === "completed" || b.status === "paid_to_partner");
  const totalNetEarnings = confirmedBookings.reduce((sum, b) => sum + (b.total_price - b.commission_amount), 0);
  const totalCommissionPaid = confirmedBookings.reduce((sum, b) => sum + b.commission_amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="animate-spin text-brand-green mx-auto mb-4" size={48} />
          <p className="text-muted-foreground font-semibold">Loading partner console...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col p-6 pt-24 shrink-0">
        <div className="flex items-center gap-3 bg-muted/40 p-3.5 rounded-2xl border border-border/50 mb-8">
          <div className="w-10 h-10 bg-brand-gold/10 text-brand-gold rounded-xl flex items-center justify-center font-extrabold font-display">
            {profile?.full_name?.charAt(0).toUpperCase() || "P"}
          </div>
          <div className="truncate">
            <h3 className="font-bold text-sm truncate">{profile?.full_name || "Amahoro Tours"}</h3>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Local Partner</p>
          </div>
        </div>

        <div className="space-y-2">
          {[
            { id: "overview", label: "Dashboard", icon: <Briefcase size={18} /> },
            { id: "orders", label: "Customer Orders", icon: <ShoppingBag size={18} /> },
            { id: "listings", label: "My Listings", icon: <FileText size={18} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setShowAddForm(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer",
                activeTab === item.id 
                  ? "bg-brand-green text-white shadow-md font-bold" 
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-auto">
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all cursor-pointer"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main partner workspace */}
      <main className="flex-1 p-6 md:p-12 pt-24 overflow-x-hidden">
        <div className="max-w-5xl mx-auto">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className="text-3xl font-extrabold text-brand-green font-display">{profile?.full_name || "Partner Admin"}</h1>
              <p className="text-muted-foreground text-sm font-medium">Marketplace operator dashboard. Publish services and process bookings.</p>
            </div>
            <div>
              <button 
                onClick={() => {
                  setActiveTab("listings");
                  setShowAddForm(true);
                }}
                className="bg-brand-green text-white px-6 py-3.5 rounded-xl font-bold shadow-md hover:bg-brand-green/90 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Plus size={18} /> Add New Listing
              </button>
            </div>
          </header>

          {/* Partner Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              { label: "Active Orders", value: totalOrdersCount, icon: <ShoppingBag className="text-brand-gold" /> },
              { label: "Net Earnings", value: `$${totalNetEarnings.toFixed(2)}`, icon: <DollarSign className="text-brand-green" /> },
              { label: "Commission Paid", value: `$${totalCommissionPaid.toFixed(2)}`, icon: <Percent className="text-blue-500" /> }
            ].map((stat, i) => (
              <div key={i} className="bg-card p-6 rounded-3xl shadow-sm border border-border flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                  <p className="text-3xl font-extrabold">{stat.value}</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-2xl">{stat.icon}</div>
              </div>
            ))}
          </div>

          {/* Tabs Views */}
          {activeTab === "overview" && (
            <div className="space-y-10 animate-in fade-in duration-300">
              {/* Listings overview snippet */}
              <div className="bg-card rounded-3xl border border-border p-6 shadow-sm">
                <h3 className="text-lg font-bold font-display mb-4">My Listed Experiences ({services.length})</h3>
                {services.length === 0 ? (
                  <p className="text-muted-foreground">You haven't listed any tours or hotels yet. Click "Add New Listing" to get started.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.slice(0, 4).map(service => (
                      <div key={service.id} className="flex gap-4 p-4 border border-border/60 rounded-xl hover:border-brand-green/30 transition-colors bg-muted/20">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                          <img src={service.images?.[0] || "/volcanoes.png"} alt="" className="object-cover w-full h-full" />
                        </div>
                        <div className="truncate">
                          <h4 className="font-bold text-sm truncate">{service.title}</h4>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin size={12} /> {service.location}</p>
                          <p className="text-xs text-brand-green font-extrabold mt-1.5">${service.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-xl font-bold font-display flex items-center gap-2">
                <Clock size={20} className="text-brand-gold" /> Customer Booking Orders
              </h2>

              {bookings.length === 0 ? (
                <div className="bg-card p-12 rounded-3xl border border-border text-center text-muted-foreground">
                  <ShoppingBag className="mx-auto text-muted-foreground/30 mb-3" size={40} />
                  <p className="font-bold">No customer orders received yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {bookings.map((order) => {
                    const details = order.booking_details || {};
                    const service = order.services || {};
                    return (
                      <div key={order.id} className="bg-card p-6 rounded-2xl shadow-sm border border-border flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-6 w-full md:w-auto">
                          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center font-display text-brand-green font-extrabold">
                            ORD
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground font-mono font-bold">{order.id}</p>
                            <h3 className="font-bold text-lg text-foreground">{details.customer_name || "Lead Traveler"}</h3>
                            <p className="text-brand-green font-semibold text-xs mt-1">{service.title}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-12 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                          <div>
                            <p className="text-[9px] text-muted-foreground font-bold uppercase mb-0.5">Travel Date</p>
                            <p className="font-bold text-sm text-foreground">{details.travel_date}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-muted-foreground font-bold uppercase mb-0.5">Total Value</p>
                            <p className="font-extrabold text-sm text-brand-green">${order.total_price}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-muted-foreground font-bold uppercase mb-0.5">Status</p>
                            <span className={cn(
                              "px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider block text-center",
                              order.status === "confirmed" ? "bg-green-50 text-green-600 border border-green-100" : "bg-amber-50 text-amber-600 border border-amber-100"
                            )}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "listings" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {showAddForm ? (
                /* Listing creation Form card */
                <div className="bg-card p-8 rounded-3xl border border-border shadow-md max-w-2xl">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold font-display text-brand-green">Create A New Adventure Listing</h2>
                    <button 
                      onClick={() => setShowAddForm(false)}
                      className="text-xs text-muted-foreground hover:text-foreground font-bold hover:underline cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <form onSubmit={handleCreateListing} className="space-y-6">
                    {createError && (
                      <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-semibold border border-red-100">
                        {createError}
                      </div>
                    )}
                    {createSuccess && (
                      <div className="bg-green-50 text-green-700 p-4 rounded-xl text-xs font-semibold border border-green-100 text-center animate-pulse">
                        Service successfully published live on the marketplace!
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-semibold mb-2 ml-1">Service / Activity Title</label>
                        <input 
                          type="text" 
                          required
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          placeholder="e.g. Luxury Lake Kivu sunset canoe tour"
                          className="w-full bg-muted/40 border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-green outline-none font-medium transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2 ml-1">Service Type</label>
                        <select 
                          value={newType}
                          onChange={(e: any) => setNewType(e.target.value)}
                          className="w-full bg-muted/40 border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-green outline-none font-semibold transition-all appearance-none"
                        >
                          <option value="tour">Tour</option>
                          <option value="hotel">Hotel</option>
                          <option value="package">Combo Package</option>
                          <option value="transport">Transport</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2 ml-1">Price (USD per person)</label>
                        <input 
                          type="number" 
                          required
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          placeholder="e.g. 150"
                          className="w-full bg-muted/40 border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-green outline-none font-semibold transition-all"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-semibold mb-2 ml-1">Geographic Location</label>
                        <input 
                          type="text" 
                          required
                          value={newLocation}
                          onChange={(e) => setNewLocation(e.target.value)}
                          placeholder="e.g. Gisenyi, Lake Kivu, Rwanda"
                          className="w-full bg-muted/40 border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-green outline-none font-medium transition-all"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-semibold mb-2 ml-1">Cover Image Option</label>
                        <select 
                          value={newImage}
                          onChange={(e) => setNewImage(e.target.value)}
                          className="w-full bg-muted/40 border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-green outline-none font-semibold transition-all appearance-none"
                        >
                          <option value="/volcanoes.png">Volcanoes National Park Cover</option>
                          <option value="/akagera.png">Akagera Savannah Cover</option>
                          <option value="/kivu.png">Lake Kivu resort Cover</option>
                          <option value="/hero.png">General Rwanda Hills Cover</option>
                        </select>
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-semibold mb-2 ml-1">Service Description</label>
                        <textarea 
                          required
                          rows={4}
                          value={newDescription}
                          onChange={(e) => setNewDescription(e.target.value)}
                          placeholder="Describe the activity, itinerary details, requirements, safety notes..."
                          className="w-full bg-muted/40 border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-green outline-none font-medium transition-all resize-none"
                        />
                      </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={createLoading}
                      className="w-full bg-brand-green text-white py-4 rounded-xl font-bold hover:bg-brand-green/90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                    >
                      {createLoading ? (
                        <>
                          <Loader2 className="animate-spin" size={18} />
                          Publishing Live...
                        </>
                      ) : (
                        <>
                          <PlusCircle size={18} />
                          Publish Service Listing
                        </>
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                /* Listings display grid */
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold font-display">Manage Active Listings</h2>
                    <button 
                      onClick={() => setShowAddForm(true)}
                      className="text-brand-green hover:underline text-sm font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <PlusCircle size={18} /> Add Listing
                    </button>
                  </div>

                  {services.length === 0 ? (
                    <div className="bg-card p-12 rounded-3xl border border-border text-center text-muted-foreground">
                      <FileText className="mx-auto text-muted-foreground/30 mb-3" size={40} />
                      <p className="font-bold">No active listings.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {services.map((service) => (
                        <div key={service.id} className="bg-card rounded-2xl overflow-hidden border border-border/60 shadow-sm hover:shadow-md transition-shadow">
                          <div className="relative h-40">
                            <img src={service.images?.[0] || "/volcanoes.png"} alt={service.title} className="object-cover w-full h-full" />
                            <div className="absolute top-4 left-4 bg-brand-green/90 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                              {service.type}
                            </div>
                          </div>
                          <div className="p-5">
                            <h3 className="font-bold text-base truncate">{service.title}</h3>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1.5"><MapPin size={12} /> {service.location}</p>
                            <div className="flex justify-between items-center border-t border-border pt-4 mt-4">
                              <span className="text-brand-green font-extrabold text-lg">${service.price}</span>
                              <Link 
                                href={`/services/${service.id}`}
                                className="text-brand-green text-xs font-bold hover:underline"
                              >
                                View Live
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
