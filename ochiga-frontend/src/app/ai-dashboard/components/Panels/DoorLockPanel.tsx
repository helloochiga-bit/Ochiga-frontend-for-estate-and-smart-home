// ochiga-frontend/src/app/ai-dashboard/components/Panels/DoorLockPanel.tsx
"use client";

import { useState } from "react";
import { FaLock, FaUnlock, FaDoorClosed, FaDoorOpen } from "react-icons/fa";

export default function DoorLockPanel() {
  const [locked, setLocked] = useState(true);
  const [doorOpen, setDoorOpen] = useState(false);

  const toggleLock = () => setLocked((prev) => !prev);
  const toggleDoor = () => setDoorOpen((prev) => !prev);

  return (
    <div className="mt-2 p-3 bg-gray-900 border border-gray-700 rounded-xl text-xs md:text-sm animate-fadeIn transition-all duration-300">
      <p className="mb-2 text-orange-400 font-semibold">🚪 Door Control</p>

      {/* Lock / Unlock */}
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={toggleLock}
          className={`flex items-center gap-1 px-3 py-1 rounded-full transition ${
            locked ? "bg-orange-600 text-white" : "bg-gray-700 hover:bg-gray-600 text-gray-300"
          }`}
        >
          {locked ? <FaLock /> : <FaUnlock />}
          {locked ? "Locked" : "Unlocked"}
        </button>
      </div>

      {/* Open / Close Handle */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleDoor}
          disabled={locked}
          className={`flex items-center gap-1 px-3 py-1 rounded-full transition ${
            doorOpen
              ? "bg-orange-600 text-white"
              : "bg-gray-700 hover:bg-gray-600 text-gray-300"
          } ${locked ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {doorOpen ? <FaDoorOpen /> : <FaDoorClosed />}
          {doorOpen ? "Open" : "Closed"}
        </button>
      </div>

      {/* Status Display */}
      <p className="text-gray-400 text-[10px] mt-2">
        Status: {locked ? "Locked" : "Unlocked"} | Door is {doorOpen ? "Open" : "Closed"}
      </p>
    </div>
  );
}
