"use client";

import { useState, useEffect, FC } from "react";
import { FiMenu, FiX, FiSearch, FiChevronDown, FiChevronUp, FiLogOut } from "react-icons/fi";
import { MdOutlinePerson, MdSettings } from "react-icons/md";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import SlideUpEstateSettings from "./SlideUpEstateSettings";

interface HamburgerMenuProps {
  onToggle?: (open: boolean) => void; // <-- add prop
}

const EstateHamburgerMenu: FC<HamburgerMenuProps> = ({ onToggle }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (open) document.body.classList.add("sidebar-open");
    else document.body.classList.remove("sidebar-open");
    if (onToggle) onToggle(open); // <-- trigger parent callback
  }, [open, onToggle]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setProfileOpen(false);
        setShowLogoutConfirm(false);
        setShowSettings(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleLogout = () => {
    document.cookie = "ochiga_estate_auth=; Max-Age=0; path=/";
    localStorage.removeItem("ochiga_user");
    router.push("/auth");
  };

  const initials = user?.username ? user.username[0].toUpperCase() : "E";

  return (
    <>
      {/* FIXED HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => {
            setOpen(!open);
            if (open) setProfileOpen(false);
          }}
          className="p-2 rounded-md bg-gray-800/60 hover:bg-gray-800 text-white transition"
        >
          {open ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
        </button>

        <span className="text-white text-sm md:text-base font-medium tracking-wide">
          Estate Dashboard
        </span>
      </header>

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-[100dvh] w-[72%] max-w-[360px] z-40 transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}`}
        style={{
          background: "linear-gradient(180deg, rgba(7,10,16,1) 0%, rgba(11,12,17,1) 100%)",
          borderRight: "1px solid rgba(255,255,255,0.03)",
        }}
      >
        <div className="h-16" />

        <div className="px-4 mt-2">
          <div className="flex items-center bg-gray-800/60 rounded-xl px-3 py-2">
            <FiSearch className="opacity-50 text-gray-300" size={18} />
            <input
              type="text"
              placeholder="Search houses, estates or devices"
              className="bg-transparent outline-none text-sm ml-3 w-full text-gray-100 placeholder-gray-400"
            />
          </div>
        </div>

        <nav className="px-4 mt-6 space-y-2 text-gray-200">
          <button className="w-full text-left py-3 px-3 rounded-lg hover:bg-gray-800 transition">Dashboard Overview</button>
          <button className="w-full text-left py-3 px-3 rounded-lg hover:bg-gray-800 transition">Estate Management</button>
          <button className="w-full text-left py-3 px-3 rounded-lg hover:bg-gray-800 transition">Lighting & Power</button>
          <button className="w-full text-left py-3 px-3 rounded-lg hover:bg-gray-800 transition">Security & CCTV</button>
          <button className="w-full text-left py-3 px-3 rounded-lg hover:bg-gray-800 transition">Residents & Access</button>
        </nav>

        {/* USER SECTION */}
        <div className="absolute bottom-0 left-0 w-full px-4 py-5 border-t border-white/6 bg-black/40">
          <div className="flex items-center justify-between">
            <button className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-rose-600 flex items-center justify-center text-white font-semibold">
                {initials}
              </div>
              <div className="text-left">
                <p className="text-white font-semibold text-sm">
                  {user?.username || "Estate Admin"}
                </p>
                <p className="text-white/50 text-xs">
                  {user?.email || "View profile"}
                </p>
              </div>
            </button>

            <button onClick={() => setProfileOpen(!profileOpen)} className="p-2 text-white/70">
              {profileOpen ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
            </button>
          </div>

          {profileOpen && (
            <div className="mt-3 bg-gray-900/95 border border-white/5 rounded-xl overflow-hidden shadow-xl">
              <button className="w-full flex items-center gap-3 px-4 py-3 text-white/90 hover:bg-gray-800 transition">
                <MdOutlinePerson size={18} /> Profile
              </button>

              <button
                onClick={() => setShowSettings(true)}
                className="w-full flex items-center gap-3 px-4 py-3 text-white/90 hover:bg-gray-800 transition"
              >
                <MdSettings size={18} /> Settings
              </button>

              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-800 transition"
              >
                <FiLogOut size={18} /> Logout
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* BACKDROP */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
          onClick={() => {
            setOpen(false);
            setProfileOpen(false);
          }}
        />
      )}

      {/* LOGOUT MODAL */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center px-6">
          <div className="bg-gray-900 px-6 py-6 rounded-2xl w-full max-w-sm border border-gray-700">
            <p className="text-white text-center font-semibold text-lg mb-6">
              Are you sure you want to logout?
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 rounded-xl bg-gray-700 text-white font-medium"
              >
                No
              </button>

              <button
                onClick={handleLogout}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SLIDE UP ESTATE SETTINGS */}
      <SlideUpEstateSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </>
  );
};

export default EstateHamburgerMenu;
