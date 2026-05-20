"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Phone, Mail, Search, ShieldCheck } from "lucide-react";
import Footer from "@/components/Footer";
import partnersData from "@/lib/rtta_partners.json";
import { useTranslation } from "react-i18next";

export default function AgenciesPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPartners = partnersData.filter((partner) =>
    partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    partner.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div className="flex-grow">
        {/* Banner header */}
        <section className="relative h-[45vh] flex items-center justify-center overflow-hidden">
          <Image
            src="/akagera.png"
            alt="RTTA Partners"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/45 to-background" />
          <div className="relative z-10 text-center text-white px-6">
            <span className="bg-brand-gold/90 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest mb-4 inline-block shadow-md">
              <ShieldCheck size={14} className="inline mr-1" /> RTTA Members
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold font-display leading-tight">
              Verified Tour Operators
            </h1>
            <p className="text-sm md:text-base mt-2 max-w-xl mx-auto opacity-90 font-medium">
              Browse over 120 official Rwanda Tours and Travel Association member companies.
            </p>
          </div>
        </section>

        {/* List section */}
        <section className="py-16 container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-border">
            <div>
              <h2 className="text-xl font-bold font-display text-brand-green">Agency Directory</h2>
              <p className="text-xs text-muted-foreground font-medium mt-1">Connect directly with licensed professionals.</p>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                type="text"
                placeholder="Search agency by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-card border border-border rounded-xl py-2.5 pl-10 pr-4 w-full text-xs font-semibold focus:ring-2 focus:ring-brand-green outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          {filteredPartners.length === 0 ? (
            <div className="py-24 text-center text-muted-foreground">
              <Search className="mx-auto text-muted-foreground/30 mb-3 animate-pulse" size={48} />
              <p className="font-bold text-lg">No agencies found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPartners.map((partner, index) => (
                <div key={index} className="bg-card rounded-2xl p-6 border border-border/50 hover:shadow-md transition-all shadow-sm flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-bold text-base text-foreground font-display line-clamp-2 leading-tight">
                        {partner.name}
                      </h3>
                      <div className="bg-green-50 text-green-600 p-1.5 rounded-lg shrink-0">
                        <ShieldCheck size={16} />
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-6">
                      <p className="text-xs text-muted-foreground flex items-center gap-2">
                        <MapPin size={14} className="text-brand-gold shrink-0" /> 
                        <span className="line-clamp-1">{partner.location}</span>
                      </p>
                      {partner.phone !== "N/A" && (
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                          <Phone size={14} className="text-brand-gold shrink-0" /> 
                          {partner.phone}
                        </p>
                      )}
                      {partner.email !== "N/A" && (
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                          <Mail size={14} className="text-brand-gold shrink-0" /> 
                          <span className="truncate">{partner.email}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <button className="w-full bg-brand-green/10 text-brand-green hover:bg-brand-green hover:text-white py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer">
                    Contact Agency
                  </button>
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
