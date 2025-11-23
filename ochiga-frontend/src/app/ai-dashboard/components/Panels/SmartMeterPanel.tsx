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
  balance: number; // kWh remaining
  history: { id: number; amount: number; date: string }[];
}

export default function SmartMeterPanel() {
  const [meters, setMeters] = useState<Meter[]>([]);
  const [selectedMeter, setSelectedMeter] = useState<number | null>(null);
  const [amount, setAmount] = useState("");

  const fetchMeters = async () => {
    const { data, error } = await supabase.from("smart_meters").select("*");
    if (error) console.error(error);
    else setMeters(data as Meter[]);
  };

  useEffect(() => {
    fetchMeters();
    const subscription = supabase
      .channel("public:smart_meters")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "smart_meters" },
        () => fetchMeters()
      )
      .subscribe();
    return () => supabase.removeChannel(subscription);
  }, []);

  const loadToken = async (meter: Meter) => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;

    // Update balance
    await supabase.from("smart_meters").update({ balance: meter.balance + amt }).eq("id", meter.id);

    // Add history record
    await supabase.from("meter_history").insert({ meter_id: meter.id, amount: amt, date: new Date().toISOString() });

    setAmount("");
    fetchMeters();
  };

  return (
    <div className="mt-2 p-3 bg-gray-900 border border-gray-700 rounded-xl text-xs md:text-sm animate-fadeIn">
      <p className="mb-2 text-green-400 font-semibold">⚡ Smart Meter</p>

      <div className="flex flex-col gap-2">
        {meters.map((meter) => (
          <div
            key={meter.id}
            onClick={() => setSelectedMeter(meter.id)}
            className={`bg-gray-800 border border-gray-700 rounded-lg p-2 cursor-pointer ${
              selectedMeter === meter.id ? "border-green-400" : ""
            }`}
          >
            <p className="text-white font-medium">{meter.name}</p>
            <p className="text-gray-400 text-[11px]">Balance: {meter.balance.toFixed(2)} kWh</p>

            {selectedMeter === meter.id && (
              <div className="mt-2 flex flex-col gap-2">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter kWh to load"
                  className="w-full bg-gray-900 border border-gray-700 rounded-md px-2 py-1 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-400"
                />
                <button
                  onClick={() => loadToken(meter)}
                  className="w-full bg-green-600 hover:bg-green-700 rounded-md py-1 text-xs font-medium text-white"
                >
                  Load Token
                </button>

                {/* History */}
                <div className="mt-2 max-h-40 overflow-y-auto bg-gray-800 border border-gray-700 rounded-md p-2 text-[11px]">
                  <p className="font-semibold text-white mb-1">History:</p>
                  {meter.history?.length ? (
                    meter.history.map((h) => (
                      <div key={h.id} className="flex justify-between border-b border-gray-700 py-1 last:border-none">
                        <span>₦ {h.amount.toLocaleString()}</span>
                        <span className="text-gray-400">{new Date(h.date).toLocaleDateString()}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-[10px]">No transactions yet</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
