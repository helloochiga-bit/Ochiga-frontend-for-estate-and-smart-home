// ochiga-frontend/src/app/components/ResidentTour.tsx
"use client";

import { useEffect, useState } from "react";

type TourStep = {
  id: string;
  title: string;
  description: string;
  selector: string; // CSS selector of the target
};

const steps: TourStep[] = [
  {
    id: "chatArea",
    title: "Chat Area",
    description: "This is your chat area. Interact with Ochiga AI here!",
    selector: '[data-tour-id="chatArea"]',
  },
  {
    id: "devicesPanel",
    title: "Devices Panel",
    description: "Here you can see and manage all connected devices.",
    selector: '[data-tour-id="devicesPanel"]',
  },
  {
    id: "suggestionsCard",
    title: "Suggestions Card",
    description: "These are suggested commands for quick access.",
    selector: '[data-tour-id="suggestionsCard"]',
  },
];

export default function ResidentTour() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showTour, setShowTour] = useState<boolean>(false);
  const [spotlightStyle, setSpotlightStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const tourDone = localStorage.getItem("residentTourDone");
    if (!tourDone) setShowTour(true);
  }, []);

  useEffect(() => {
    if (!showTour) return;
    updateSpotlight();
    window.addEventListener("resize", updateSpotlight);
    return () => window.removeEventListener("resize", updateSpotlight);
  }, [currentStep, showTour]);

  const updateSpotlight = () => {
    const step = steps[currentStep];
    const el = document.querySelector(step.selector) as HTMLElement;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setSpotlightStyle({
      position: "absolute",
      top: rect.top - 8 + window.scrollY,
      left: rect.left - 8 + window.scrollX,
      width: rect.width + 16,
      height: rect.height + 16,
      border: "2px solid #800000",
      borderRadius: 12,
      boxShadow: "0 0 0 2000px rgba(0,0,0,0.7)",
      pointerEvents: "none",
      transition: "all 0.3s",
      zIndex: 10000,
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep((s) => s + 1);
    else finishTour();
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const finishTour = () => {
    setShowTour(false);
    localStorage.setItem("residentTourDone", "true");
  };

  if (!showTour) return null;

  const step = steps[currentStep];

  return (
    <>
      {/* Spotlight */}
      <div style={spotlightStyle} className="animate-pulse"></div>

      {/* Modal */}
      <div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[10001] max-w-lg w-full bg-gray-900/95 text-white p-5 rounded-xl shadow-lg flex flex-col gap-3"
        style={{ border: "1px solid #800000" }}
      >
        <h3 className="text-lg font-bold text-maroon-600">{step.title}</h3>
        <p className="text-white text-sm">{step.description}</p>
        <div className="flex justify-between mt-2">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="text-white/70 px-3 py-1 rounded hover:bg-gray-800"
          >
            ← Back
          </button>
          <div className="flex gap-2">
            <button
              onClick={finishTour}
              className="px-3 py-1 rounded text-white bg-gray-700 hover:bg-gray-800"
            >
              Skip
            </button>
            <button
              onClick={nextStep}
              className="px-3 py-1 rounded bg-[#800000] hover:bg-red-900 text-white font-semibold"
            >
              {currentStep === steps.length - 1 ? "Finish" : "Next →"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
