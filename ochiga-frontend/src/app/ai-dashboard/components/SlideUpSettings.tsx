// ochiga-frontend/src/app/ai-dashboard/components/SlideUpSettings.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaUserCircle, FaBell, FaPlug, FaShieldAlt, FaTools, FaSignOutAlt } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import { SettingsSection, SettingsItem } from "./SettingsComponents";

type SlideUpSettingsProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SlideUpSettings({ isOpen, onClose }: SlideUpSettingsProps) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  // For smooth slide-in/out
  useEffect(() => {
    if (isOpen) setVisible(true);
    else {
      const timer = setTimeout(() => setVisible(false), 300); // wait for slide-out animation
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const sections = [
    {
      title: "Account",
      items: [
        { title: "Email", subtitle: "info.pavnigeria@gmail.com" },
        { title: "Subscription", value: "Free Plan" },
        { title: "Upgrade to Oyi Pro" },
        { title: "Personalization", icon: FaUserCircle },
      ],
    },
    {
      title: "System",
      items: [
        { title: "Notifications", icon: FaBell },
        { title: "Apps & Connectors", icon: FaPlug },
        { title: "Security & Privacy", icon: FaShieldAlt },
        { title: "Developer Tools", icon: FaTools },
      ],
    },
    {
      title: "About",
      items: [
        { title: "Terms of Use" },
        { title: "Privacy Policy" },
        { title: "Help Center" },
      ],
    },
  ];

  if (!visible) return null;

  return (
    <>
      {/* BACKDROP */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* SLIDE-UP PANEL */}
      <div
        className={`fixed bottom-0 left-0 w-full z-50 bg-gray-900 rounded-t-3xl shadow-xl overflow-hidden transform transition-transform duration-300
          ${isOpen ? "translate-y-0" : "translate-y-full"}`}
        style={{ height: "85vh" }}
      >
        {/* HEADER */}
        <div className="flex items-center px-6 py-4 border-b border-gray-800">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-800/40 text-white hover:bg-gray-700 transition"
          >
            <FiArrowLeft className="text-lg" />
          </button>
          <h1 className="text-lg font-semibold text-white ml-4">Settings</h1>
        </div>

        {/* PROFILE */}
        <div className="w-full px-6 py-6 flex flex-col items-center text-center border-b border-gray-800">
          <FaUserCircle className="text-gray-400 text-7xl mb-3" />
          <h2 className="text-lg font-semibold text-white">Oyi</h2>
          <p className="text-sm text-gray-400">@info.pavnigeria</p>
          <div className="mt-4 px-4 py-1 rounded-full border border-gray-700 text-xs text-gray-400 bg-gray-800">
            Free Plan
          </div>
        </div>

        {/* SCROLLABLE SECTIONS */}
        <div className="px-6 pt-6 flex-1 overflow-y-auto space-y-8">
          {sections.map((section) => (
            <div key={section.title} className="w-full">
              <SettingsSection title={section.title}>
                {section.items.map((item) => (
                  <SettingsItem key={item.title} {...item} className="w-full" />
                ))}
              </SettingsSection>
            </div>
          ))}
        </div>

        {/* STICKY LOGOUT */}
        <div className="w-full px-6 py-4 border-t border-gray-800 bg-gray-900">
          <button
            onClick={() => console.log("Logout clicked")}
            className="w-full py-3 text-red-600 font-semibold bg-gray-800 rounded-xl border border-gray-700 shadow-sm flex items-center justify-center gap-2 hover:bg-red-700 transition"
          >
            <FaSignOutAlt />
            Log Out
          </button>
        </div>
      </div>
    </>
  );
}
