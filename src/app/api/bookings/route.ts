import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { initiatePayment } from "@/lib/payments/flutterwave";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // 1. Authenticate the user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to book." },
        { status: 401 }
      );
    }

    // 2. Parse booking request details
    const { service_id, date, guests_count, phone, customer_name } = await request.json();

    if (!service_id || !date || !guests_count || !phone || !customer_name) {
      return NextResponse.json(
        { error: "Missing required fields (service_id, date, guests_count, phone, customer_name)" },
        { status: 400 }
      );
    }

    // 3. Fetch service price from the database
    const { data: service, error: serviceError } = await supabase
      .from("services")
      .select("title, price, partner_id")
      .eq("id", service_id)
      .single();

    if (serviceError || !service) {
      console.error("Service fetch error:", serviceError);
      return NextResponse.json(
        { error: "Selected service not found" },
        { status: 404 }
      );
    }

    // Calculate total price and commission (e.g. 10% platform fee)
    const pricePerPerson = service.price;
    const totalPrice = pricePerPerson * Number(guests_count);
    const commissionAmount = totalPrice * 0.1; // 10% commission

    // 4. Create pending booking in database
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        service_id,
        tourist_id: user.id,
        status: "pending",
        total_price: totalPrice,
        commission_amount: commissionAmount,
        booking_details: {
          guests_count: Number(guests_count),
          travel_date: date,
          customer_phone: phone,
          customer_name: customer_name,
          service_title: service.title,
        },
      })
      .select("id")
      .single();

    if (bookingError || !booking) {
      console.error("Booking creation error:", bookingError);
      return NextResponse.json(
        { error: "Failed to create booking transaction" },
        { status: 500 }
      );
    }

    // 5. Initiate Flutterwave Payment
    const paymentResponse = await initiatePayment({
      amount: totalPrice,
      email: user.email || "guest@rwandaexplore.com",
      tx_ref: booking.id,
      name: customer_name,
      phone: phone,
    });

    if (paymentResponse.status === "success" && paymentResponse.data?.link) {
      return NextResponse.json({
        status: "success",
        payment_url: paymentResponse.data.link,
        booking_id: booking.id,
      });
    } else {
      console.error("Flutterwave payment initiation error:", paymentResponse);
      return NextResponse.json(
        { error: "Payment gateway integration failed. Please try again." },
        { status: 502 }
      );
    }
  } catch (error: any) {
    console.error("Unhandled error in bookings API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
