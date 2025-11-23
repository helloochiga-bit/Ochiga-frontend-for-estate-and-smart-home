// ochiga-frontend/src/app/ai-dashboard/components/SettingsModal.tsx
"use client";

import { useState, useEffect } from "react";
import { FaUserCircle, FaBell, FaPlug, FaShieldAlt, FaTools, FaSignOutAlt, FaTimes } from "react-icons/fa";
import { SettingsSection, SettingsItem } from "../../components/SettingsComponents";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SettingsModal({ isOpen, onClose }: Props) {
  const [show, setShow] = useState(isOpen);

  useEffect(() => {
    setShow(isOpen);
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

  if (!show) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Slide-up modal */}
      <div className="fixed bottom-0 left-0 w-full h-[90dvh] bg-gray-900 z-50 rounded-t-2xl shadow-xl transform transition-transform duration-300">
        {/* Header with X button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Settings</h2>
          <button onClick={onClose} className="text-white text-xl">
            <FaTimes />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="px-6 py-4 overflow-y-auto h-[calc(90dvh-64px)] space-y-6">
          {/* Profile Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <FaUserCircle className="text-gray-400 text-7xl mb-3" />
            <h3 className="text-lg font-semibold text-white">Oyi</h3>
            <p className="text-sm text-gray-400">@info.pavnigeria</p>
            <div className="mt-3 px-4 py-1 rounded-full border border-gray-600 text-xs text-gray-300 bg-gray-800">
              Free Plan
            </div>
          </div>

          {/* Sections */}
          {sections.map((section) => (
            <SettingsSection key={section.title} title={section.title}>
              {section.items.map((item) => (
                <SettingsItem key={item.title} {...item} />
              ))}
            </SettingsSection>
          ))}

          {/* Logout button */}
          <div className="mt-6">
            <button className="w-full py-3 text-red-600 font-semibold bg-gray-800 rounded-xl border border-gray-700 shadow-sm flex items-center justify-center gap-2 hover:bg-red-700 transition">
              <FaSignOutAlt />
              Log Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
