// ochiga-frontend/src/app/ai-dashboard/components/Onboarding/ResidentTour.tsx
"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

const tourSteps = [
  {
    title: "Welcome Home",
    description: "Welcome to your smart residence! Everything starts here.",
    spotlight: null,
    graphic: "welcome",
  },
  {
    title: "Wallet & Utilities",
    description: "Fund your wallet, pay utilities, and manage estate services. Try: 'Fund my wallet' or 'Pay my power bill'.",
    spotlight: "walletPanel",
    graphic: "wallet",
  },
  {
    title: "Community",
    description: "Stay connected with your estate. Read updates, announcements, events, and messages here.",
    spotlight: "communityPanel",
    graphic: "community",
  },
  {
    title: "Home Experience",
    description: "Your home comes alive. Say: 'Turn on the lights', 'Turn off the AC'. Start by connecting your first device.",
    spotlight: "devicePanel",
    graphic: "device",
  },
  {
    title: "Access & Notifications",
    description: "Your digital key: control doors and gates. Stay informed with alerts, reminders, and unusual activity.",
    spotlight: "cctvPanel",
    graphic: "access",
  },
  {
    title: "Visitors",
    description: "Manage visitors easily. Send passes, approve entry, track arrivals all in one place.",
    spotlight: "visitorsPanel",
    graphic: "visitors",
  },
];

export default function ResidentTour() {
  const [currentStep, setCurrentStep] = useState(0);
  const step = tourSteps[currentStep];

  const nextStep = () => setCurrentStep(Math.min(currentStep + 1, tourSteps.length - 1));
  const prevStep = () => setCurrentStep(Math.max(currentStep - 1, 0));
  const skipTour = () => setCurrentStep(tourSteps.length);

  // Spotlight calculation
  const [spotlightStyle, setSpotlightStyle] = useState<React.CSSProperties>({});
  useEffect(() => {
    const updateSpotlight = () => {
      if (!step.spotlight) return setSpotlightStyle({ display: "none" });
      const el = document.getElementById(step.spotlight);
      if (!el) return setSpotlightStyle({ display: "none" });
      const rect = el.getBoundingClientRect();
      setSpotlightStyle({
        display: "block",
        position: "absolute",
        left: rect.left - 8,
        top: rect.top - 8,
        width: rect.width + 16,
        height: rect.height + 16,
        border: "3px solid #B85C5C",
        borderRadius: "12px",
        boxShadow: "0 0 0 2000px rgba(0,0,0,0.7), 0 0 40px #B85C5C",
        transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        pointerEvents: "none",
        zIndex: 50,
        animation: "pulse 2s ease-in-out infinite",
      });
    };
    updateSpotlight();
    window.addEventListener("resize", updateSpotlight);
    return () => window.removeEventListener("resize", updateSpotlight);
  }, [currentStep, step.spotlight]);

  return currentStep < tourSteps.length ? (
    <div className="fixed inset-0 z-50 flex flex-col justify-end items-center pointer-events-none">
      <div className="fixed" style={spotlightStyle}></div>
      <div
        className="pointer-events-auto bg-black rounded-2xl p-6 m-4 w-[95%] max-w-xl shadow-lg"
        style={{
          background: "#000",
          color: "#fff",
        }}
      >
        <div className="mb-4 h-28 flex items-center justify-center bg-opacity-20 rounded-lg">
          {/* Placeholder graphics */}
          <span>{step.graphic}</span>
        </div>
        <h3 className="text-lg font-bold mb-2">{step.title}</h3>
        <p className="text-sm mb-4">{step.description}</p>
        <div className="flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={clsx(
              "px-4 py-2 rounded text-white",
              currentStep === 0 ? "opacity-30 cursor-not-allowed" : "hover:opacity-80"
            )}
          >
            ← Back
          </button>
          <div className="flex gap-2">
            {tourSteps.map((_, idx) => (
              <div
                key={idx}
                className={clsx("rounded-full h-2 transition-all", {
                  "w-6 bg-[#B85C5C]": idx === currentStep,
                  "w-2 bg-white/30": idx !== currentStep,
                })}
              ></div>
            ))}
          </div>
          <button
            onClick={nextStep}
            className="px-4 py-2 rounded bg-[#B85C5C] font-semibold text-black hover:opacity-80"
          >
            {currentStep === tourSteps.length - 1 ? "Get Started 🚀" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  ) : null;
}
