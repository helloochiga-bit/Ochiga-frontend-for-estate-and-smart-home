// ochiga-frontend/src/app/ai-dashboard/components/Panels/ACPanel.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface ACUnit {
  id: number;
  name: string;
  status: "on" | "off";
  temperature: number;
  mode: "cool" | "heat" | "fan" | "auto";
}

export default function ACPanel() {
  const [acUnits, setAcUnits] = useState<ACUnit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<ACUnit | null>(null);

  const fetchACUnits = async () => {
    const { data, error } = await supabase.from("ac_units").select("*");
    if (error) console.error(error);
    else setAcUnits(data as ACUnit[]);
  };

  useEffect(() => {
    fetchACUnits();

    // Optional: Real-time subscription for live updates
    const subscription = supabase
      .channel("public:ac_units")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ac_units" },
        (payload) => {
          fetchACUnits(); // Refresh when any AC unit changes
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const toggleAC = async (unit: ACUnit) => {
    const newStatus = unit.status === "on" ? "off" : "on";
    await supabase.from("ac_units").update({ status: newStatus }).eq("id", unit.id);
    setAcUnits((prev) =>
      prev.map((u) => (u.id === unit.id ? { ...u, status: newStatus } : u))
    );
  };

  const changeTemperature = async (unit: ACUnit, temp: number) => {
    await supabase.from("ac_units").update({ temperature: temp }).eq("id", unit.id);
    setAcUnits((prev) =>
      prev.map((u) => (u.id === unit.id ? { ...u, temperature: temp } : u))
    );
  };

  const changeMode = async (unit: ACUnit, mode: ACUnit["mode"]) => {
    await supabase.from("ac_units").update({ mode }).eq("id", unit.id);
    setAcUnits((prev) => prev.map((u) => (u.id === unit.id ? { ...u, mode } : u)));
  };

  return (
    <div className="mt-2 p-3 bg-gray-900 border border-gray-700 rounded-xl text-xs md:text-sm animate-fadeIn">
      <p className="mb-2 text-blue-400 font-semibold">❄️ AC Control</p>

      <div className="flex flex-col gap-2">
        {acUnits.map((unit) => (
          <div
            key={unit.id}
            className="bg-gray-800 border border-gray-700 rounded-lg p-2 flex flex-col md:flex-row items-center justify-between gap-2"
          >
            <div>
              <p className="text-white font-medium">{unit.name}</p>
              <p className="text-gray-400 text-[11px]">
                Status: {unit.status.toUpperCase()} | Mode: {unit.mode.toUpperCase()} | Temp: {unit.temperature}°C
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleAC(unit)}
                className={`px-3 py-1 rounded-md text-xs font-semibold ${
                  unit.status === "on"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {unit.status === "on" ? "Turn Off" : "Turn On"}
              </button>

              <input
                type="number"
                value={unit.temperature}
                min={16}
                max={30}
                onChange={(e) => changeTemperature(unit, Number(e.target.value))}
                className="w-16 px-2 py-1 rounded-md text-xs text-white bg-gray-700 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />

              <select
                value={unit.mode}
                onChange={(e) => changeMode(unit, e.target.value as ACUnit["mode"])}
                className="text-xs text-white bg-gray-700 border border-gray-600 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="cool">Cool</option>
                <option value="heat">Heat</option>
                <option value="fan">Fan</option>
                <option value="auto">Auto</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
