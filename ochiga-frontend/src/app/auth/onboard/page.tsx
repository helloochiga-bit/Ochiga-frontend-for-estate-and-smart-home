"use client";

import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
const QrScanner = dynamic(() => import("../components/QrScanner"), { ssr: false });
import LoaderCircle from "../components/ui/LoaderCircle";

export default function OnboardPage() {
  const router = useRouter();
  const params = useSearchParams();
  const tokenParam = params?.get("token") ?? null;
  const [verifying, setVerifying] = useState(false);

  const verifyTokenAndProceed = async (token: string | null) => {
    if (!token) return;
    setVerifying(true);
    await new Promise((r) => setTimeout(r, 800));

    const invites = JSON.parse(localStorage.getItem("ochiga_invites") || "[]");
    const found = invites.find((i: any) => i.token === token && i.type === "homeInvite" && !i.used);

    if (!found) {
      alert("Invalid or expired invite token.");
      setVerifying(false);
      return;
    }

    // mark used (demo)
    found.used = true;
    localStorage.setItem("ochiga_invites", JSON.stringify(invites));

    // redirect to resident-complete with token
    setTimeout(() => router.push(`/auth/resident-complete?token=${token}`), 700);
  };

  useEffect(() => {
    if (tokenParam) verifyTokenAndProceed(tokenParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenParam]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-xl p-4">
        <h2 className="text-lg font-semibold mb-3 text-center">Scan QR to complete onboarding</h2>

        {!tokenParam && (
          <p className="text-sm text-gray-400 text-center mb-4">
            Point your device camera at the QR sent to your email.
          </p>
        )}

        <div className="bg-gray-900 p-4 rounded border border-gray-800">
          <QrScanner onScan={(data) => { if (data) verifyTokenAndProceed(data); }} />
        </div>

        <div className="mt-6 text-center">
          {verifying && (
            <div className="flex flex-col items-center">
              <LoaderCircle />
              <p className="text-sm text-gray-400 mt-2">Verifying invite...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
