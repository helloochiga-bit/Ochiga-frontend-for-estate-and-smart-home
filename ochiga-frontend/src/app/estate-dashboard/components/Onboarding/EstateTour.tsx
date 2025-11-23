// ochiga-frontend/src/app/estate-dashboard/components/EstateTour.tsx
"use client";

import { useState } from "react";

interface EstateStep {
  title: string;
  description: string;
  graphic: "homeCreation" | "devices" | "wallet" | "community" | "security" | "visitors";
}

const estateTourSteps: EstateStep[] = [
  {
    title: "Create First Home",
    description: "Start by adding your first home and manage its residents.",
    graphic: "homeCreation",
  },
  {
    title: "Estate Devices",
    description: "Connect estate-wide devices and monitor their status.",
    graphic: "devices",
  },
  {
    title: "Wallet & Utilities",
    description: "Manage estate finances, fund wallets, and pay utilities.",
    graphic: "wallet",
  },
  {
    title: "Community",
    description: "Engage with residents and manage community interactions.",
    graphic: "community",
  },
  {
    title: "Security & Access",
    description: "Monitor CCTV and manage digital access keys for residents.",
    graphic: "security",
  },
  {
    title: "Visitors",
    description: "Easily manage visitor access across your estate.",
    graphic: "visitors",
  },
];

export default function EstateTour() {
  const [currentStep, setCurrentStep] = useState(0);

  const step = estateTourSteps[currentStep];

  const nextStep = () => {
    if (currentStep < estateTourSteps.length - 1) setCurrentStep(currentStep + 1);
  };
  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };
  const skipTour = () => setCurrentStep(estateTourSteps.length);

  const renderGraphic = (type: EstateStep["graphic"]) => {
    switch (type) {
      case "homeCreation":
        return (
          <svg width={120} height={120}>
            <rect x="50" y="50" width="20" height="20" fill="#B85C5C" />
            <text x="60" y="40" fill="#fff" textAnchor="middle" fontSize={16}>
              +
            </text>
          </svg>
        );
      case "devices":
        return (
          <svg width={120} height={120}>
            <circle cx="60" cy="60" r="10" fill="#B85C5C" />
            <circle cx="40" cy="40" r="6" fill="#fff" />
            <circle cx="80" cy="40" r="6" fill="#fff" />
          </svg>
        );
      case "wallet":
        return (
          <svg width={120} height={120}>
            <rect x="30" y="40" width="60" height="40" rx={6} fill="#B85C5C" />
            <circle cx="60" cy="60" r="6" fill="#fff" />
          </svg>
        );
      case "community":
        return (
          <svg width={120} height={120}>
            <circle cx="40" cy="50" r="8" fill="#B85C5C" />
            <circle cx="80" cy="50" r="8" fill="#fff" />
            <circle cx="60" cy="80" r="8" fill="#B85C5C" />
          </svg>
        );
      case "security":
        return (
          <svg width={120} height={120}>
            <rect x="50" y="40" width="20" height="40" fill="#B85C5C" />
            <circle cx="60" cy="60" r="4" fill="#fff" />
          </svg>
        );
      case "visitors":
        return (
          <svg width={120} height={120}>
            <circle cx="60" cy="40" r="12" fill="#B85C5C" />
            <rect x="45" y="60" width="30" height="30" fill="#B85C5C" rx={6} />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-black bg-opacity-90 z-50 p-4">
      {step && (
        <>
          <div className="mb-6">{renderGraphic(step.graphic)}</div>
          <h2 className="text-white text-xl font-bold mb-2">{step.title}</h2>
          <p className="text-white text-sm text-opacity-80 mb-6">{step.description}</p>

          <div className="flex gap-2 mb-4">
            {estateTourSteps.map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i === currentStep ? "bg-[#B85C5C] w-6 rounded-md" : "bg-white/40"
                }`}
              />
            ))}
          </div>

          <div className="flex gap-4">
            <button
              className="text-white text-sm opacity-70 hover:opacity-100"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              ← Back
            </button>
            <button className="bg-[#B85C5C] text-white px-4 py-2 rounded-md" onClick={nextStep}>
              {currentStep === estateTourSteps.length - 1 ? "Get Started 🚀" : "Next →"}
            </button>
            <button className="text-white/70 hover:text-white text-sm" onClick={skipTour}>
              Skip
            </button>
          </div>
        </>
      )}
    </div>
  );
}
