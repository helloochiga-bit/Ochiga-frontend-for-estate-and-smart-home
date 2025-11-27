"use client";

import { useEffect, useState } from "react";
import { verifyPayment } from "@/lib/wallet";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function PaystackCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    const reference = params.get("reference");

    if (!reference) {
      setStatus("error");
      toast.error("Invalid payment reference");
      return;
    }

    // Verify payment with backend
    async function verify() {
      try {
        const res = await verifyPayment(reference);

        if (res?.status === "success") {
          setStatus("success");
          toast.success("Payment successful! Wallet updated.");

          // redirect after 2 seconds
          setTimeout(() => {
            router.push("/ai-dashboard");
          }, 2000);
        } else {
          setStatus("error");
          toast.error(res?.error || "Payment verification failed");
        }
      } catch (err) {
        console.error(err);
        setStatus("error");
        toast.error("Unable to verify payment");
      }
    }

    verify();
  }, [params, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white">
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 text-center w-[300px]">
        {status === "loading" && (
          <>
            <p className="text-purple-400 font-semibold mb-2">
              Verifying Payment...
            </p>
            <p className="text-xs text-gray-400">
              Please wait while we update your wallet.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <p className="text-green-400 font-semibold mb-2">
              Payment Successful 🎉
            </p>
            <p className="text-xs text-gray-400">Redirecting...</p>
          </>
        )}

        {status === "error" && (
          <>
            <p className="text-red-400 font-semibold mb-2">
              Verification Failed ❌
            </p>
            <p className="text-xs text-gray-400">
              Something went wrong. Try again.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
