"use client";
import { useEffect, useState } from "react";

const tourSteps = [
  {
    title: "Welcome to Dashboard Pro",
    description: "Let's explore the powerful features that will help you be more productive.",
    spotlight: null,
    graphic: "welcome"
  },
  {
    title: "Navigation Panel",
    description: "Quickly switch between chats, analytics, and settings using the navigation tabs at the top.",
    spotlight: "sidebar",
    graphic: "navigation"
  },
  {
    title: "Analytics Dashboard",
    description: "Track message stats and engagement with beautiful visualizations. See how your conversations are performing.",
    spotlight: "analyticsCard",
    graphic: "analytics"
  },
  {
    title: "Settings & Preferences",
    description: "Personalize your chat experience with notifications, privacy controls, security options, and theme settings.",
    spotlight: "settingsCard",
    graphic: "settings"
  }
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
    <div className="app-container relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-500 to-purple-600 overflow-hidden">
      {/* Mock Sidebar */}
      <div className="sidebar" id="sidebar">
        <h2 className="text-white font-bold text-lg mb-3">Chat Dashboard</h2>
        <div className="flex gap-2 overflow-x-auto">
          <div id="navHome" className="nav-item">Chats</div>
          <div id="navAnalytics" className="nav-item">Analytics</div>
          <div id="navSettings" className="nav-item">Settings</div>
        </div>
      </div>

      {/* Mock Main Content */}
      <div className="main-content flex-1 p-4 overflow-y-auto">
        <div id="analyticsCard" className="card">Message Analytics</div>
        <div id="settingsCard" className="card grid grid-cols-2 gap-2">
          <div className="p-3 bg-white/10 rounded text-white text-xs">Notifications</div>
          <div className="p-3 bg-white/10 rounded text-white text-xs">Privacy</div>
          <div className="p-3 bg-white/10 rounded text-white text-xs">Security</div>
          <div className="p-3 bg-white/10 rounded text-white text-xs">Appearance</div>
        </div>
      </div>

      {/* Spotlight */}
      <div id="spotlight" className="spotlight absolute border-2 border-yellow-400 rounded-lg shadow-[0_0_0_2000px_rgba(0,0,0,0.7)] pointer-events-none transition-all duration-500 z-40 animate-pulse"></div>

      {/* Tour Modal */}
      <div className="tour-modal fixed bottom-4 left-4 right-4 bg-gradient-to-br from-blue-900/95 to-blue-500/95 rounded-2xl p-5 shadow-lg z-50">
        <div id="tourGraphic" className="tour-graphic w-full h-28 mb-4 bg-black/20 rounded-lg flex items-center justify-center"></div>

        <div className="nav-dots flex justify-center gap-2 mb-4">
          {tourSteps.map((_, idx) => (
            <div key={idx} className={`dot ${idx === currentStep ? "active" : ""} w-2 h-2 rounded-full bg-white/30 ${idx === currentStep ? "w-6 rounded-md bg-yellow-400" : ""}`}></div>
          ))}
        </div>

        <div className="progress-bar h-1 bg-white/20 rounded mb-4">
          <div className="progress-fill h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all" style={{ width: `${((currentStep+1)/tourSteps.length)*100}%` }}></div>
        </div>

        <h3 className="text-white font-bold text-lg mb-2">{tourSteps[currentStep].title}</h3>
        <p className="text-white/80 text-sm mb-4">{tourSteps[currentStep].description}</p>

        <div className="flex justify-between items-center flex-wrap gap-2">
          <button className="skip-button text-white/70 text-xs" onClick={skipTour}>Skip Tour</button>
          <div className="flex gap-2">
            <button className="skip-button text-xs" onClick={previousStep} disabled={currentStep===0}>← Back</button>
            <button className="cta-button text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-blue-900 rounded-lg px-4 py-2 font-semibold shadow" onClick={nextStep}>
              {currentStep === tourSteps.length-1 ? "Get Started! 🚀" : "Next →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
