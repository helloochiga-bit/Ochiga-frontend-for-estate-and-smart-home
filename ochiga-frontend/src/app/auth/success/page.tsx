"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function SuccessPage() {
  const params = useSearchParams();
  const router = useRouter();

  // ✅ Safe access to query param
  const name = params?.get("name") ?? null;

  useEffect(() => {
    const t = setTimeout(() => router.push("/auth"), 2500);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <div className="text-center">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-semibold mb-2">Welcome, {name || "Estate"}!</h1>
        <p className="text-gray-400">Registration complete — redirecting to login...</p>
      </div>
    </div>
  );
}
