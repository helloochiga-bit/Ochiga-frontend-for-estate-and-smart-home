"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function WalletVerifyPage() {
  const params = useSearchParams();
  const reference = params.get("reference");

  const [status, setStatus] = useState("Verifying payment...");

  useEffect(() => {
    if (!reference) {
      setStatus("Missing payment reference ❌");
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await fetch(
          `/api/wallets/paystack/verify?reference=${reference}`,
          { credentials: "include" }
        );

        const data = await res.json();

        if (data.error) setStatus("Payment Failed ❌");
        else setStatus("Wallet Funded Successfully ✔");
      } catch (err) {
        console.error(err);
        setStatus("Verification Error ❌");
      }
    };

    verifyPayment();
  }, [reference]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-white bg-[#0c0c0d]">
      <h1 className="text-xl">{status}</h1>
    </div>
  );
}
