"use client";"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoaderCircle from "../components/ui/LoaderCircle";

function ResidentCompleteTokenHandler() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params?.get("token") ?? null;
  const [verifying, setVerifying] = useState(false);

  const verifyToken = async (token: string | null) => {
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

    setTimeout(() => router.push("/dashboard"), 700);
  };

  useEffect(() => {
    if (token) verifyToken(token);
  }, [token]);

  return verifying ? <LoaderCircle /> : null;
}

export default function ResidentCompletePage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-xl p-4">
        <h2 className="text-lg font-semibold mb-3 text-center">
          Completing Onboarding
        </h2>
        <Suspense fallback={<LoaderCircle />}>
          <ResidentCompleteTokenHandler />
        </Suspense>
      </div>
    </div>
  );
}
