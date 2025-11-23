"use client";

import { FaUserCircle, FaBell, FaPlug, FaShieldAlt, FaTools, FaSignOutAlt } from "react-icons/fa";
import { SettingsSection, SettingsItem } from "@/components/SettingsComponents";

export default function ResidentSettingsPage() {
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

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col">
      {/* Profile Header */}
      <div className="max-w-xl mx-auto px-6 pt-10 mb-6">
        <div className="flex flex-col items-center text-center">
          <FaUserCircle className="text-gray-500 text-7xl mb-3" />
          <h2 className="text-lg font-semibold text-gray-900">Oyi</h2>
          <p className="text-sm text-gray-500">@info.pavnigeria</p>
          <div className="mt-4 px-4 py-1 rounded-full border border-gray-300 text-xs text-gray-500 bg-white">
            Free Plan
          </div>
        </div>
      </div>

      {/* Scrollable Sections */}
      <div className="max-w-xl mx-auto px-6 flex-1 overflow-y-auto space-y-8 pb-28">
        {sections.map((section) => (
          <SettingsSection key={section.title} title={section.title}>
            {section.items.map((item) => (
              <SettingsItem key={item.title} {...item} />
            ))}
          </SettingsSection>
        ))}
      </div>

      {/* Sticky Logout */}
      <div className="fixed bottom-4 left-0 w-full px-6 max-w-xl mx-auto">
        <button className="w-full py-3 text-red-600 font-semibold bg-white rounded-xl border border-gray-200 shadow-sm flex items-center justify-center gap-2 hover:bg-red-50 transition">
          <FaSignOutAlt />
          Log Out
        </button>
      </div>
    </div>
  );
}
