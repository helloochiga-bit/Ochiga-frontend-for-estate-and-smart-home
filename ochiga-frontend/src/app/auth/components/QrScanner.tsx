"use client";

import { useEffect, useRef } from "react";

export default function QrScanner({ onScan }: { onScan: (data: string | null) => void }) {
  const timerRef = useRef<number>();

  // Cleanup safely
  useEffect(() => {
    // Demo: no timer is actually running, but if you add one in the future, this is safe
    const currentTimer = timerRef.current;
    return () => {
      if (currentTimer) window.clearTimeout(currentTimer);
    };
  }, []);

  const handleUseToken = () => {
    const input = document.getElementById("demo-qr-input") as HTMLInputElement | null;
    const val = input?.value.trim();
    if (!val) return alert("Paste token");
    onScan(val);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full h-64 bg-black/60 border border-gray-700 rounded-md flex items-center justify-center text-gray-500">
        {/* placeholder for camera view */}
        <div className="text-center">
          <p className="mb-2">Camera view (demo)</p>
          <p className="text-xs text-gray-400">
            Use the admin tool to create a home invitation link and QR, then paste the token below.
          </p>
        </div>
      </div>

      <div className="w-full flex gap-2">
        <input
          id="demo-qr-input"
          placeholder="Paste invite token here (demo)"
          className="flex-1 p-2 rounded bg-gray-800 border border-gray-700"
        />
        <button onClick={handleUseToken} className="px-3 py-2 bg-emerald-600 rounded">
          Use Token
        </button>
      </div>
    </div>
  );
}
