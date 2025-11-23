"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiZap,
  FiCpu,
  FiUsers,
  FiDollarSign,
  FiCamera,
  FiLock,
  FiHome,
  FiShield,
  FiKey,
  FiActivity,
} from "react-icons/fi";

interface ResidentNotification {
  type: "alert" | "video" | "access" | "message";
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface Suggestion {
  id: string;
  title: string;
  subtitle?: string;
  payload?: string;
}

interface Props {
  onSend: (payload: string) => void;
  isTyping?: boolean;
  assistantActive?: boolean;
  notification?: ResidentNotification | null;
}

/**
 * RESIDENT DynamicSuggestionCard
 * - EXACT estate card UI
 * - Resident suggestion content
 * - Real-time notifications
 * - Hide on scroll / reappear on idle
 * - Light drift auto-scroll effect
 */
export default function ResidentDynamicSuggestionCard({
  onSend,
  isTyping = false,
  notification = null,
  assistantActive = false,
}: Props) {
  const [visible, setVisible] = useState(true);
  const [showNotification, setShowNotification] = useState(false);

  const lastY = useRef<number>(
    typeof window !== "undefined" ? window.scrollY : 0
  );
  const hideTimer = useRef<number | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // 🔹 Slow drifting scroll animation
  const driftTimer = useRef<number | null>(null);

  const startDrift = () => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    let direction = 1;

    driftTimer.current = window.setInterval(() => {
      if (!container) return;

      container.scrollLeft += 0.25 * direction;

      // reverse direction at edges
      if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 2) {
        direction = -1;
      }
      if (container.scrollLeft <= 1) {
        direction = 1;
      }
    }, 18); // slow & smooth
  };

  const stopDrift = () => {
    if (driftTimer.current) window.clearInterval(drftTimer.current);
  };

  useEffect(() => {
    startDrift();
    return stopDrift;
  }, []);

  // --------------------------------------------------
  // 🔹 Resident Suggestions (updated with smart home devices)
  // --------------------------------------------------
  const residentSuggestions = useMemo<Suggestion[]>(
    () => [
      {
        id: "r1",
        title: "Turn On Living Room Lights",
        subtitle: "Smart bulb automation",
        payload: "turn_on_living_room_lights",
      },
      {
        id: "r2",
        title: "Turn Off All Lights",
        subtitle: "Whole apartment lights",
        payload: "turn_off_all_lights",
      },
      {
        id: "r3",
        title: "View Indoor Camera",
        subtitle: "Living room CCTV",
        payload: "view_indoor_cctv",
      },
      {
        id: "r4",
        title: "Check Device Status",
        subtitle: "Active smart devices",
        payload: "check_device_status",
      },
      {
        id: "r5",
        title: "Secure Doors",
        subtitle: "Lock all smart locks",
        payload: "lock_all_doors",
      },
      // 🔹 New smart home suggestions
      {
        id: "r6",
        title: "Check Smart Meter",
        subtitle: "Monitor electricity usage",
        payload: "check_smart_meter",
      },
      {
        id: "r7",
        title: "IR Sensor Panel",
        subtitle: "Configure IR devices",
        payload: "open_ir_sensor_panel",
      },
      {
        id: "r8",
        title: "Sensors & Motion",
        subtitle: "View all smart sensors",
        payload: "view_sensors_panel",
      },
    ],
    []
  );

  const displayList = residentSuggestions;

  // --------------------------------------------------
  // 🔹 Hide on scroll / show on idle
  // --------------------------------------------------
  useEffect(() => {
    const handler = () => {
      const currentY = window.scrollY || 0;
      const delta = currentY - lastY.current;

      if (delta > 14) setVisible(false);
      else if (delta < -14) setVisible(true);

      lastY.current = currentY;

      if (hideTimer.current) window.clearTimeout(hideTimer.current);
      hideTimer.current = window.setTimeout(() => {
        if (!isTyping && !assistantActive) setVisible(true);
      }, 280);
    };

    window.addEventListener("scroll", handler, { passive: true });

    return () => {
      window.removeEventListener("scroll", handler);
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, [isTyping, assistantActive]);

  // --------------------------------------------------
  // 🔹 Notification pop-up (real-time)
  // --------------------------------------------------
  useEffect(() => {
    if (!notification) return;

    setShowNotification(true);
    const t = window.setTimeout(() => setShowNotification(false), 7000);
    return () => clearTimeout(t);
  }, [notification]);

  const handleClick = (s: Suggestion) => {
    onSend(s.payload ?? s.title);
  };

  // --------------------------------------------------
  // 🔹 Icons
  // --------------------------------------------------
  const getIcon = (s: Suggestion) => {
    const key = s.payload?.toLowerCase() ?? "";
    if (key.includes("light")) return <FiZap size={16} className="text-gray-400" />;
    if (key.includes("camera")) return <FiCamera size={16} className="text-gray-400" />;
    if (key.includes("lock") || key.includes("door")) return <FiLock size={16} className="text-gray-400" />;
    if (key.includes("device")) return <FiCpu size={16} className="text-gray-400" />;
    if (key.includes("meter")) return <FiDollarSign size={16} className="text-gray-400" />;
    if (key.includes("ir")) return <FiActivity size={16} className="text-gray-400" />;
    if (key.includes("sensor") || key.includes("motion")) return <FiShield size={16} className="text-gray-400" />;
    return <FiKey size={16} className="text-gray-400" />;
  };

  // --------------------------------------------------
  // 🔹 RENDER COMPONENT
  // --------------------------------------------------

  return (
    <>
      {/* 🔔 REAL-TIME NOTIFICATION PANEL */}
      <AnimatePresence>
        {showNotification && notification && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.28 }}
            style={{
              bottom: `calc(96px + env(safe-area-inset-bottom))`,
              zIndex: 70,
            }}
            className="fixed left-0 w-full flex justify-center px-4 pointer-events-auto"
          >
            <div className="max-w-3xl w-full bg-gray-900 text-gray-100 rounded-2xl p-4 shadow border border-gray-700 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="font-semibold text-sm">{notification.title}</div>
                  {notification.description && (
                    <div className="text-xs text-gray-400 mt-1">
                      {notification.description}
                    </div>
                  )}
                </div>

                {notification.actionLabel && (
                  <button
                    onClick={notification.onAction}
                    className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs hover:bg-blue-700 transition"
                  >
                    {notification.actionLabel}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ⭐ RESIDENT SUGGESTIONS ROW */}
      <AnimatePresence>
        {visible && !isTyping && displayList.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.28 }}
            style={{
              bottom: `calc(84px + env(safe-area-inset-bottom))`,
              zIndex: 60,
            }}
            className="fixed left-0 right-0 px-4 pointer-events-none"
          >
            <div
              ref={scrollRef}
              className="w-full pointer-events-auto flex overflow-x-auto gap-3 hide-scrollbar"
              style={{
                scrollSnapType: "x mandatory",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {displayList.map((s) => (
                <motion.button
                  key={s.id}
                  onClick={() => handleClick(s)}
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-none min-w-[220px] bg-gray-800 text-gray-100 rounded-2xl shadow border border-gray-700 p-3 text-left flex items-start gap-2 transition scroll-snap-align-start hover:bg-gray-750"
                  style={{
                    opacity: assistantActive ? 0.55 : 1,
                  }}
                >
                  {getIcon(s)}
                  <div className="flex flex-col">
                    <div className="font-medium text-sm leading-tight">{s.title}</div>
                    {s.subtitle && (
                      <div className="text-xs text-gray-400 mt-0.5">{s.subtitle}</div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
