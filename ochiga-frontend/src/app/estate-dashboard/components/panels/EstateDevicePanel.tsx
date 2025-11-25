"use client";

import { useEffect, useState, useCallback } from "react";
import { FaPlug, FaWrench, FaToggleOn } from "react-icons/fa";
import toast from "react-hot-toast";
import { deviceService } from "@/services/deviceService";

type Device = {
  id: string;
  name: string;
  type?: string;
  status?: "online" | "offline" | "connected";
  lastSeen?: string;
  location?: string;
};

export default function EstateDevicePanel({
  estateId = "current-estate",
  devices: initial = [],
  onAction
}: {
  estateId?: string;
  devices?: Device[];
  onAction?: (id: string, action: string) => void;
}) {
  const [devices, setDevices] = useState<Device[]>(Array.isArray(initial) ? initial : []);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");

  const maroon = "#8A0C0C";
  const darkBlue = "#0A0F1F";
  const cardBlue = "#111726";
  const borderBlue = "#1E2638";

  const loadEstateDevices = useCallback(async () => {
    if (!estateId) return toast.error("Estate ID is missing");
    setLoading(true);
    try {
      const res = await deviceService.getDevices(estateId);
      const loaded = Array.isArray(res?.devices) ? res.devices : res || [];
      setDevices(
        loaded.map(d => ({
          ...d,
          id: d.id || Math.random().toString(36).substring(2, 9),
        }))
      );
    } catch (err: any) {
      console.warn(err);
      toast.error("Failed to load estate devices");
    } finally {
      setLoading(false);
    }
  }, [estateId]);

  useEffect(() => {
    loadEstateDevices();
  }, [loadEstateDevices]);

  const scanDevices = async () => { /* remains unchanged */ };
  const toggle = async (id: string) => { /* remains unchanged */ };

  const filtered = Array.isArray(devices)
    ? filter
      ? devices.filter(d =>
          (d.name + d.type + d.location).toLowerCase().includes(filter.toLowerCase())
        )
      : devices
    : [];

  return (
    <div className="p-4 rounded-lg shadow-sm w-full" style={{ backgroundColor: darkBlue, border: `1px solid ${borderBlue}` }}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <FaPlug color={maroon} className="text-sm" />
        <h3 className="text-sm font-semibold text-white">Estate Devices</h3>
      </div>

      {/* Search Box */}
      <input
        placeholder="Search devices..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
        className="w-full px-3 py-2 mb-3 rounded text-sm text-white bg-[#131A2B] border"
        style={{ borderColor: borderBlue }}
      />

      {/* Scan Button */}
      <button
        onClick={scanDevices}
        className="w-full py-2 rounded-lg text-white text-sm font-medium mb-4"
        style={{ backgroundColor: maroon }}
        disabled={loading}
      >
        {loading ? "Scanning..." : "Scan for New Devices"}
      </button>

      {/* Device List */}
      <div className="flex flex-col gap-2 max-h-72 overflow-auto pr-1">
        {filtered.length === 0 && !loading ? (
          <div className="text-gray-300 text-sm">No devices found</div>
        ) : (
          filtered.map(d => (
            <div key={d.id} className="p-3 rounded-lg cursor-pointer transition" style={{ backgroundColor: cardBlue, border: `1px solid ${borderBlue}` }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-white">{d.name}</div>
                  <div className="text-xs text-gray-400">{d.type} • {d.location}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="text-gray-300 text-sm" onClick={() => onAction?.(d.id, "open")}>
                    <FaWrench />
                  </button>

                  <button
                    className="px-2 py-1 rounded text-white text-xs"
                    style={{ backgroundColor: d.status === "online" ? "green" : "gray" }}
                    onClick={() => toggle(d.id)}
                  >
                    <FaToggleOn />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2 text-xs">
                <div className="text-gray-400">{d.status === "online" ? "Active now" : "Offline"}</div>
                <div className={d.status === "online" ? "text-green-400" : "text-red-400"}>{d.status}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
