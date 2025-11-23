// ochiga-frontend/src/app/components/ResidentTour.tsx
"use client";

import { useEffect, useState } from "react";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";

const steps: Step[] = [
  {
    target: '[data-tour-id="chatArea"]',
    content: "This is your chat area. Interact with Ochiga AI here!",
    placement: "top",
    styles: {
      options: {
        backgroundColor: "#1F1F1F", // dark grey
        textColor: "#FFFFFF",
        primaryColor: "#800000", // maroon
        zIndex: 10000,
        borderRadius: 10,
        padding: 15,
      },
    },
  },
  {
    target: '[data-tour-id="devicesPanel"]',
    content: "Here you can see and manage all connected devices.",
    placement: "right",
    styles: {
      options: {
        backgroundColor: "#1F1F1F",
        textColor: "#FFFFFF",
        primaryColor: "#800000",
        zIndex: 10000,
        borderRadius: 10,
        padding: 15,
      },
    },
  },
  {
    target: '[data-tour-id="suggestionsCard"]',
    content: "These are suggested commands for quick access.",
    placement: "top",
    styles: {
      options: {
        backgroundColor: "#1F1F1F",
        textColor: "#FFFFFF",
        primaryColor: "#800000",
        zIndex: 10000,
        borderRadius: 10,
        padding: 15,
      },
    },
  },
];

export default function ResidentTour() {
  const [run, setRun] = useState(false);

  useEffect(() => {
    // start tour automatically for first-time users
    const tourDone = localStorage.getItem("residentTourDone");
    if (!tourDone) setRun(true);
  }, []);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      localStorage.setItem("residentTourDone", "true");
      setRun(false);
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showSkipButton
      showProgress
      styles={{
        options: {
          arrowColor: "#1F1F1F",
          backgroundColor: "#1F1F1F",
          primaryColor: "#800000",
          textColor: "#FFFFFF",
          zIndex: 10000,
          fontFamily: "Inter, sans-serif",
          borderRadius: 10,
        },
        buttonSkip: {
          color: "#FFFFFF",
        },
        buttonNext: {
          backgroundColor: "#800000",
          color: "#FFFFFF",
        },
        buttonBack: {
          color: "#FFFFFF",
        },
      }}
      callback={handleJoyrideCallback}
    />
  );
}
