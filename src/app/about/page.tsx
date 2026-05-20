"use client";

import Image from "next/image";
import { Compass, ShieldCheck, Heart, Users, MapPin, Star } from "lucide-react";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function AboutRwandaPage() {
  const KINYARWANDA_PHRASES = [
    { phrase: "Muraho", meaning: "Hello (General)" },
    { phrase: "Amakuru?", meaning: "How are you?" },
    { phrase: "Ni meza", meaning: "I am fine" },
    { phrase: "Murakoze", meaning: "Thank you" },
    { phrase: "Ikaze", meaning: "Welcome" },
    { phrase: "Ndabashimiye", meaning: "I appreciate you" }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div className="flex-grow">
        
        {/* Banner Section */}
        <section className="relative h-[55vh] flex items-center justify-center overflow-hidden">
          <Image
            src="/hero.png"
            alt="Beautiful Rwanda hills"
            fill
            className="object-cover scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-background" />
          <div className="relative z-10 text-center text-white px-6">
            <span className="bg-brand-gold/90 text-white text-xs font-bold px-3.5 py-2 rounded-full uppercase tracking-widest mb-4 inline-block shadow-md">
              Discover Rwanda
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold font-display leading-tight">
              Land of a Thousand Hills
            </h1>
            <p className="text-sm md:text-lg mt-3 max-w-2xl mx-auto opacity-95 font-medium leading-relaxed">
              Experience Rwanda’s stunning biodiversity, majestic volcanic peaks, rich cultural heritage, and warm hospitable communities.
            </p>
          </div>
        </section>

        {/* Core Pillars */}
        <section className="py-24 container mx-auto px-6 max-w-5xl space-y-24">
          
          {/* Pillar 1: Gorillas & Conservation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -35 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <span className="bg-brand-green/10 text-brand-green text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                Conservation & Hikes
              </span>
              <h2 className="text-3xl font-bold font-display text-brand-green">Majestic Mountain Gorillas</h2>
              <p className="text-muted-foreground leading-relaxed text-base">
                Rwanda’s **Volcanoes National Park** is home to the critically endangered mountain gorillas. Our community-led conservation programs ensure that gorilla trekking permits directly fund habitat restoration and local schools, protecting these gentle giants for generations to come.
              </p>
              <div className="flex gap-4 items-center bg-brand-green/5 border border-brand-green/10 p-4 rounded-xl text-xs text-brand-green font-semibold">
                <ShieldCheck size={20} className="shrink-0" />
                <span>Permits are regulated to prevent tourism congestion and foster pristine forest conservation.</span>
              </div>
            </motion.div>
            <div className="relative h-80 rounded-3xl overflow-hidden shadow-lg border border-border">
              <Image src="/volcanoes.png" alt="Gorilla trekking forest" fill className="object-cover" />
            </div>
          </div>

          {/* Pillar 2: Safaris & Lakes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
            <div className="relative h-80 rounded-3xl overflow-hidden shadow-lg border border-border order-last md:order-first">
              <Image src="/akagera.png" alt="Savannah Safari" fill className="object-cover" />
            </div>
            <motion.div 
              initial={{ opacity: 0, x: 35 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <span className="bg-brand-green/10 text-brand-green text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                Diverse Wildlife
              </span>
              <h2 className="text-3xl font-bold font-display text-brand-green">Savannahs & Canopy Walks</h2>
              <p className="text-muted-foreground leading-relaxed text-base">
                From the savannah plains of **Akagera National Park**—where the Big Five roam freely—to the pristine primary rainforest of **Nyungwe National Park**, which hosts chimpanzees and a famous suspended Canopy Walk, Rwanda offers dramatic ecological transitions within a few hours’ drive.
              </p>
            </motion.div>
          </div>

          {/* Pillar 3: Language & Culture Guide */}
          <div className="bg-card border border-border p-8 md:p-12 rounded-3xl shadow-sm">
            <div className="text-center max-w-xl mx-auto mb-10 space-y-3">
              <h2 className="text-2xl font-bold font-display text-brand-green">Culture & Language Pocket Guide</h2>
              <p className="text-xs text-muted-foreground">Rwandan communities are famous for their hospitality (Ubupfura). Here are useful Kinyarwanda words to connect with locals:</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {KINYARWANDA_PHRASES.map((item, i) => (
                <div key={i} className="bg-muted/30 border border-border/50 p-5 rounded-2xl hover:border-brand-gold/40 transition-colors text-center">
                  <p className="font-bold text-brand-green font-display text-lg">{item.phrase}</p>
                  <p className="text-xs text-muted-foreground font-semibold mt-1">{item.meaning}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-brand-gold/5 border border-brand-gold/15 p-6 rounded-2xl text-center max-w-2xl mx-auto text-xs text-brand-earth">
              <p className="font-bold uppercase tracking-wider text-brand-gold mb-1">💡 Travel Pro Tip</p>
              <p className="opacity-95 leading-relaxed font-semibold">
                Plastic bags are strictly banned in Rwanda to preserve cleanliness. The last Saturday of every month is **Umuganda** (Community Service day), where citizens unite to clean and build community infrastructure.
              </p>
            </div>
          </div>

        </section>

      </div>
      <Footer />
    </div>
  );
}
