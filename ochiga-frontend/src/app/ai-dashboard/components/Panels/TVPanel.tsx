// ochiga-frontend/src/app/ai-dashboard/components/Panels/TVPanel.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface TVUnit {
  id: number;
  name: string;
  status: "on" | "off";
  channel: number;
  volume: number;
  input: "HDMI1" | "HDMI2" | "AV" | "TV";
}

export default function TVPanel() {
  const [tvUnits, setTvUnits] = useState<TVUnit[]>([]);

  const fetchTVUnits = async () => {
    const { data, error } = await supabase.from("tv_units").select("*");
    if (error) console.error(error);
    else setTvUnits(data as TVUnit[]);
  };

  useEffect(() => {
    fetchTVUnits();

    // Optional: Realtime updates
    const subscription = supabase
      .channel("public:tv_units")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tv_units" },
        () => fetchTVUnits()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const togglePower = async (unit: TVUnit) => {
    const newStatus = unit.status === "on" ? "off" : "on";
    await supabase.from("tv_units").update({ status: newStatus }).eq("id", unit.id);
    setTvUnits((prev) =>
      prev.map((u) => (u.id === unit.id ? { ...u, status: newStatus } : u))
    );
  };

  const changeChannel = async (unit: TVUnit, channel: number) => {
    await supabase.from("tv_units").update({ channel }).eq("id", unit.id);
    setTvUnits((prev) =>
      prev.map((u) => (u.id === unit.id ? { ...u, channel } : u))
    );
  };

  const changeVolume = async (unit: TVUnit, volume: number) => {
    await supabase.from("tv_units").update({ volume }).eq("id", unit.id);
    setTvUnits((prev) =>
      prev.map((u) => (u.id === unit.id ? { ...u, volume } : u))
    );
  };

  const changeInput = async (unit: TVUnit, input: TVUnit["input"]) => {
    await supabase.from("tv_units").update({ input }).eq("id", unit.id);
    setTvUnits((prev) =>
      prev.map((u) => (u.id === unit.id ? { ...u, input } : u))
    );
  };

  return (
    <div className="mt-2 p-3 bg-gray-900 border border-gray-700 rounded-xl text-xs md:text-sm animate-fadeIn">
      <p className="mb-2 text-yellow-400 font-semibold">📺 TV Control</p>

      <div className="flex flex-col gap-2">
        {tvUnits.map((unit) => (
          <div
            key={unit.id}
            className="bg-gray-800 border border-gray-700 rounded-lg p-2 flex flex-col md:flex-row items-center justify-between gap-2"
          >
            <div>
              <p className="text-white font-medium">{unit.name}</p>
              <p className="text-gray-400 text-[11px]">
                Status: {unit.status.toUpperCase()} | Channel: {unit.channel} | Volume: {unit.volume} | Input: {unit.input}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => togglePower(unit)}
                className={`px-3 py-1 rounded-md text-xs font-semibold ${
                  unit.status === "on"
                    ? "bg-yellow-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {unit.status === "on" ? "Turn Off" : "Turn On"}
              </button>

              <input
                type="number"
                min={1}
                max={999}
                value={unit.channel}
                onChange={(e) => changeChannel(unit, Number(e.target.value))}
                className="w-16 px-2 py-1 rounded-md text-xs text-white bg-gray-700 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-yellow-500"
              />

              <input
                type="range"
                min={0}
                max={100}
                value={unit.volume}
                onChange={(e) => changeVolume(unit, Number(e.target.value))}
                className="accent-yellow-400"
              />

              <select
                value={unit.input}
                onChange={(e) => changeInput(unit, e.target.value as TVUnit["input"])}
                className="text-xs text-white bg-gray-700 border border-gray-600 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-yellow-500"
              >
                <option value="HDMI1">HDMI1</option>
                <option value="HDMI2">HDMI2</option>
                <option value="AV">AV</option>
                <option value="TV">TV</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
