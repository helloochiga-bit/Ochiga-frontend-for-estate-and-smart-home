// ochiga-frontend/src/app/ai-dashboard/components/SlideUpSettings.tsx
"use client";

import { useEffect } from "react";
import { FaUserCircle, FaBell, FaPlug, FaShieldAlt, FaTools, FaSignOutAlt } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { SettingsSection, SettingsItem } from "../../components/SettingsComponents";

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

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* BACKDROP */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* SLIDE UP PANEL */}
      <div
        className={`fixed left-0 right-0 bottom-0 z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="bg-gray-900 rounded-t-3xl max-h-[90vh] overflow-y-auto shadow-xl">
          {/* HEADER */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">Settings</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-800 transition"
            >
              <FiX className="text-white text-xl" />
            </button>
          </div>

          {/* CONTENT */}
          <div className="px-6 py-4 space-y-8">
            {sections.map((section) => (
              <SettingsSection key={section.title} title={section.title}>
                {section.items.map((item) => (
                  <SettingsItem key={item.title} {...item} />
                ))}
              </SettingsSection>
            ))}
          </div>

          {/* LOGOUT */}
          <div className="px-6 py-4 border-t border-gray-700">
            <button className="w-full py-3 text-red-600 font-semibold bg-gray-800 rounded-xl flex items-center justify-center gap-2 hover:bg-red-700 transition">
              <FaSignOutAlt />
              Log Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
