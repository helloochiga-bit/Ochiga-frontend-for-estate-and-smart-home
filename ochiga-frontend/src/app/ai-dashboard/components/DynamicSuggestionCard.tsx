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
  FiShield,
  FiKey,
  FiActivity,
} from "react-icons/fi";

interface Suggestion {
  id: string;
  title: string;
  subtitle?: string;
  payload?: string;
}

interface ResidentNotification {
  type: "alert" | "video" | "access" | "message";
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface Props {
  suggestions?: Suggestion[]; // ✅ add suggestions array
  onSend: (text?: string, spoken?: boolean) => Promise<void>; // ✅ match page.tsx handleSend
  isTyping?: boolean;
  assistantActive?: boolean;
  notification?: ResidentNotification | null;
}

export default function DynamicSuggestionCard({
  suggestions,
  onSend,
  isTyping = false,
  assistantActive = false,
  notification = null,
}: Props) {
  const [visible, setVisible] = useState(true);
  const [showNotification, setShowNotification] = useState(false);

  const lastY = useRef<number>(typeof window !== "undefined" ? window.scrollY : 0);
  const hideTimer = useRef<number | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const driftTimer = useRef<number | null>(null);

  // -----------------------------
  // Drift scrolling animation
  // -----------------------------
  const startDrift = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    let direction = 1;
    driftTimer.current = window.setInterval(() => {
      if (!container) return;
      container.scrollLeft += 0.25 * direction;
      if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 2) direction = -1;
      if (container.scrollLeft <= 1) direction = 1;
    }, 18);
  };
  const stopDrift = () => {
    if (driftTimer.current) window.clearInterval(driftTimer.current);
  };
  useEffect(() => {
    startDrift();
    return stopDrift;
  }, []);

  // -----------------------------
  // Hide on scroll / show on idle
  // -----------------------------
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

  // -----------------------------
  // Notification popup
  // -----------------------------
  useEffect(() => {
    if (!notification) return;
    setShowNotification(true);
    const t = window.setTimeout(() => setShowNotification(false), 7000);
    return () => clearTimeout(t);
  }, [notification]);

  const handleClick = (s: Suggestion) => onSend(s.payload ?? s.title);

  // -----------------------------
  // Icon mapping
  // -----------------------------
  const getIcon = (s: Suggestion) => {
    const key = s.payload?.toLowerCase() ?? "";
    if (key.includes("light")) return <FiZap size={16} className="text-gray-400" />;
    if (key.includes("camera")) return <FiCamera size={16} className="text-gray-400" />;
    if (key.includes("lock") || key.includes("door")) return <FiLock size={16} className="text-gray-400" />;
    if (key.includes("device")) return <FiCpu size={16} className="text-gray-400" />;
    if (key.includes("meter") || key.includes("usage")) return <FiDollarSign size={16} className="text-gray-400" />;
    if (key.includes("ir")) return <FiActivity size={16} className="text-gray-400" />;
    if (key.includes("sensor") || key.includes("motion")) return <FiShield size={16} className="text-gray-400" />;
    return <FiKey size={16} className="text-gray-400" />;
  };

  // -----------------------------
  // Render
  // -----------------------------
  const displayList = suggestions ?? [];

  return (
    <>
      {/* Notification */}
      <AnimatePresence>
        {showNotification && notification && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.28 }}
            style={{ bottom: `calc(96px + env(safe-area-inset-bottom))`, zIndex: 70 }}
            className="fixed left-0 w-full flex justify-center px-4 pointer-events-auto"
          >
            <div className="max-w-3xl w-full bg-gray-900 text-gray-100 rounded-2xl p-4 shadow border border-gray-700 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="font-semibold text-sm">{notification.title}</div>
                  {notification.description && (
                    <div className="text-xs text-gray-400 mt-1">{notification.description}</div>
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

      {/* Resident suggestions */}
      <AnimatePresence>
        {visible && !isTyping && displayList.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.28 }}
            style={{ bottom: `calc(84px + env(safe-area-inset-bottom))`, zIndex: 60 }}
            className="fixed left-0 right-0 px-4 pointer-events-none"
          >
            <div
              ref={scrollRef}
              className="w-full pointer-events-auto flex overflow-x-auto gap-3 hide-scrollbar"
              style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
            >
              {displayList.map((s) => (
                <motion.button
                  key={s.id}
                  onClick={() => handleClick(s)}
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-none min-w-[220px] bg-gray-800 text-gray-100 rounded-2xl shadow border border-gray-700 p-3 text-left flex items-start gap-2 transition scroll-snap-align-start hover:bg-gray-750"
                  style={{ opacity: assistantActive ? 0.55 : 1 }}
                >
                  {getIcon(s)}
                  <div className="flex flex-col">
                    <div className="font-medium text-sm leading-tight">{s.title}</div>
                    {s.subtitle && <div className="text-xs text-gray-400 mt-0.5">{s.subtitle}</div>}
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
