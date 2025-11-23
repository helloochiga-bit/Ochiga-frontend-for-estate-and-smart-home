// ochiga-frontend/src/app/ai-dashboard/components/Panels/// ochiga-frontend/src/app/ai-dashboard/components/Panels/SensorPanel.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { FaTv, FaFan, FaLightbulb, FaExclamationTriangle } from "react-icons/fa";

// 👉 Supabase setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type SensorType = "IR" | "Motion" | "Air" | "Generic";

interface Sensor {
  id: number;
  type: SensorType;
  name: string;
  status: "active" | "inactive" | "alert";
  linkedDevice?: string;
  reading?: string;
}

export default function SensorPanel() {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch sensors from Supabase
  const fetchSensors = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("sensors").select("*");
    if (error) {
      console.error("Error fetching sensors:", error);
      setLoading(false);
      return;
    }
    setSensors(data as Sensor[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchSensors();

    // Optional: Subscribe to real-time updates if supported
    const subscription = supabase
      .from("sensors")
      .on("UPDATE", (payload) => {
        setSensors((prev) =>
          prev.map((s) => (s.id === payload.new.id ? payload.new : s))
        );
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, []);

  const getIcon = (sensor: Sensor) => {
    switch (sensor.type) {
      case "IR":
        return <FaTv />;
      case "Motion":
        return <FaFan />;
      case "Air":
        return <FaLightbulb />;
      default:
        return <FaExclamationTriangle />;
    }
  };

  const handleControlDevice = (sensor: Sensor) => {
    if (!sensor.linkedDevice) return;
    alert(`Controlling device: ${sensor.linkedDevice} via ${sensor.name}`);
    // Here you can integrate actual device control APIs
  };

  if (loading) return <p className="text-gray-400 text-sm">Loading sensors...</p>;

  return (
    <div className="mt-2 p-3 bg-gray-900 border border-gray-700 rounded-xl text-xs md:text-sm animate-fadeIn">
      <p className="mb-2 text-green-400 font-semibold">🛠 Sensors</p>

      {sensors.length === 0 && (
        <p className="text-gray-400 text-[11px]">No sensors connected yet.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {sensors.map((sensor) => (
          <div
            key={sensor.id}
            className={`p-3 rounded-lg border border-gray-700 flex items-center justify-between transition ${
              sensor.status === "alert" ? "bg-red-700/30" : "bg-gray-800"
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="text-xl">{getIcon(sensor)}</div>
              <div>
                <p className="text-white font-semibold">{sensor.name}</p>
                <p className="text-gray-400 text-[10px]">
                  {sensor.reading || sensor.status.toUpperCase()}
                </p>
              </div>
            </div>
            {sensor.linkedDevice && (
              <button
                className="px-2 py-1 bg-green-600 text-white rounded text-[10px]"
                onClick={() => handleControlDevice(sensor)}
              >
                Control {sensor.linkedDevice}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { FaTv, FaFan, FaLightbulb, FaExclamationTriangle } from "react-icons/fa";

// 👉 Supabase setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type SensorType = "IR" | "Motion" | "Air" | "Generic";

interface Sensor {
  id: number;
  type: SensorType;
  name: string;
  status: "active" | "inactive" | "alert";
  linkedDevice?: string;
  reading?: string;
}

export default function SensorPanel() {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch sensors from Supabase
  const fetchSensors = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("sensors").select("*");
    if (error) {
      console.error("Error fetching sensors:", error);
      setLoading(false);
      return;
    }
    setSensors(data as Sensor[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchSensors();

    // Optional: Subscribe to real-time updates if supported
    const subscription = supabase
      .from("sensors")
      .on("UPDATE", (payload) => {
        setSensors((prev) =>
          prev.map((s) => (s.id === payload.new.id ? payload.new : s))
        );
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, []);

  const getIcon = (sensor: Sensor) => {
    switch (sensor.type) {
      case "IR":
        return <FaTv />;
      case "Motion":
        return <FaFan />;
      case "Air":
        return <FaLightbulb />;
      default:
        return <FaExclamationTriangle />;
    }
  };

  const handleControlDevice = (sensor: Sensor) => {
    if (!sensor.linkedDevice) return;
    alert(`Controlling device: ${sensor.linkedDevice} via ${sensor.name}`);
    // Here you can integrate actual device control APIs
  };

  if (loading) return <p className="text-gray-400 text-sm">Loading sensors...</p>;

  return (
    <div className="mt-2 p-3 bg-gray-900 border border-gray-700 rounded-xl text-xs md:text-sm animate-fadeIn">
      <p className="mb-2 text-green-400 font-semibold">🛠 Sensors</p>

      {sensors.length === 0 && (
        <p className="text-gray-400 text-[11px]">No sensors connected yet.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {sensors.map((sensor) => (
          <div
            key={sensor.id}
            className={`p-3 rounded-lg border border-gray-700 flex items-center justify-between transition ${
              sensor.status === "alert" ? "bg-red-700/30" : "bg-gray-800"
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="text-xl">{getIcon(sensor)}</div>
              <div>
                <p className="text-white font-semibold">{sensor.name}</p>
                <p className="text-gray-400 text-[10px]">
                  {sensor.reading || sensor.status.toUpperCase()}
                </p>
              </div>
            </div>
            {sensor.linkedDevice && (
              <button
                className="px-2 py-1 bg-green-600 text-white rounded text-[10px]"
                onClick={() => handleControlDevice(sensor)}
              >
                Control {sensor.linkedDevice}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
