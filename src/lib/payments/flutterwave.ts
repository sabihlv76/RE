export async function initiatePayment(details: {
  amount: number;
  email: string;
  tx_ref: string;
  name: string;
  phone: string;
}) {
  const url = "https://api.flutterwave.com/v3/payments";
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tx_ref: details.tx_ref,
      amount: details.amount,
      currency: "RWF",
      redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/callback`,
      customer: {
        email: details.email,
        phonenumber: details.phone,
        name: details.name,
      },
      customizations: {
        title: "RwandaExplore Booking",
        logo: `${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`,
      },
    }),
  });

  return response.json();
}
