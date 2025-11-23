"use client";
import { useEffect, useState } from "react";

const tourSteps = [
  {
    title: "Navigation Menu",
    description: "Use this menu to open chats, panels, and settings.",
    spotlight: "sidebar",
    graphic: "navigation",
  },
  {
    title: "Chat Area",
    description: "Here’s where your AI conversation happens.",
    spotlight: "chatArea",
    graphic: "chat",
  },
  {
    title: "AI Suggestions",
    description: "Quickly send commands from suggested prompts.",
    spotlight: "suggestionsCard",
    graphic: "suggestions",
  },
  {
    title: "Devices & Panels",
    description: "View and manage connected devices and panels here.",
    spotlight: "devices",
    graphic: "devices",
  },
];

export default function ResidentTour() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const handleResize = () => updateSpotlight();
    window.addEventListener("resize", handleResize);
    updateSpotlight();
    return () => window.removeEventListener("resize", handleResize);
  }, [currentStep]);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, tourSteps.length - 1));
  const previousStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));
  const skipTour = () => setCurrentStep(-1);

  const updateSpotlight = () => {
    const step = tourSteps[currentStep];
    const spotlight = document.getElementById("spotlight");
    if (!spotlight || !step) return;

    if (step.spotlight) {
      const element = document.getElementById(step.spotlight);
      if (element) {
        const rect = element.getBoundingClientRect();
        spotlight.style.display = "block";
        spotlight.style.left = `${rect.left - 10}px`;
        spotlight.style.top = `${rect.top - 10}px`;
        spotlight.style.width = `${rect.width + 20}px`;
        spotlight.style.height = `${rect.height + 20}px`;
      }
    } else spotlight.style.display = "none";
  };

  if (currentStep === -1) return null;

  return (
    <div className="app-container relative min-h-screen overflow-hidden pointer-events-none">
      {/* Spotlight */}
      <div
        id="spotlight"
        className="spotlight absolute border-2 border-yellow-400 rounded-lg shadow-[0_0_0_2000px_rgba(0,0,0,0.7)] pointer-events-none transition-all duration-500 z-40 animate-pulse"
      ></div>

      {/* Tour Modal */}
      <div className="tour-modal fixed bottom-4 left-4 right-4 bg-gradient-to-br from-blue-900/95 to-blue-500/95 rounded-2xl p-5 shadow-lg z-50 pointer-events-auto">
        <div
          id="tourGraphic"
          className="tour-graphic w-full h-28 mb-4 bg-black/20 rounded-lg flex items-center justify-center"
        ></div>

        <div className="nav-dots flex justify-center gap-2 mb-4">
          {tourSteps.map((_, idx) => (
            <div
              key={idx}
              className={`dot ${idx === currentStep ? "active" : ""} w-2 h-2 rounded-full bg-white/30 ${
                idx === currentStep ? "w-6 rounded-md bg-yellow-400" : ""
              }`}
            ></div>
          ))}
        </div>

        <div className="progress-bar h-1 bg-white/20 rounded mb-4">
          <div
            className="progress-fill h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all"
            style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
          ></div>
        </div>

        <h3 className="text-white font-bold text-lg mb-2">{tourSteps[currentStep].title}</h3>
        <p className="text-white/80 text-sm mb-4">{tourSteps[currentStep].description}</p>

        <div className="flex justify-between items-center flex-wrap gap-2">
          <button className="skip-button text-white/70 text-xs" onClick={skipTour}>
            Skip Tour
          </button>
          <div className="flex gap-2">
            <button
              className="skip-button text-xs"
              onClick={previousStep}
              disabled={currentStep === 0}
            >
              ← Back
            </button>
            <button
              className="cta-button text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-blue-900 rounded-lg px-4 py-2 font-semibold shadow"
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
