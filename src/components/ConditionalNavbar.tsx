"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

const HIDDEN_ROUTES = ["/admin", "/partner", "/dashboard", "/auth"];

export default function ConditionalNavbar() {
  const pathname = usePathname();
  const isHidden = HIDDEN_ROUTES.some(route => pathname.startsWith(route));
  if (isHidden) return null;
  return <Navbar />;
}
