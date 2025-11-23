// ochiga-frontend/src/app/ai-dashboard/components/Panels/ACPanel.tsx
"use client";

import { useState } from "react";

export default function ACPanel() {
  const [power, setPower] = useState<"on" | "off">( "off" );
  const [mode, setMode] = useState<"cool" | "heat" | "fan" | "auto" | null>(null);
  const [temperature, setTemperature] = useState(24);

  const handlePowerToggle = () => {
    if (power === "off") setPower("on");
    else setPower("off");
  };

  const handleModeSelect = (selectedMode: "cool" | "heat" | "fan" | "auto") => {
    setMode(selectedMode);
    if (power === "off") setPower("on");
  };

  return (
    <div className="mt-2 p-3 bg-gray-900 border border-gray-700 rounded-xl text-xs md:text-sm animate-fadeIn transition-all duration-300">
      <p className="mb-2 text-blue-400 font-semibold">❄️ AC Control</p>

      {/* Power Button */}
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={handlePowerToggle}
          className={`px-3 py-1 rounded-full transition ${
            power === "on"
              ? "bg-blue-600 text-white"
              : "bg-gray-700 hover:bg-gray-600 text-gray-300"
          }`}
        >
          {power === "on" ? "On" : "Off"}
        </button>
      </div>

      {/* Mode Selection */}
      <div className="flex items-center gap-2 mb-2">
        {["cool", "heat", "fan", "auto"].map((m) => (
          <button
            key={m}
            onClick={() => handleModeSelect(m as "cool" | "heat" | "fan" | "auto")}
            className={`px-3 py-1 rounded-full transition ${
              mode === m
                ? "bg-blue-600 text-white"
                : "bg-gray-700 hover:bg-gray-600 text-gray-300"
            }`}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      {/* Temperature Slider */}
      {power === "on" && (
        <div className="mt-2 p-2 bg-gray-800 border border-gray-700 rounded-lg transition-all duration-300">
          <input
            type="range"
            min={16}
            max={30}
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
            className="w-full accent-blue-500"
          />
          <p className="text-gray-400 text-[10px] mt-1 text-right">
            {temperature}°C
          </p>
        </div>
      )}
    </div>
  );
}
