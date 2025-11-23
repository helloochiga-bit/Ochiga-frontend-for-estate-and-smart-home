// ochiga-frontend/src/app/preview-estate-tour/page.tsx
"use client";
import EstateTour from "../estate-dashboard/components/Onboarding/EstateTour";

export default function PreviewEstateTour() {
  return (
    <div className="relative w-full h-screen bg-gray-900 text-white p-6">
      {/* Mock estate dashboard elements */}
      <div data-tour-id="estateOverview" className="w-full max-w-3xl h-32 bg-gray-700 my-4 rounded-lg"></div>
      <div data-tour-id="estateDevicesPanel" className="w-full max-w-3xl h-28 bg-gray-700 my-4 rounded-lg"></div>
      <div data-tour-id="paymentsPanel" className="w-full max-w-3xl h-20 bg-gray-700 my-4 rounded-lg"></div>
      <div data-tour-id="estateSettingsPanel" className="w-full max-w-3xl h-20 bg-gray-700 my-4 rounded-lg"></div>

      <EstateTour />
    </div>
  );
}
