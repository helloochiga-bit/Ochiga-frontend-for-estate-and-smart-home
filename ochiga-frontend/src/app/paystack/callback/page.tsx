'use client';

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";

const PaystackCallbackContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");

  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [toastLoaded, setToastLoaded] = useState<any>(null);

  // Dynamically import toast on client-side only
  useEffect(() => {
    import("sonner").then((mod) => setToastLoaded(() => mod.toast));
  }, []);

  useEffect(() => {
    if (!reference) {
      setStatus("failed");
      toastLoaded?.error("Missing payment reference");
      return;
    }

    const verifyPaymentStatus = async () => {
      try {
        const { verifyPayment } = await import("@/lib/wallet"); // dynamic import at runtime
        const res = await verifyPayment(reference!);

        if (res?.success) {
          setStatus("success");
          toastLoaded?.success("Wallet funded successfully! 🎉");

          setTimeout(() => {
            router.push("/ai-dashboard");
          }, 1500);
        } else {
          setStatus("failed");
          toastLoaded?.error(res?.message || "Payment verification failed");
        }
      } catch (err) {
        console.error(err);
        setStatus("failed");
        toastLoaded?.error("Server error verifying payment.");
      }
    };

    if (toastLoaded) {
      verifyPaymentStatus();
    }
  }, [reference, toastLoaded, router]);

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
          <p className="mt-4 text-green-400 font-semibold">Payment Successful!</p>
          <p className="text-gray-400 text-xs">Redirecting to your dashboard...</p>
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
};

// Wrap in dynamic import to ensure no SSR
export default dynamic(() => Promise.resolve(PaystackCallbackContent), { ssr: false });
