"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function VerifyPage() {
  const params = useSearchParams();
  const reference = params.get("reference");

  const [status, setStatus] = useState("Verifying payment...");

  useEffect(() => {
    if (!reference) return;

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/wallets/paystack/verify/${reference}`,
      { credentials: "include" }
    )
      .then((r) => r.json())
      .then((res) => {
        if (res.error) setStatus("Payment Failed ❌");
        else setStatus("Wallet Funded Successfully ✔");
      })
      .catch(() => setStatus("Verification Error ❌"));
  }, [reference]);

  return (
    <div className="p-6 text-white">
      <h1 className="text-xl">{status}</h1>
    </div>
  );
}
