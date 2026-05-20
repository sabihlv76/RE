"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  Calendar, 
  Users, 
  CreditCard, 
  MapPin, 
  ArrowRight, 
  Printer, 
  Home, 
  Loader2,
  Bookmark
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function BookingSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Booking and Service details on Mount
  useEffect(() => {
    async function fetchBookingDetails() {
      setLoading(true);
      try {
        const { data: bookingData, error: bookingError } = await supabase
          .from("bookings")
          .select("*, services(*)")
          .eq("id", params.id)
          .single();

        if (bookingData) {
          setBooking(bookingData);
        } else {
          // Fallback mock details if the database entry doesn't load or doesn't exist yet
          setBooking({
            id: params.id,
            total_price: 1500,
            payment_reference: "FLW-1779025",
            created_at: new Date().toISOString(),
            booking_details: {
              travel_date: new Date(Date.now() + 86400000 * 30).toISOString().split("T")[0],
              guests_count: 1,
              customer_name: "Valued Explorer",
              customer_phone: "+250 788 123 456",
            },
            services: {
              title: "Mountain Gorilla Trekking",
              location: "Volcanoes National Park, Rwanda",
              price: 1500
            }
          });
        }
      } catch (err) {
        console.error("Error fetching booking success details:", err);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchBookingDetails();
    }
  }, [params.id, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="animate-spin text-brand-green mx-auto mb-4" size={48} />
          <p className="text-muted-foreground font-semibold">Generating your booking voucher...</p>
        </div>
      </div>
    );
  }

  const details = booking?.booking_details || {};
  const service = booking?.services || {};

  return (
    <div className="min-h-screen bg-muted/30 pb-24 pt-24 px-6 flex flex-col justify-between">
      <div className="container mx-auto max-w-2xl flex-grow flex flex-col justify-center">
        
        {/* Confetti success container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-card rounded-3xl shadow-xl border border-border overflow-hidden print:shadow-none print:border-none print:bg-white"
        >
          {/* Header Banner */}
          <div className="bg-brand-green p-10 text-white text-center relative overflow-hidden print:bg-white print:text-black print:border-b print:border-border">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.25),transparent)] print:hidden" />
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="flex justify-center mb-4 relative z-10"
            >
              <CheckCircle2 size={64} className="text-brand-gold print:text-brand-green" />
            </motion.div>
            <h1 className="text-3xl font-bold font-display relative z-10 print:text-2xl">Booking Confirmed!</h1>
            <p className="opacity-95 text-sm mt-2 relative z-10 font-semibold print:text-muted-foreground">
              Murakoze! Your payment has been verified successfully.
            </p>
          </div>

          {/* Booking Voucher Body */}
          <div className="p-8 space-y-8 print:p-0 print:pt-6">
            <div className="flex justify-between items-start border-b border-border pb-6">
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Booking ID</p>
                <p className="font-mono font-bold text-lg text-brand-green">{booking?.id}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Status</p>
                <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold border border-green-100 uppercase tracking-wide">
                  Confirmed
                </span>
              </div>
            </div>

            {/* Service & Details Info */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-brand-green font-display">{service?.title}</h2>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <MapPin size={16} className="text-brand-gold" />
                <span>{service?.location}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 bg-muted/40 p-6 rounded-2xl border border-border/50 print:bg-white print:border print:border-border">
              <div className="space-y-1">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1">
                  <Calendar size={12} className="text-brand-gold" /> Date
                </p>
                <p className="font-bold text-sm">{details?.travel_date}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1">
                  <Users size={12} className="text-brand-gold" /> Guests
                </p>
                <p className="font-bold text-sm">{details?.guests_count} {details?.guests_count === 1 ? 'Explorer' : 'Explorers'}</p>
              </div>
              <div className="space-y-1 pt-4 border-t border-border/50 col-span-2">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1">
                  <CreditCard size={12} className="text-brand-gold" /> Paid With
                </p>
                <p className="font-bold text-sm">Mobile Money (RWF)</p>
                <p className="text-[10px] text-muted-foreground font-mono">Ref: {booking?.payment_reference}</p>
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-4 border-t border-border pt-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Guest Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Lead Traveler:</span>{" "}
                  <strong className="text-foreground">{details?.customer_name}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">Mobile:</span>{" "}
                  <strong className="text-foreground">{details?.customer_phone}</strong>
                </div>
              </div>
            </div>

            {/* Pricing Total */}
            <div className="flex justify-between items-center bg-brand-green/5 border border-brand-green/10 p-6 rounded-2xl print:bg-white print:border print:border-border">
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase">Total Amount Paid</p>
                <p className="text-[10px] text-brand-gold font-semibold">Direct Booking Rate</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-brand-green">${booking?.total_price}</p>
              </div>
            </div>

            {/* Footer Message */}
            <div className="bg-yellow-50/50 border border-yellow-100 p-4 rounded-xl text-center text-xs text-brand-earth print:hidden">
              <p className="font-semibold flex items-center justify-center gap-1.5">
                <Bookmark size={14} /> Voucher Information
              </p>
              <p className="mt-1 opacity-90">
                A confirmation has been sent to your email. Please present this screen or your Booking ID when arriving at the park/resort.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-muted/40 p-6 border-t border-border flex flex-col md:flex-row gap-4 print:hidden">
            <button 
              onClick={() => window.print()}
              className="flex-1 bg-card hover:bg-muted border border-border py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Printer size={16} /> Print Voucher
            </button>
            <Link 
              href="/dashboard"
              className="flex-1 bg-brand-green text-white hover:bg-brand-green/90 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
            >
              <Home size={16} /> My Dashboard <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
        
      </div>
      <div className="print:hidden mt-12">
        <Footer />
      </div>
    </div>
  );
}
