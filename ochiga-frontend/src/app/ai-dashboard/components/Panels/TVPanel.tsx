// ochiga-frontend/src/app/ai-dashboard/components/Panels/TVPanel.tsx
"use client";

import { useState } from "react";

export default function TVPanel() {
  const [power, setPower] = useState<"on" | "off">("off");
  const [volume, setVolume] = useState(20);
  const [channel, setChannel] = useState(1);
  const [input, setInput] = useState<"HDMI1" | "HDMI2" | "AV" | "TV">("TV");

  const handlePowerToggle = () => {
    setPower(power === "off" ? "on" : "off");
  };

  const changeChannel = (delta: number) => {
    setChannel((prev) => Math.max(1, prev + delta));
  };

  return (
    <div className="mt-2 p-3 bg-gray-900 border border-gray-700 rounded-xl text-xs md:text-sm animate-fadeIn transition-all duration-300">
      <p className="mb-2 text-yellow-400 font-semibold">📺 TV Control</p>

      {/* Power Button */}
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={handlePowerToggle}
          className={`px-3 py-1 rounded-full transition ${
            power === "on"
              ? "bg-yellow-600 text-white"
              : "bg-gray-700 hover:bg-gray-600 text-gray-300"
          }`}
        >
          {power === "on" ? "On" : "Off"}
        </button>
      </div>

      {/* Channel Control */}
      {power === "on" && (
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => changeChannel(-1)}
            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition"
          >
            ←
          </button>
          <span className="text-white text-sm">Channel {channel}</span>
          <button
            onClick={() => changeChannel(1)}
            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition"
          >
            →
          </button>
        </div>
      )}

      {/* Volume Slider */}
      {power === "on" && (
        <div className="mt-2 p-2 bg-gray-800 border border-gray-700 rounded-lg transition-all duration-300 mb-2">
          <label className="text-gray-400 text-[10px] mb-1 block">Volume</label>
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full accent-yellow-500"
          />
          <p className="text-gray-400 text-[10px] mt-1 text-right">{volume}%</p>
        </div>
      )}

      {/* Input Source */}
      {power === "on" && (
        <div className="flex items-center gap-2">
          {["TV", "HDMI1", "HDMI2", "AV"].map((src) => (
            <button
              key={src}
              onClick={() => setInput(src as "TV" | "HDMI1" | "HDMI2" | "AV")}
              className={`px-2 py-1 rounded-full text-[10px] transition ${
                input === src
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-700 hover:bg-gray-600 text-gray-300"
              }`}
            >
              {src}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
