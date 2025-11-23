// ochiga-frontend/src/app/ai-dashboard/components/SlideUpSettings.tsx
"use client";

import { useEffect } from "react";
import { FaUserCircle, FaBell, FaPlug, FaShieldAlt, FaTools, FaSignOutAlt } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { SettingsSection, SettingsItem } from "./SettingsComponents";

type SlideUpSettingsProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SlideUpSettings({ isOpen, onClose }: SlideUpSettingsProps) {
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

  // Prevent background scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Blurred Background */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90]"
        onClick={onClose}
      />

      {/* Slide-Up Panel */}
      <div
        className={`fixed left-0 right-0 bottom-0 z-[100] max-h-[80vh] h-[80vh] bg-gray-900 rounded-t-3xl shadow-xl transform transition-transform duration-300 ease-in-out`}
      >
        {/* Header with X */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <h2 className="text-white font-semibold text-lg">Settings</h2>
          <button onClick={onClose} className="text-white p-2 hover:bg-gray-800 rounded-full transition">
            <FiX size={20} />
          </button>
        </div>

        {/* Profile */}
        <div className="px-6 py-4 flex flex-col items-center text-center">
          <FaUserCircle className="text-gray-400 text-7xl mb-3" />
          <h3 className="text-white font-semibold text-lg">Oyi</h3>
          <p className="text-gray-400 text-sm mb-2">@info.pavnigeria</p>
          <div className="px-4 py-1 rounded-full border border-gray-700 text-xs text-gray-400 bg-gray-800">
            Free Plan
          </div>
        </div>

        {/* Scrollable Sections */}
        <div className="px-6 overflow-y-auto flex-1 space-y-6 pb-6">
          {sections.map((section) => (
            <SettingsSection key={section.title} title={section.title}>
              {section.items.map((item) => (
                <SettingsItem
                  key={item.title}
                  {...item}
                  showChevron={true}
                />
              ))}
            </SettingsSection>
          ))}
        </div>

        {/* Logout Button */}
        <div className="px-6 pb-6">
          <button className="w-full py-3 text-red-600 font-semibold bg-gray-800 rounded-xl border border-gray-700 shadow-sm flex items-center justify-center gap-2 hover:bg-red-700 transition">
            <FaSignOutAlt />
            Log Out
          </button>
        </div>
      </div>
    </>
  );
}
