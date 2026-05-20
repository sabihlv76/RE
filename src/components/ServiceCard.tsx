import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  type: string;
}

export default function ServiceCard({
  id,
  title,
  location,
  price,
  rating,
  reviews,
  image,
  type
}: ServiceCardProps) {
  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border/50 group hover:shadow-md transition-shadow">
      <div className="relative h-48">
        <Image 
          src={image} 
          alt={title} 
          fill 
          className="object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        <button className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/40 transition-colors">
          <Heart size={18} />
        </button>
        <div className="absolute bottom-4 left-4 bg-brand-green/90 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
          {type}
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-1 text-brand-gold mb-2">
          <Star size={14} fill="currentColor" />
          <span className="text-sm font-bold">{rating}</span>
          <span className="text-xs text-muted-foreground">({reviews})</span>
        </div>
        <h3 className="font-bold text-lg mb-1 group-hover:text-brand-green transition-colors">{title}</h3>
        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-4">
          <MapPin size={14} />
          {location}
        </div>
        <div className="flex items-center justify-between border-t border-border pt-4">
          <div>
            <span className="text-lg font-bold text-brand-green">${price}</span>
            <span className="text-xs text-muted-foreground ml-1">/ person</span>
          </div>
          <Link 
            href={`/services/${id}`}
            className="bg-brand-green/10 text-brand-green hover:bg-brand-green hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-all"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}
