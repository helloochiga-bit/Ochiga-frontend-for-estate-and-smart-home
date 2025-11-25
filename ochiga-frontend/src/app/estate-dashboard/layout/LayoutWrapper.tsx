"use client";

import { ReactNode, useEffect } from "react";

interface LayoutWrapperProps {
  children: ReactNode;
  menuOpen?: boolean; // <-- add this
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
        touchAction: "pan-x pan-y",
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        msTouchAction: "pan-y",
        overflowY: "auto",
        overflowX: "hidden",
        transition: "all 0.5s",
        transform: menuOpen ? "translateX(70%)" : "translateX(0)", // optional if you want menu effect
      }}
    >
      {children}
    </div>
  );
}
