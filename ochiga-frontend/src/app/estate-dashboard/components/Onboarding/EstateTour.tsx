// ochiga-frontend/src/app/ai-dashboard/components/Onboarding/EstateTour.tsx
"use client";

import { useEffect, useState } from "react";

const tourSteps = [
  {
    title: "Estate Overview",
    description: "View all your estates, summaries, and statistics here.",
    spotlight: "estateOverview",
    graphic: "overview",
  },
  {
    title: "Estate Devices",
    description: "Manage devices across all estate properties.",
    spotlight: "estateDevicesPanel",
    graphic: "devices",
  },
  {
    title: "Payments & Transactions",
    description: "Check wallet, payment history, and transaction statuses.",
    spotlight: "paymentsPanel",
    graphic: "payments",
  },
  {
    title: "Estate Settings",
    description: "Adjust estate preferences, notifications, and users here.",
    spotlight: "estateSettingsPanel",
    graphic: "settings",
  },
];

export default function EstateTour() {
  const [currentStep, setCurrentStep] = useState(-1);

  useEffect(() => {
    const tourDone = localStorage.getItem("estateTourDone");
    if (!tourDone) setCurrentStep(0);

    const handleResize = () => updateSpotlight();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    updateSpotlight();
  }, [currentStep]);

  const nextStep = () =>
    setCurrentStep((prev) => {
      if (prev + 1 >= tourSteps.length) {
        localStorage.setItem("estateTourDone", "true");
        return -1;
      }
      return prev + 1;
    });
  const previousStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));
  const skipTour = () => {
    localStorage.setItem("estateTourDone", "true");
    setCurrentStep(-1);
  };

  const updateSpotlight = () => {
    const step = tourSteps[currentStep];
    const spotlight = document.getElementById("spotlight");
    if (!spotlight || !step) return;

    if (step.spotlight) {
      const element = document.querySelector(`[data-tour-id="${step.spotlight}"]`) as HTMLElement;
      if (element) {
        const rect = element.getBoundingClientRect();
        spotlight.style.display = "block";
        spotlight.style.left = `${rect.left - 10}px`;
        spotlight.style.top = `${rect.top - 10}px`;
        spotlight.style.width = `${rect.width + 20}px`;
        spotlight.style.height = `${rect.height + 20}px`;
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } else {
      spotlight.style.display = "none";
    }
  };

  if (currentStep === -1) return null;

  return (
    <div className="relative z-50 pointer-events-none">
      {/* Spotlight */}
      <div
        id="spotlight"
        className="absolute border-2 border-maroon rounded-lg shadow-[0_0_0_2000px_rgba(0,0,0,0.7)] pointer-events-none transition-all duration-500 animate-pulse"
      ></div>

      {/* Tour Modal */}
      <div className="fixed bottom-6 left-6 right-6 bg-gray-900 rounded-2xl p-5 shadow-lg pointer-events-auto z-50">
        {/* Graphic placeholder */}
        <div className="tour-graphic w-full h-28 mb-4 bg-gray-700 rounded-lg flex items-center justify-center text-white/50">
          {tourSteps[currentStep].graphic}
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center gap-2 mb-4">
          {tourSteps.map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full bg-white/30 ${
                idx === currentStep ? "w-6 rounded-md bg-maroon" : ""
              }`}
            ></div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-white/20 rounded mb-4">
          <div
            className="h-full bg-gradient-to-r from-maroon to-red-500 transition-all"
            style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
          ></div>
        </div>

        <h3 className="text-white font-bold text-lg mb-2">{tourSteps[currentStep].title}</h3>
        <p className="text-white/80 text-sm mb-4">{tourSteps[currentStep].description}</p>

        <div className="flex justify-between items-center flex-wrap gap-2">
          <button className="text-white/70 text-xs" onClick={skipTour}>
            Skip Tour
          </button>
          <div className="flex gap-2">
            <button
              className="text-xs text-white/70"
              onClick={previousStep}
              disabled={currentStep === 0}
            >
              ← Back
            </button>
            <button
              className="text-xs bg-gradient-to-r from-maroon to-red-500 text-white rounded-lg px-4 py-2 font-semibold shadow"
              onClick={nextStep}
            >
              {currentStep === tourSteps.length - 1 ? "Get Started! 🚀" : "Next →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
