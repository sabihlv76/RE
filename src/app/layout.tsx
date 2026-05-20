import type { Metadata, Viewport } from "next";
import { Geist_Mono, Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import I18nProvider from "@/components/I18nProvider";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "RwandaExplore | Discover the Heart of Africa",
  description:
    "Book unforgettable tours, hotels, and experiences in Rwanda. Verified local partners, secure payments with MTN MoMo & Airtel Money.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "RwandaExplore",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d6b42",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistMono.variable} ${playfair.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <I18nProvider>
          <ConditionalNavbar />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
