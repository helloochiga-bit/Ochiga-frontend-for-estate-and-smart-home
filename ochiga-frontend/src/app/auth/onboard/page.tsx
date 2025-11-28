"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/index";
import { getUser } from "@/lib/auth";

export default function OnboardingPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentUser = getUser();

  const handleComplete = async () => {
    if (!username || !password) {
      setError("All fields required");
      return;
    }
    if (!currentUser?.id) {
      setError("No user info found. Please login again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await authService.completeOnboarding(currentUser.id, username, password);
      // On success, redirect to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Onboarding failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center px-6 overflow-auto">
      <div className="w-full max-w-md bg-[#111] border border-gray-800 rounded-2xl p-8">
        <h2 className="text-white text-xl mb-4">Complete your account</h2>

        {error && <p className="text-red-400 mb-3">{error}</p>}

        <input
          className="w-full mb-3 p-3 rounded bg-black border border-gray-700 text-white"
          placeholder="Choose a username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="w-full mb-3 p-3 rounded bg-black border border-gray-700 text-white"
          placeholder="Choose a password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleComplete}
          className="w-full py-3 rounded-xl bg-[#E30613] text-white font-semibold"
          disabled={loading}
        >
          {loading ? "Processing..." : "Complete setup"}
        </button>
      </div>
    </div>
  );
}
