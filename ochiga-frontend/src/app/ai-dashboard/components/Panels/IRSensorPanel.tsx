// ochiga-frontend/src/app/ai-dashboard/components/Panels/IRSensorPanel.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface IRDevice {
  id: number;
  name: string;
  type: string;
  status: "on" | "off";
}

export default function IRSensorPanel() {
  const [devices, setDevices] = useState<IRDevice[]>([]);

  const fetchDevices = async () => {
    const { data, error } = await supabase.from("ir_devices").select("*");
    if (error) console.error(error);
    else setDevices(data as IRDevice[]);
  };

  useEffect(() => {
    fetchDevices();
    const subscription = supabase
      .channel("public:ir_devices")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ir_devices" },
        () => fetchDevices()
      )
      .subscribe();
    return () => supabase.removeChannel(subscription);
  }, []);

  const toggleDevice = async (device: IRDevice) => {
    const newStatus = device.status === "on" ? "off" : "on";
    await supabase.from("ir_devices").update({ status: newStatus }).eq("id", device.id);
    setDevices((prev) => prev.map((d) => (d.id === device.id ? { ...d, status: newStatus } : d)));
  };

  return (
    <div className="mt-2 p-3 bg-gray-900 border border-gray-700 rounded-xl text-xs md:text-sm animate-fadeIn">
      <p className="mb-2 text-pink-400 font-semibold">📡 IR Sensor Devices</p>

      <div className="flex flex-col gap-2">
        {devices.map((device) => (
          <div
            key={device.id}
            className="bg-gray-800 border border-gray-700 rounded-lg p-2 flex justify-between items-center"
          >
            <div>
              <p className="text-white font-medium">{device.name}</p>
              <p className="text-gray-400 text-[11px]">Type: {device.type}</p>
            </div>
            <button
              onClick={() => toggleDevice(device)}
              className={`px-3 py-1 rounded-md text-xs font-semibold ${
                device.status === "on"
                  ? "bg-pink-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {device.status === "on" ? "Turn Off" : "Turn On"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
