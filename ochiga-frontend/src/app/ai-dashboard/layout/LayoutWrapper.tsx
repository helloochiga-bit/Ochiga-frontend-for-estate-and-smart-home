"use client";

import { ReactNode, useEffect } from "react";

interface LayoutWrapperProps {
  children: ReactNode;
  menuOpen?: boolean; // ✅ add this prop
}

export default function LayoutWrapper({ children, menuOpen = false }: LayoutWrapperProps) {
  useEffect(() => {
    // Prevent double-tap zoom
    const preventZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) e.preventDefault();
    };
    document.addEventListener("touchstart", preventZoom, { passive: false });

    // Prevent pinch zoom / scale
    const metaViewport = document.querySelector('meta[name=viewport]');
    if (metaViewport) {
      metaViewport.setAttribute(
        "content",
        "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
      );
    }

    return () => {
      document.removeEventListener("touchstart", preventZoom);
      if (metaViewport) {
        metaViewport.setAttribute(
          "content",
          "width=device-width, initial-scale=1"
        );
      }
    };
  }, []);

  return (
    <div
      className="w-screen h-screen relative bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white"
      style={{
        touchAction: "pan-x pan-y", // allows scroll
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        msTouchAction: "pan-y", // vertical scroll allowed
        overflowY: "auto", // enable scrolling
        overflowX: "hidden",
      }}
    >
      {children}
    </div>
  );
}
