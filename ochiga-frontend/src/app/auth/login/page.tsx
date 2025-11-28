"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IoChevronBack } from "react-icons/io5";
import { FaGoogle, FaApple } from "react-icons/fa";
import { authService } from "@/services/index";

export default function LoginPage() {
  const router = useRouter();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!usernameOrEmail || !password) {
      setError("All fields required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { user } = await authService.login(usernameOrEmail, password);

      if (!user) throw new Error("Login failed: no user returned");

      // if onboarding not complete, send to onboarding
      if (!user.onboarding_complete) {
        router.push("/auth/onboarding");
        return;
      }

      // route by role
      if (user.role === "estate" || user.role === "manager") {
        router.push("/manager-dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center px-6 overflow-hidden">

      {/* Back Button */}
      <button
        onClick={() => router.push("/auth")}
        className="absolute top-6 left-6 p-2 rounded-full border border-gray-800 hover:border-gray-700 transition"
      >
        <IoChevronBack className="text-gray-300" size={20} />
      </button>

      {/* LOGIN CARD */}
      <div
        className="
          w-[90%] max-w-sm sm:max-w-md
          bg-[#111] border border-gray-800 
          rounded-2xl px-6 sm:px-8 py-8 sm:py-10 
          shadow-xl animate-fadeIn
        "
      >
        <h1 className="text-2xl text-center text-white font-semibold mb-6">
          Login to Your Account
        </h1>

        {error && <p className="text-red-400 text-center mb-3">{error}</p>}

        {/* Username or Email */}
        <input
          type="text"
          placeholder="Username or Email"
          className="w-full p-3 mb-3 rounded-lg bg-black border border-gray-700
                     text-white placeholder-gray-500"
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 rounded-lg bg-black border border-gray-700
                     text-white placeholder-gray-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 rounded-xl font-semibold
                     bg-[#E30613] text-white
                     hover:bg-[#F52733] transition"
        >
          {loading ? "Processing..." : "Login"}
        </button>

        <div className="my-5 text-gray-400 flex items-center gap-4">
          <div className="flex-1 h-[1px] bg-gray-800" />
          <span>OR</span>
          <div className="flex-1 h-[1px] bg-gray-800" />
        </div>

        {/* Apple */}
        <button
          className="
            w-full py-3 mb-3 rounded-xl 
            bg-gray-800 hover:bg-gray-700 
            text-white font-medium flex items-center justify-center gap-2
          "
        >
          <FaApple className="text-white" /> Continue with Apple
        </button>

        {/* Google */}
        <button
          className="
            w-full py-3 rounded-xl 
            bg-gray-800 hover:bg-gray-700 
            text-white font-medium flex items-center justify-center gap-2
          "
        >
          <FaGoogle className="text-white" /> Continue with Google
        </button>
      </div>
    </div>
  );
}
