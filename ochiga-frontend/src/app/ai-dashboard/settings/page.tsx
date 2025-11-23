// ochiga-frontend/src/app/ai-dashboard/settings/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { FaUserCircle, FaBell, FaPlug, FaShieldAlt, FaTools, FaSignOutAlt } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import { SettingsSection, SettingsItem } from "../../components/SettingsComponents";

export default function ResidentSettingsPage() {
  const router = useRouter();

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
    <div className="w-full min-h-screen bg-gray-900 flex flex-col">
      {/* Header with back arrow */}
      <div className="flex items-center w-full px-6 pt-10 pb-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full bg-gray-800/40 text-white hover:bg-gray-700 transition"
        >
          <FiArrowLeft className="text-lg" />
        </button>
        <h1 className="text-lg font-semibold text-white ml-4">Settings</h1>
      </div>

      {/* Profile Header */}
      <div className="w-full px-6 mb-6">
        <div className="flex flex-col items-center text-center w-full">
          <FaUserCircle className="text-gray-400 text-7xl mb-3" />
          <h2 className="text-lg font-semibold text-white">Oyi</h2>
          <p className="text-sm text-gray-400">@info.pavnigeria</p>
          <div className="mt-4 px-4 py-1 rounded-full border border-gray-700 text-xs text-gray-400 bg-gray-800">
            Free Plan
          </div>
        </div>
      </div>

      {/* Scrollable Sections */}
      <div className="w-full px-0 flex-1 overflow-y-auto space-y-8 pb-28">
        {sections.map((section) => (
          <div key={section.title} className="w-full px-6">
            <SettingsSection title={section.title}>
              {section.items.map((item) => (
                <SettingsItem key={item.title} {...item} className="w-full" />
              ))}
            </SettingsSection>
          </div>
        ))}
      </div>

      {/* Sticky Logout */}
      <div className="fixed bottom-4 left-0 w-full px-6">
        <button className="w-full py-3 text-red-600 font-semibold bg-gray-800 rounded-xl border border-gray-700 shadow-sm flex items-center justify-center gap-2 hover:bg-red-700 transition">
          <FaSignOutAlt />
          Log Out
        </button>
      </div>
    </div>
  );
}
