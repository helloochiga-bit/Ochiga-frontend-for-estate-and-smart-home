// ochiga-frontend/src/app/ai-dashboard/components/Panels/SmartMeterPanel.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Meter {
  id: number;
  name: string;
  meterNumber: string;
  balance: number;
  lastToken?: string;
  lastTopup?: string;
}

export default function SmartMeterPanel() {
  const [meters, setMeters] = useState<Meter[]>([]);
  const [selectedMeter, setSelectedMeter] = useState<Meter | null>(null);
  const [tokenAmount, setTokenAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchMeters = async () => {
    const { data, error } = await supabase.from("smart_meters").select("*");
    if (error) console.error(error);
    else setMeters(data as Meter[]);
  };

  useEffect(() => {
    fetchMeters();
  }, []);

  const handleSelectMeter = (meter: Meter) => setSelectedMeter(meter);

  const handleBuyToken = async () => {
    if (!selectedMeter || !tokenAmount) return;
    setLoading(true);

    // For demo: generate a fake token
    const newToken = Math.floor(Math.random() * 1000000000).toString();

    // Update meter in Supabase
    const { error } = await supabase
      .from("smart_meters")
      .update({
        balance: (selectedMeter.balance || 0) + parseFloat(tokenAmount),
        lastToken: newToken,
        lastTopup: new Date().toISOString(),
      })
      .eq("id", selectedMeter.id);

    if (error) console.error(error);
    else {
      // Update local state
      setMeters((prev) =>
        prev.map((m) =>
          m.id === selectedMeter.id
            ? {
                ...m,
                balance: m.balance + parseFloat(tokenAmount),
                lastToken: newToken,
                lastTopup: new Date().toISOString(),
              }
            : m
        )
      );
      setTokenAmount("");
      alert(`Token ${newToken} loaded successfully!`);
    }

    setLoading(false);
  };

  return (
    <div className="mt-2 p-3 bg-gray-900 border border-gray-700 rounded-xl text-xs md:text-sm animate-fadeIn">
      <p className="mb-2 text-yellow-400 font-semibold">⚡ Smart Electricity Meter</p>

      <div className="flex flex-col md:flex-row gap-2 mb-3">
        {meters.map((meter) => (
          <button
            key={meter.id}
            onClick={() => handleSelectMeter(meter)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
              selectedMeter?.id === meter.id
                ? "bg-yellow-600 text-white"
                : "bg-gray-800 hover:bg-gray-700 text-gray-200"
            }`}
          >
            {meter.name} ({meter.meterNumber})
          </button>
        ))}
      </div>

      {selectedMeter && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
          <p className="text-gray-200 mb-1">
            Balance: <span className="text-green-400">₦ {selectedMeter.balance}</span>
          </p>
          <p className="text-gray-400 text-[11px] mb-2">
            Last Token: {selectedMeter.lastToken || "N/A"} <br />
            Last Top-up: {selectedMeter.lastTopup || "N/A"}
          </p>

          <input
            type="number"
            placeholder="Enter token amount"
            value={tokenAmount}
            onChange={(e) => setTokenAmount(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-md px-2 py-1 mb-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-yellow-400"
          />
          <button
            onClick={handleBuyToken}
            disabled={loading}
            className="w-full bg-yellow-600 hover:bg-yellow-700 rounded-md py-1 text-white text-xs font-semibold"
          >
            {loading ? "Processing..." : "Buy & Load Token"}
          </button>
        </div>
      )}
    </div>
  );
}
