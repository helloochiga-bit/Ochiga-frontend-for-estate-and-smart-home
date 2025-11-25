"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import LoaderCircle from "../components/ui/LoaderCircle";

const QrScanner = dynamic(() => import("../components/QrScanner"), { ssr: false });

function OnboardTokenHandler() {
  const { useRouter, useSearchParams } = require("next/navigation");
  const router = useRouter();
  const params = useSearchParams();

  const tokenParam = params?.get("token") ?? null;
  const [verifying, setVerifying] = useState(false);

  const verifyTokenAndProceed = async (token: string | null) => {
    if (!token) return;
    setVerifying(true);
    await new Promise((r) => setTimeout(r, 800));

    const invites = JSON.parse(localStorage.getItem("ochiga_invites") || "[]");
    const found = invites.find(
      (i: any) => i.token === token && i.type === "homeInvite" && !i.used
    );

    if (!found) {
      alert("Invalid or expired invite token.");
      setVerifying(false);
      return;
    }

    found.used = true;
    localStorage.setItem("ochiga_invites", JSON.stringify(invites));

    setTimeout(() => router.push(`/auth/resident-complete?token=${token}`), 700);
  };

  useEffect(() => {
    if (tokenParam) verifyTokenAndProceed(tokenParam);
  }, [tokenParam]);

  return (
    <>
      {!tokenParam && (
        <p className="text-sm text-gray-400 text-center mb-4">
          Point your device camera at the QR sent to your email.
        </p>
      )}
      <div className="bg-gray-900 p-4 rounded border border-gray-800">
        <QrScanner onScan={(data) => { if (data) verifyTokenAndProceed(data); }} />
      </div>
      {verifying && (
        <div className="flex flex-col items-center mt-6 text-center">
          <LoaderCircle />
          <p className="text-sm text-gray-400 mt-2">Verifying invite...</p>
        </div>
      )}
    </>
  );
}

export default function OnboardPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-xl p-4">
        <h2 className="text-lg font-semibold mb-3 text-center">
          Scan QR to complete onboarding
        </h2>
        {/* Suspense wrapper required by Next.js 15 */}
        <Suspense fallback={<LoaderCircle />}>
          <OnboardTokenHandler />
        </Suspense>
      </div>
    </div>
  );
}
