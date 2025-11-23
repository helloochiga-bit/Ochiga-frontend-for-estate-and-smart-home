// ochiga-frontend/src/app/ai-dashboard/components/ResidentTour.tsx
"use client";

import { useState, useEffect } from "react";

interface TourStep {
  title: string;
  description: string;
  spotlight?: string;
  graphic: "welcome" | "wallet" | "community" | "home" | "access" | "visitors";
}

const residentTourSteps: TourStep[] = [
  {
    title: "Welcome Home",
    description: "Your smart home journey begins here! Let's explore what you can do.",
    graphic: "welcome",
  },
  {
    title: "Wallet & Utilities",
    description: "Fund your wallet, pay utilities, and manage your estate finances in one place.",
    graphic: "wallet",
  },
  {
    title: "Community",
    description: "Stay connected with your estate community and get instant updates.",
    graphic: "community",
  },
  {
    title: "Home Experience",
    description: "Turn on lights, AC, or any device. Connect your first device and see your home come alive.",
    graphic: "home",
  },
  {
    title: "Access & Notifications",
    description: "Use your digital key to open doors and gates while staying notified of unusual activity.",
    graphic: "access",
  },
  {
    title: "Visitors",
    description: "Manage visitor access easily and securely through your dashboard.",
    graphic: "visitors",
  },
];

export default function ResidentTour() {
  const [currentStep, setCurrentStep] = useState(0);

  const step = residentTourSteps[currentStep];

  const nextStep = () => {
    if (currentStep < residentTourSteps.length - 1) setCurrentStep(currentStep + 1);
  };
  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };
  const skipTour = () => setCurrentStep(residentTourSteps.length);

  const renderGraphic = (type: TourStep["graphic"]) => {
    switch (type) {
      case "welcome":
        return (
          <svg width={120} height={120}>
            <circle cx="60" cy="60" r="50" fill="#B85C5C" opacity={0.2} />
            <circle cx="60" cy="60" r="35" fill="#B85C5C" opacity={0.4} />
            <circle cx="60" cy="60" r="20" fill="#B85C5C" />
          </svg>
        );
      case "wallet":
        return (
          <svg width={120} height={120}>
            <rect x="30" y="40" width="60" height="40" rx="6" fill="#B85C5C" />
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
      case "home":
        return (
          <svg width={120} height={120}>
            <rect x="40" y="50" width="40" height="30" fill="#B85C5C" rx={4} />
            <line x1="60" y1="50" x2="60" y2="30" stroke="#fff" strokeWidth={2} />
          </svg>
        );
      case "access":
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

          {/* Progress dots */}
          <div className="flex gap-2 mb-4">
            {residentTourSteps.map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i === currentStep ? "bg-[#B85C5C] w-6 rounded-md" : "bg-white/40"
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              className="text-white text-sm opacity-70 hover:opacity-100"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              ← Back
            </button>
            <button className="bg-[#B85C5C] text-white px-4 py-2 rounded-md" onClick={nextStep}>
              {currentStep === residentTourSteps.length - 1 ? "Get Started 🚀" : "Next →"}
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
