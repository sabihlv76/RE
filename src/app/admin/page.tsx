"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, ShoppingBag, Users, Briefcase, FileText,
  TrendingUp, LogOut, Bell, Search, ChevronDown, MoreHorizontal,
  CheckCircle, XCircle, Clock, DollarSign, Percent, MapPin,
  Shield, Eye, UserCheck, AlertCircle, Compass, RefreshCw
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

/* ── Types ── */
type Tab = "overview" | "bookings" | "inquiries" | "partners" | "tourists";

const SIDEBAR = [
  { id: "overview"  as Tab, label: "Overview",         icon: LayoutDashboard },
  { id: "bookings"  as Tab, label: "Bookings",         icon: ShoppingBag     },
  { id: "inquiries" as Tab, label: "Lead Routing",     icon: FileText        },
  { id: "partners"  as Tab, label: "Tour Partners",    icon: Briefcase       },
  { id: "tourists"  as Tab, label: "Tourists",         icon: Users           },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    confirmed: "badge badge-green",
    completed: "badge badge-blue",
    pending:   "badge badge-amber",
    cancelled: "badge badge-red",
    assigned:  "badge badge-green",
    resolved:  "badge badge-blue",
    active:    "badge badge-green",
    inactive:  "badge badge-gray",
    paid_to_partner: "badge badge-purple",
  };
  return <span className={map[status] || "badge badge-gray"}>{status.replace(/_/g, " ")}</span>;
}

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = createClient();

  const [tab, setTab]               = useState<Tab>("overview");
  const [loading, setLoading]       = useState(true);
  const [profile, setProfile]       = useState<any>(null);
  const [bookings, setBookings]     = useState<any[]>([]);
  const [profiles, setProfiles]     = useState<any[]>([]);
  const [inquiries, setInquiries]   = useState<any[]>([]);
  const [search, setSearch]         = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ── Load data ── */
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }

      const { data: p } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (p?.role !== "admin") { router.push("/dashboard"); return; }
      setProfile({ ...p, email: user.email });

      const [bRes, pRes, iRes] = await Promise.all([
        supabase.from("bookings").select("*, services(title,location)").order("created_at", { ascending: false }),
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("inquiries").select("*").order("created_at", { ascending: false }),
      ]);

      if (bRes.data) setBookings(bRes.data);
      if (pRes.data) setProfiles(pRes.data);

      // Use real data or mock
      if (iRes.data && iRes.data.length > 0) {
        setInquiries(iRes.data);
      } else {
        setInquiries([
          { id: "inq-001", tourist_name: "Sarah Jenkins", tourist_email: "sarah@example.com", destination: "Volcanoes NP", budget: "$3,000", travel_dates: "Oct 12–15 2025", status: "pending", notes: "Looking for luxury gorilla trekking with lodge included." },
          { id: "inq-002", tourist_name: "David Müller", tourist_email: "david.m@example.com", destination: "Lake Kivu", budget: "$800", travel_dates: "Nov 1–4 2025", status: "assigned", notes: "Need boat tour + coffee plantation visit." },
          { id: "inq-003", tourist_name: "Amina Osei", tourist_email: "amina@example.com", destination: "Akagera NP", budget: "$1,200", travel_dates: "Dec 20–22 2025", status: "pending", notes: "Family safari for 4 people, kid-friendly." },
        ]);
      }

      setLoading(false);
    })();
  }, [supabase, router]);

  /* ── Derived ── */
  const partners  = profiles.filter(p => p.role === "partner");
  const tourists  = profiles.filter(p => p.role === "tourist");
  const confirmed = bookings.filter(b => ["confirmed","completed","paid_to_partner"].includes(b.status));
  const revenue   = confirmed.reduce((s, b) => s + (b.total_price || 0), 0);
  const commission = confirmed.reduce((s, b) => s + (b.commission_amount || 0), 0);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const updateBookingStatus = async (id: string, status: string) => {
    await supabase.from("bookings").update({ status }).eq("id", id);
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const assignInquiry = async (inquiryId: string, partnerId: string) => {
    await supabase.from("inquiries")
      .update({ status: "assigned", assigned_partner_id: partnerId })
      .eq("id", inquiryId);
    setInquiries(prev => prev.map(i => i.id === inquiryId ? { ...i, status: "assigned", assigned_partner_id: partnerId } : i));
  };

  const filterBySearch = (arr: any[], keys: string[]) =>
    search ? arr.filter(item => keys.some(k => String(item[k] || "").toLowerCase().includes(search.toLowerCase()))) : arr;

  /* ── Loading ── */
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-brand-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground font-semibold">Loading admin console…</p>
      </div>
    </div>
  );

  /* ── Stats ── */
  const STATS = [
    { label: "Platform Revenue", value: `$${revenue.toLocaleString()}`, icon: DollarSign, color: "text-brand-green", bg: "bg-brand-green/10" },
    { label: "Commission Earned", value: `$${commission.toLocaleString()}`, icon: Percent, color: "text-brand-gold", bg: "bg-brand-gold/10" },
    { label: "Total Bookings", value: bookings.length, icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active Partners", value: partners.length, icon: Briefcase, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Registered Tourists", value: tourists.length, icon: Users, color: "text-cyan-600", bg: "bg-cyan-50" },
    { label: "Pending Inquiries", value: inquiries.filter(i => i.status === "pending").length, icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">

      {/* ── Sidebar ── */}
      <aside className="hidden md:flex w-64 bg-white dark:bg-gray-900 border-r border-border flex-col h-screen sticky top-0 overflow-y-auto">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-border">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center">
              <Compass size={16} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-sm">RwandaExplore</p>
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Admin Portal</p>
            </div>
          </Link>
        </div>

        {/* Admin profile */}
        <div className="px-4 py-4 border-b border-border">
          <div className="flex items-center gap-3 bg-muted/50 rounded-xl p-3">
            <div className="w-9 h-9 bg-brand-green rounded-full flex items-center justify-center text-white font-bold text-sm">
              {profile?.full_name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm truncate">{profile?.full_name || "Admin"}</p>
              <p className="text-[10px] text-muted-foreground truncate">{profile?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {SIDEBAR.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={cn("admin-sidebar-item", tab === id && "active")}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 py-4 border-t border-border space-y-1">
          <Link href="/" className="admin-sidebar-item">
            <Eye size={17} />
            View Public Site
          </Link>
          <button onClick={handleSignOut} className="admin-sidebar-item text-red-500 hover:!bg-red-50 hover:!text-red-600">
            <LogOut size={17} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">

        {/* Top bar */}
        <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-border px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-bold text-lg text-foreground">
              {SIDEBAR.find(s => s.id === tab)?.label || "Overview"}
            </h1>
            <p className="text-xs text-muted-foreground">Platform Control Panel</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
              <input
                type="text"
                placeholder="Search…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-muted border border-border rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:border-brand-green w-52 transition-colors"
              />
            </div>
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell size={18} />
              {inquiries.filter(i => i.status === "pending").length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
          </div>
        </header>

        <div className="flex-1 p-6 max-w-7xl mx-auto w-full">

          {/* ======== OVERVIEW ======== */}
          {tab === "overview" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {STATS.map((s, i) => (
                  <div key={i} className="admin-stat-card">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", s.bg)}>
                      <s.icon size={20} className={s.color} />
                    </div>
                    <p className="text-2xl font-extrabold font-display">{s.value}</p>
                    <p className="text-xs text-muted-foreground mt-1 font-semibold">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Recent bookings */}
              <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                  <h3 className="font-bold">Recent Bookings</h3>
                  <button onClick={() => setTab("bookings")} className="text-xs text-brand-green font-semibold hover:underline">View all</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="data-table">
                    <thead><tr>
                      <th>Service</th><th>Location</th><th>Amount</th><th>Commission</th><th>Status</th>
                    </tr></thead>
                    <tbody>
                      {bookings.slice(0, 6).map(b => (
                        <tr key={b.id}>
                          <td className="font-semibold text-sm">{b.services?.title || "—"}</td>
                          <td className="text-muted-foreground text-xs flex items-center gap-1"><MapPin size={11} />{b.services?.location || "—"}</td>
                          <td className="font-bold text-brand-green">${b.total_price || 0}</td>
                          <td className="text-brand-gold font-semibold">${b.commission_amount || 0}</td>
                          <td><StatusBadge status={b.status} /></td>
                        </tr>
                      ))}
                      {bookings.length === 0 && (
                        <tr><td colSpan={5} className="text-center text-muted-foreground py-10">No bookings yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pending inquiries snapshot */}
              <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">Pending Lead Requests</h3>
                    {inquiries.filter(i=>i.status==="pending").length > 0 && (
                      <span className="badge badge-amber">{inquiries.filter(i=>i.status==="pending").length} new</span>
                    )}
                  </div>
                  <button onClick={() => setTab("inquiries")} className="text-xs text-brand-green font-semibold hover:underline">Route leads</button>
                </div>
                <div className="divide-y divide-border">
                  {inquiries.filter(i=>i.status==="pending").slice(0,3).map(inq => (
                    <div key={inq.id} className="px-6 py-4 flex items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-sm">{inq.tourist_name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin size={11}/>{inq.destination} · {inq.budget}</p>
                      </div>
                      <button onClick={() => setTab("inquiries")} className="text-xs bg-brand-green text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-brand-green/90 transition-colors whitespace-nowrap">
                        Assign →
                      </button>
                    </div>
                  ))}
                  {inquiries.filter(i=>i.status==="pending").length === 0 && (
                    <p className="text-center text-muted-foreground py-6 text-sm">No pending requests.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ======== BOOKINGS ======== */}
          {tab === "bookings" && (
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden animate-in fade-in duration-300">
              <div className="px-6 py-5 border-b border-border flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-bold text-lg">Bookings Ledger</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">All platform transactions — approve, confirm, or reject bookings.</p>
                </div>
                <button onClick={() => window.location.reload()} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg px-3 py-2">
                  <RefreshCw size={13} /> Refresh
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead><tr>
                    <th>Booking ID</th><th>Service</th><th>Client</th><th>Total</th><th>Commission</th><th>Status</th><th>Actions</th>
                  </tr></thead>
                  <tbody>
                    {filterBySearch(bookings, ["id","status"]).map(b => {
                      const details = b.booking_details || {};
                      return (
                        <tr key={b.id}>
                          <td className="font-mono text-xs text-brand-green font-bold">{b.id?.slice(0,8)}…</td>
                          <td>
                            <p className="font-semibold text-sm">{b.services?.title || "Service"}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin size={10}/>{b.services?.location}</p>
                          </td>
                          <td>
                            <p className="text-sm font-semibold">{details.customer_name || "—"}</p>
                            <p className="text-xs text-muted-foreground">{details.customer_phone}</p>
                          </td>
                          <td className="font-extrabold text-brand-green">${b.total_price || 0}</td>
                          <td className="font-bold text-brand-gold">${b.commission_amount || 0}</td>
                          <td><StatusBadge status={b.status} /></td>
                          <td>
                            {b.status === "pending" && (
                              <div className="flex gap-1.5">
                                <button onClick={() => updateBookingStatus(b.id, "confirmed")}
                                  className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors" title="Confirm">
                                  <CheckCircle size={15} />
                                </button>
                                <button onClick={() => updateBookingStatus(b.id, "cancelled")}
                                  className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors" title="Cancel">
                                  <XCircle size={15} />
                                </button>
                              </div>
                            )}
                            {b.status === "confirmed" && (
                              <button onClick={() => updateBookingStatus(b.id, "completed")}
                                className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg font-semibold hover:bg-blue-100 transition-colors">
                                Mark Done
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {bookings.length === 0 && (
                      <tr><td colSpan={7} className="text-center text-muted-foreground py-14">No bookings on the platform yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======== INQUIRIES / LEAD ROUTING ======== */}
          {tab === "inquiries" && (
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden animate-in fade-in duration-300">
              <div className="px-6 py-5 border-b border-border">
                <h2 className="font-bold text-lg">Lead Routing Centre</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Review custom travel requests and assign them to the most suitable verified partner.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead><tr>
                    <th>Tourist</th><th>Destination</th><th>Budget</th><th>Dates</th><th>Notes</th><th>Status</th><th>Assign to Partner</th>
                  </tr></thead>
                  <tbody>
                    {filterBySearch(inquiries, ["tourist_name","destination","status"]).map(inq => (
                      <tr key={inq.id}>
                        <td>
                          <p className="font-semibold text-sm">{inq.tourist_name}</p>
                          <p className="text-xs text-muted-foreground">{inq.tourist_email}</p>
                        </td>
                        <td className="font-semibold text-sm flex items-center gap-1"><MapPin size={12} className="text-brand-gold"/>{inq.destination}</td>
                        <td className="font-bold text-brand-green">{inq.budget}</td>
                        <td className="text-xs text-muted-foreground whitespace-nowrap">{inq.travel_dates}</td>
                        <td className="max-w-xs">
                          <p className="text-xs text-muted-foreground italic line-clamp-2">"{inq.notes}"</p>
                        </td>
                        <td><StatusBadge status={inq.status} /></td>
                        <td>
                          {inq.status === "pending" ? (
                            <select
                              className="text-xs border border-border bg-background rounded-lg px-2.5 py-2 outline-none focus:border-brand-green cursor-pointer min-w-[160px]"
                              defaultValue=""
                              onChange={e => e.target.value && assignInquiry(inq.id, e.target.value)}
                            >
                              <option value="" disabled>Select partner…</option>
                              {partners.map(p => (
                                <option key={p.id} value={p.id}>{p.full_name}</option>
                              ))}
                              {partners.length === 0 && <option disabled>No partners registered</option>}
                            </select>
                          ) : (
                            <span className="text-xs font-bold text-green-600 flex items-center gap-1"><UserCheck size={13}/> Assigned</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {inquiries.length === 0 && (
                      <tr><td colSpan={7} className="text-center text-muted-foreground py-14">No custom requests yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======== PARTNERS ======== */}
          {tab === "partners" && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-border">
                  <h2 className="font-bold text-lg">Tour Operators & Partners</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">{partners.length} registered partner{partners.length !== 1 ? "s" : ""}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                  {filterBySearch(partners, ["full_name","email"]).map(p => (
                    <div key={p.id} className="border border-border rounded-xl p-5 hover:border-brand-green/40 hover:shadow-sm transition-all">
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 bg-brand-green/10 rounded-xl flex items-center justify-center font-bold text-brand-green font-display shrink-0">
                          {p.full_name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-sm truncate">{p.full_name}</p>
                          <p className="text-xs text-muted-foreground truncate">{p.email}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="badge badge-green">Verified Partner</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {partners.length === 0 && (
                    <div className="col-span-3 text-center text-muted-foreground py-14">
                      <Briefcase className="mx-auto mb-3 opacity-30" size={36}/>
                      <p className="font-semibold">No partners registered yet.</p>
                      <p className="text-xs mt-1">Partners will appear here once they register on the platform.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ======== TOURISTS ======== */}
          {tab === "tourists" && (
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden animate-in fade-in duration-300">
              <div className="px-6 py-5 border-b border-border">
                <h2 className="font-bold text-lg">Registered Tourists</h2>
                <p className="text-xs text-muted-foreground mt-0.5">{tourists.length} registered tourist{tourists.length !== 1 ? "s" : ""}</p>
              </div>
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead><tr>
                    <th>Name</th><th>Email</th><th>Joined</th><th>Status</th>
                  </tr></thead>
                  <tbody>
                    {filterBySearch(tourists, ["full_name","email"]).map(t => (
                      <tr key={t.id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                              {t.full_name?.charAt(0)?.toUpperCase()}
                            </div>
                            <span className="font-semibold text-sm">{t.full_name}</span>
                          </div>
                        </td>
                        <td className="text-muted-foreground text-sm">{t.email}</td>
                        <td className="text-xs text-muted-foreground">
                          {t.created_at ? new Date(t.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                        </td>
                        <td><span className="badge badge-green">Active</span></td>
                      </tr>
                    ))}
                    {tourists.length === 0 && (
                      <tr><td colSpan={4} className="text-center text-muted-foreground py-14">No tourists registered yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
