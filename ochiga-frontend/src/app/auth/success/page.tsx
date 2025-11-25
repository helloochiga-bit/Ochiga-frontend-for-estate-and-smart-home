"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function SuccessRedirector() {
  const params = useSearchParams();
  const router = useRouter();

  const name = params?.get("name") ?? null;

  useEffect(() => {
    const t = setTimeout(() => router.push("/auth"), 2500);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="text-center">
      <div className="text-5xl mb-4">✅</div>
      <h1 className="text-2xl font-semibold mb-2">Welcome, {name || "Estate"}!</h1>
      <p className="text-gray-400">Registration complete — redirecting to login...</p>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <Suspense fallback={<div className="text-center">Loading…</div>}>
        <SuccessRedirector />
      </Suspense>
    </div>
  );
}
