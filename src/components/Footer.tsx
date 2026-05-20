import Link from "next/link";
import { Compass, MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube, ArrowRight } from "lucide-react";

const FOOTER_LINKS = {
  Explore: [
    { label: "Tours & Safaris",     href: "/tours" },
    { label: "Luxury Hotels",       href: "/hotels" },
    { label: "Travel Packages",     href: "/packages" },
    { label: "Verified Agencies",   href: "/agencies" },
    { label: "About Rwanda",        href: "/about" },
  ],
  Company: [
    { label: "About Us",      href: "/about" },
    { label: "Contact",       href: "/contact" },
    { label: "Careers",       href: "/careers" },
    { label: "Press",         href: "/press" },
    { label: "Blog",          href: "/blog" },
  ],
  Legal: [
    { label: "Privacy Policy",    href: "/privacy" },
    { label: "Terms of Service",  href: "/terms" },
    { label: "Cookie Policy",     href: "/cookies" },
    { label: "Refund Policy",     href: "/refunds" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300">
      {/* Top newsletter bar */}
      <div className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="font-display text-white font-bold text-lg">Get Rwanda Travel Inspiration</h4>
            <p className="text-sm text-gray-400 mt-1">Join 12,000+ travellers receiving weekly Rwanda updates.</p>
          </div>
          <form className="flex gap-2 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 md:w-64 bg-gray-800 border border-gray-700 rounded-full px-5 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-brand-gold transition-colors"
            />
            <button type="submit" className="bg-brand-gold text-white px-5 py-3 rounded-full text-sm font-bold hover:bg-brand-gold/90 transition-all flex items-center gap-2 shrink-0">
              Subscribe <ArrowRight size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 bg-brand-green rounded-xl flex items-center justify-center">
                <Compass size={20} className="text-white" />
              </div>
              <span className="font-display font-bold text-lg text-white">
                Rwanda<span className="text-brand-gold">Explore</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-sm">
              Rwanda's premier tourism marketplace connecting travellers with RTTA-verified local tour operators, luxury lodges, and immersive cultural experiences.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2"><MapPin size={14} className="text-brand-gold shrink-0" /> Kigali, Rwanda</div>
              <div className="flex items-center gap-2"><Phone  size={14} className="text-brand-gold shrink-0" /> +250 788 000 000</div>
              <div className="flex items-center gap-2"><Mail   size={14} className="text-brand-gold shrink-0" /> hello@rwandaexplore.rw</div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h5 className="text-white font-bold text-sm uppercase tracking-widest mb-5">{title}</h5>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}
                      className="text-sm text-gray-400 hover:text-brand-gold transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} RwandaExplore. All rights reserved. Developed with ❤️ in Kigali.
          </p>
          <div className="flex items-center gap-4">
            {[
              { icon: <Facebook size={16} />, href: "#" },
              { icon: <Twitter  size={16} />, href: "#" },
              { icon: <Instagram size={16}/>, href: "#" },
              { icon: <Youtube  size={16} />, href: "#" },
            ].map((social, i) => (
              <a key={i} href={social.href}
                className="text-gray-500 hover:text-brand-gold transition-colors"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
