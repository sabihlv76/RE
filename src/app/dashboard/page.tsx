"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  History as HistoryIcon, 
  Settings as SettingsIcon, 
  LogOut, 
  CreditCard, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  Loader2,
  User,
  MapPin,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

export default function TouristDashboard() {
  const router = useRouter();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Check user state and fetch profile
  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }
      setUser(user);

      // Fetch user profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(profileData);

      // Fetch user bookings joined with services
      const { data: bookingsData } = await supabase
        .from("bookings")
        .select("*, services(*)")
        .eq("tourist_id", user.id)
        .order("created_at", { ascending: false });

      if (bookingsData) {
        setBookings(bookingsData);
      }
      setLoading(false);
    }
    checkAuth();
  }, [supabase, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  // Stats Calculations
  const activeBookings = bookings.filter(b => b.status === "confirmed" || b.status === "pending");
  const completedBookings = bookings.filter(b => b.status === "completed");
  const totalSpent = bookings
    .filter(b => b.status === "confirmed" || b.status === "completed" || b.status === "paid_to_partner")
    .reduce((sum, b) => sum + b.total_price, 0);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "confirmed":
        return "text-green-600 bg-green-50 border border-green-100";
      case "pending":
        return "text-amber-600 bg-amber-50 border border-amber-100";
      case "completed":
        return "text-blue-600 bg-blue-50 border border-blue-100";
      case "cancelled":
        return "text-red-600 bg-red-50 border border-red-100";
      default:
        return "text-muted-foreground bg-muted border border-border";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="animate-spin text-brand-green mx-auto mb-4" size={48} />
          <p className="text-muted-foreground font-semibold">Loading your personal dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col p-6 pt-24 shrink-0">
        <div className="flex items-center gap-3 bg-muted/40 p-3.5 rounded-2xl border border-border/50 mb-8">
          <div className="w-10 h-10 bg-brand-green/10 text-brand-green rounded-xl flex items-center justify-center font-bold font-display">
            {profile?.full_name?.charAt(0).toUpperCase() || "T"}
          </div>
          <div className="truncate">
            <h3 className="font-bold text-sm truncate">{profile?.full_name || "Tourist Explorer"}</h3>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{profile?.role || "Tourist"}</p>
          </div>
        </div>

        <div className="space-y-2">
          {[
            { id: "overview", label: "Overview", icon: <LayoutDashboard size={18} /> },
            { id: "bookings", label: "My Bookings", icon: <ShoppingBag size={18} /> },
            { id: "history", label: "Travel History", icon: <HistoryIcon size={18} /> },
            { id: "payments", label: "Payments", icon: <CreditCard size={18} /> },
            { id: "settings", label: "Settings", icon: <SettingsIcon size={18} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
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

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-12 pt-24 overflow-x-hidden">
        <div className="max-w-5xl mx-auto">
          <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-brand-green font-display">Hello, {profile?.full_name?.split(" ")[0] || "Explorer"}!</h1>
              <p className="text-muted-foreground text-sm font-medium">Welcome back. Manage your booking reservations and travel details.</p>
            </div>
          </header>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { label: "Active Bookings", value: activeBookings.length, icon: <Clock className="text-brand-gold" /> },
              { label: "Total Invested", value: `$${totalSpent}`, icon: <CreditCard className="text-brand-green" /> },
              { label: "Completed Adventures", value: completedBookings.length, icon: <CheckCircle2 className="text-blue-500" /> }
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

          {/* Tab Views */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Recent Bookings Table */}
              <div className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden">
                <div className="p-6 border-b border-border flex justify-between items-center bg-card">
                  <h2 className="font-bold text-lg text-foreground font-display">Recent Travel Reservations</h2>
                  <button 
                    onClick={() => setActiveTab("bookings")}
                    className="text-brand-green text-sm font-bold hover:underline cursor-pointer"
                  >
                    View All
                  </button>
                </div>
                
                {bookings.length === 0 ? (
                  <div className="p-12 text-center text-muted-foreground">
                    <ShoppingBag className="mx-auto text-muted-foreground/30 mb-4 animate-bounce" size={48} />
                    <p className="font-bold text-lg mb-1">No bookings found</p>
                    <p className="text-sm">Ready for a new adventure? Search and secure bookings in one tap.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-muted/40 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
                          <th className="px-6 py-4">Booking ID</th>
                          <th className="px-6 py-4">Service</th>
                          <th className="px-6 py-4">Travel Date</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {bookings.slice(0, 5).map((booking) => {
                          const date = booking.booking_details?.travel_date || "";
                          const service = booking.services || {};
                          return (
                            <tr key={booking.id} className="hover:bg-muted/30 transition-colors">
                              <td className="px-6 py-4 font-mono text-xs text-brand-green font-bold truncate max-w-[120px]">{booking.id}</td>
                              <td className="px-6 py-4">
                                <p className="font-bold text-sm text-foreground">{service.title || "Adventure Service"}</p>
                                <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                  <MapPin size={10} /> {service.location}
                                </p>
                              </td>
                              <td className="px-6 py-4 text-sm font-semibold text-muted-foreground">{date}</td>
                              <td className="px-6 py-4">
                                <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", getStatusBadgeClass(booking.status))}>
                                  {booking.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right font-extrabold text-brand-green">${booking.total_price}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "bookings" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-xl font-bold font-display">My Bookings & Reservations</h2>
              
              {activeBookings.length === 0 ? (
                <div className="bg-card p-12 rounded-3xl border border-border text-center text-muted-foreground">
                  <ShoppingBag className="mx-auto text-muted-foreground/30 mb-3" size={40} />
                  <p className="font-bold">No active travel reservations.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {activeBookings.map((booking) => {
                    const service = booking.services || {};
                    const details = booking.booking_details || {};
                    return (
                      <div key={booking.id} className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                          <div className="w-14 h-14 bg-brand-green/5 text-brand-green rounded-xl flex items-center justify-center font-bold">
                            <ShoppingBag />
                          </div>
                          <div>
                            <p className="text-[10px] font-mono text-brand-green font-bold">{booking.id}</p>
                            <h3 className="font-bold text-base text-foreground mt-0.5">{service.title}</h3>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin size={12} /> {service.location}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-12 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                          <div>
                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Travel Date</p>
                            <p className="text-sm font-bold text-foreground flex items-center gap-1"><Calendar size={14} className="text-brand-gold" /> {details.travel_date}</p>
                          </div>
                          <div>
                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Price Paid</p>
                            <p className="text-base font-extrabold text-brand-green">${booking.total_price}</p>
                          </div>
                          <div>
                            <span className={cn("px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider block text-center", getStatusBadgeClass(booking.status))}>
                              {booking.status}
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

          {activeTab === "history" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-xl font-bold font-display">Travel History</h2>
              {completedBookings.length === 0 ? (
                <div className="bg-card p-12 rounded-3xl border border-border text-center text-muted-foreground">
                  <CheckCircle2 className="mx-auto text-muted-foreground/30 mb-3" size={40} />
                  <p className="font-bold">No completed travel logs yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {completedBookings.map((booking) => {
                    const service = booking.services || {};
                    const details = booking.booking_details || {};
                    return (
                      <div key={booking.id} className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center font-bold">
                            <CheckCircle2 />
                          </div>
                          <div>
                            <h3 className="font-bold text-base">{service.title}</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">{service.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-8">
                          <p className="text-sm font-bold text-muted-foreground">{details.travel_date}</p>
                          <p className="text-base font-extrabold text-brand-green">${booking.total_price}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "payments" && (
            <div className="bg-card rounded-3xl shadow-sm border border-border p-8 animate-in fade-in duration-300">
              <h2 className="text-xl font-bold font-display mb-6">Payment Ledger</h2>
              <div className="space-y-4">
                {bookings.length === 0 ? (
                  <p className="text-muted-foreground text-center">No payment transactions recorded.</p>
                ) : (
                  bookings.map((booking) => (
                    <div key={booking.id} className="flex justify-between items-center p-4 border-b border-border">
                      <div>
                        <p className="font-bold text-sm">{booking.services?.title || "Marketplace Booking"}</p>
                        <p className="text-[10px] text-muted-foreground font-mono mt-1">Transaction Ref: {booking.payment_reference || "N/A"}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-extrabold text-brand-green">${booking.total_price}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">Mobile Money (RWF)</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="bg-card rounded-3xl shadow-sm border border-border p-8 animate-in fade-in duration-300 max-w-xl">
              <h2 className="text-xl font-bold font-display mb-6">Profile Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-muted-foreground mb-2">Registered Email</label>
                  <input type="text" disabled className="w-full bg-muted border border-border rounded-xl py-3 px-4 font-semibold text-muted-foreground outline-none" value={user?.email || ""} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-muted-foreground mb-2">Full Name</label>
                  <input type="text" disabled className="w-full bg-muted border border-border rounded-xl py-3 px-4 font-semibold text-muted-foreground outline-none" value={profile?.full_name || ""} />
                </div>
                <div className="bg-brand-green/5 border border-brand-green/10 p-4 rounded-xl text-xs text-brand-green">
                  <p className="font-bold">Verified Account Status</p>
                  <p className="mt-1 opacity-90">Your account is fully integrated with Supabase and verified to book activities using secure gateway payments.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
