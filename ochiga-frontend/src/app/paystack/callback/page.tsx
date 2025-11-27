"use client";

import { useEffect, useState } from "react";
import { verifyPayment } from "@/lib/wallet";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function PaystackCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");

  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    "loading"
  );

  useEffect(() => {
    if (!reference) {
      setStatus("failed");
      toast.error("Missing payment reference");
      return;
    }

    verifyPaymentStatus();
  }, [reference]);

  async function verifyPaymentStatus() {
    try {
      const res = await verifyPayment(reference!);

      if (res?.success) {
        setStatus("success");
        toast.success("Wallet funded successfully! 🎉");

        setTimeout(() => {
          router.push("/ai-dashboard");
        }, 1500);
      } else {
        setStatus("failed");
        toast.error(res?.message || "Payment verification failed");
      }
    } catch (err) {
      console.error(err);
      setStatus("failed");
      toast.error("Server error verifying payment.");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0c0c0d] text-white p-6">
      {/* Loading State */}
      {status === "loading" && (
        <div className="flex flex-col items-center animate-fadeIn">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-300 text-sm">Verifying payment...</p>
        </div>
      )}

      {/* Success State */}
      {status === "success" && (
        <div className="flex flex-col items-center animate-fadeIn">
          <div className="w-14 h-14 flex items-center justify-center bg-green-600 rounded-full animate-scaleIn">
            <span className="text-xl">✓</span>
          </div>
          <p className="mt-4 text-green-400 font-semibold">
            Payment Successful!
          </p>
          <p className="text-gray-400 text-xs">
            Redirecting to your dashboard...
          </p>
        </div>
      )}

      {/* Failed State */}
      {status === "failed" && (
        <div className="flex flex-col items-center animate-fadeIn">
          <div className="w-14 h-14 flex items-center justify-center bg-red-600 rounded-full animate-scaleIn">
            <span className="text-xl">✕</span>
          </div>
          <p className="mt-4 text-red-400 font-semibold">Payment Failed</p>
          <button
            onClick={() => router.push("/ai-dashboard")}
            className="mt-3 px-4 py-1 text-xs bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg"
          >
            Go Back
          </button>
        </div>
      )}
    </div>
  );
}
