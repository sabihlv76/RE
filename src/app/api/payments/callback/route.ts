import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const data = await request.json();
  const supabase = await createClient();

  // Verify signature if possible (Flutterwave-Signature)
  // ...

  if (data.status === "successful") {
    const { tx_ref, amount, customer } = data;

    // Update booking status in database
    const { error } = await supabase
      .from("bookings")
      .update({ status: "confirmed", payment_reference: data.id })
      .eq("id", tx_ref);

    if (error) {
      console.error("Error updating booking:", error);
      return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
    }

    return NextResponse.json({ status: "success" });
  }

  return NextResponse.json({ status: "failed" });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const tx_ref = searchParams.get("tx_ref");

  if (status === "successful") {
    // Redirect to success page
    return NextResponse.redirect(new URL(`/dashboard/bookings/${tx_ref}/success`, request.url));
  }

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
