"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Sensor {
  id: number;
  name: string;
  type: string;
  value: number;
  unit: string;
  status: "normal" | "alert";
}

export default function SensorPanel() {
  const [sensors, setSensors] = useState<Sensor[]>([]);

  const fetchSensors = async () => {
    const { data, error } = await supabase.from("sensors").select("*");
    if (error) console.error(error);
    else setSensors(data as Sensor[]);
  };

  useEffect(() => {
    // Wrap async logic in nested function
    const init = async () => {
      await fetchSensors();
    };
    init();

    // Subscribe to Supabase changes
    const subscription = supabase
      .channel("public:sensors")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sensors" },
        () => fetchSensors()
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <div className="mt-2 p-3 bg-gray-900 border border-gray-700 rounded-xl text-xs md:text-sm animate-fadeIn">
      <p className="mb-2 text-orange-400 font-semibold">🛡️ Sensors</p>

      <div className="flex flex-col gap-2">
        {sensors.map((sensor) => (
          <div
            key={sensor.id}
            className={`bg-gray-800 border ${
              sensor.status === "alert" ? "border-red-500" : "border-gray-700"
            } rounded-lg p-2 flex justify-between items-center`}
          >
            <div>
              <p className="text-white font-medium">{sensor.name}</p>
              <p className="text-gray-400 text-[11px]">
                Type: {sensor.type} | Value: {sensor.value} {sensor.unit}
              </p>
            </div>
            <span
              className={`px-2 py-1 rounded-md text-xs font-semibold ${
                sensor.status === "alert" ? "bg-red-600 text-white" : "bg-green-600 text-white"
              }`}
            >
              {sensor.status.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
