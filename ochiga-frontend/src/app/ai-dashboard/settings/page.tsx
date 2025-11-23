// ochiga-frontend/src/app/components/SettingsSlideUp.tsx
"use client";

import { useState } from "react";
import { FaUserCircle, FaBell, FaPlug, FaShieldAlt, FaTools, FaSignOutAlt } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import { SettingsSection, SettingsItem } from "./SettingsComponents";

type SlideUpProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SettingsSlideUp({ isOpen, onClose }: SlideUpProps) {
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

  if (!isOpen) return null;

  return (
    <>
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Slide-up modal */}
      <div className="fixed inset-x-0 bottom-0 z-50 max-h-[90vh] h-[90vh] bg-gray-900 rounded-t-3xl shadow-xl transform transition-transform duration-300 ease-out animate-slide-up overflow-hidden flex flex-col">
        
        {/* Header with back arrow */}
        <div className="flex items-center px-6 py-4 border-b border-gray-700">
          <button
            onClick={onClose}
            className="text-gray-300 text-xl p-1 hover:text-white transition"
          >
            <FiArrowLeft />
          </button>
          <h2 className="text-lg font-semibold text-white ml-4">Settings</h2>
        </div>

        {/* Profile Header */}
        <div className="px-6 py-6 border-b border-gray-700 flex flex-col items-center text-center">
          <FaUserCircle className="text-gray-400 text-7xl mb-3" />
          <h2 className="text-lg font-semibold text-white">Oyi</h2>
          <p className="text-sm text-gray-400">@info.pavnigeria</p>
          <div className="mt-4 px-4 py-1 rounded-full border border-gray-600 text-xs text-gray-400 bg-gray-800">
            Free Plan
          </div>
        </div>

        {/* Scrollable sections */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {sections.map((section) => (
            <SettingsSection key={section.title} title={section.title}>
              {section.items.map((item) => (
                <SettingsItem key={item.title} {...item} />
              ))}
            </SettingsSection>
          ))}
        </div>

        {/* Logout button */}
        <div className="px-6 py-4 border-t border-gray-700">
          <button className="w-full py-3 text-red-600 font-semibold bg-gray-800 rounded-xl border border-gray-700 shadow-sm flex items-center justify-center gap-2 hover:bg-red-700 transition">
            <FaSignOutAlt />
            Log Out
          </button>
        </div>
      </div>

      {/* Slide-up animation */}
      <style jsx>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
}
