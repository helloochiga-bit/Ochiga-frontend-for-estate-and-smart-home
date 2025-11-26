import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { DashboardProvider } from "../context/DashboardContext";
import { Toaster } from "sonner";
import Script from "next/script";

export const metadata = {
  title: "Ochiga Smart Estate",
  description: "Smart Estate Dashboard by Ochiga",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Maps API */}
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <AuthProvider>
          <DashboardProvider>
            {children}
            <Toaster richColors position="top-right" />
          </DashboardProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
