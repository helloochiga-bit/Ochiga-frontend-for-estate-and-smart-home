"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { AiOutlineArrowLeft } from "react-icons/ai";

export default function ResidentActivationPage() {
  const router = useRouter();
  const params = useSearchParams();

  // ✅ Use optional chaining to prevent TypeScript error
  const token = params?.get("token") ?? null;

  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // 🔍 Validate token when page loads
  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      return;
    }

    const validateToken = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/auth/onboard/validate/${token}`);
        if (!res.ok) {
          setTokenValid(false);
          return;
        }

        setTokenValid(true);
      } catch {
        setTokenValid(false);
      }
    };

    validateToken();
  }, [token, BACKEND_URL]);

  // 🔥 Activate Resident Account
  const handleActivation = async () => {
    if (!username.trim()) return setError("Username is required");
    if (password.length < 6) return setError("Password must be at least 6 characters");
    if (password !== confirmPass) return setError("Passwords do not match");

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${BACKEND_URL}/auth/onboard/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Activation failed");

      // Store JWT
      localStorage.setItem("ochiga_token", data.token);

      router.push("/ai-dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen fixed top-0 left-0 bg-black flex items-center justify-center overflow-hidden relative">
      
      {/* Back Button */}
      <button
        onClick={() => router.push("/auth")}
        className="absolute top-4 left-4 text-gray-400 hover:text-white transition z-10"
      >
        <AiOutlineArrowLeft size={26} />
      </button>

      {/* Invalid Token */}
      {tokenValid === false && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-center text-red-400 text-lg"
        >
          Invalid or expired activation link.
        </motion.div>
      )}

      {/* Token validation animation */}
      {tokenValid === null && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-gray-400 text-lg"
        >
          Validating activation link...
        </motion.div>
      )}

      {/* Form */}
      {tokenValid === true && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-[92%] max-w-md bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-xl flex flex-col justify-center overflow-hidden"
          style={{ maxHeight: "85vh" }}
        >

          <div className="text-center mb-4">
            <h1 className="text-4xl font-bold text-white">OYI</h1>
            <p className="text-gray-400 text-sm">Activate Your Home Profile</p>
          </div>

          {error && <p className="text-red-400 text-sm text-center mb-2">{error}</p>}

          <input
            type="text"
            placeholder="Choose a Username"
            className="w-full p-3 mb-3 rounded-lg bg-black border border-gray-700 text-white placeholder-gray-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="New Password"
            className="w-full p-3 mb-3 rounded-lg bg-black border border-gray-700 text-white placeholder-gray-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-3 mb-4 rounded-lg bg-black border border-gray-700 text-white placeholder-gray-500"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
          />

          <button
            onClick={handleActivation}
            disabled={loading}
            className="w-full p-3 bg-red-600 rounded-lg text-white font-semibold hover:bg-red-700 transition"
          >
            {loading ? "Activating..." : "Activate Home"}
          </button>

          <p className="text-gray-600 text-xs text-center mt-4 opacity-80">
            This activation link can only be used once.
          </p>
        </motion.div>
      )}
    </div>
  );
}
