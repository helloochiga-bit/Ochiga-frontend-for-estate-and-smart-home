// ochiga-frontend/src/context/DashboardContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// ------------------------
// Types
// ------------------------
interface Resident {
  name: string;
  estate: string;
  phase?: string;
  address: string;
}

interface Wallet {
  balance: number;
}

interface Utilities {
  internet: boolean;
  power: boolean;
  water: number; // e.g., tank level %
}

interface DeviceState {
  light: boolean;
  fan: boolean;
  ac?: boolean;
}

interface Devices {
  [room: string]: DeviceState;
}

interface Visitor {
  id: string;
  name: string;
  scheduledTime: string;
}

interface CommunityEvent {
  id: string;
  title: string;
  time: string;
}

interface DashboardContextProps {
  notifications: string[];
  hasNewNotif: boolean;
  sidebarOpen: boolean;
  profileOpen: boolean;
  searchOpen: boolean;

  resident: Resident;
  wallet: Wallet;
  utilities: Utilities;
  devices: Devices;
  visitors: Visitor[];
  communityEvents: CommunityEvent[];

  addNotification: (msg: string) => void;
  markNotifRead: () => void;
  toggleSidebar: () => void;
  toggleProfile: () => void;
  toggleSearch: () => void;

  // AI / device actions
  updateWallet: (amount: number) => void;
  toggleDevice: (room: string, device: keyof DeviceState) => void;
  updateUtility: (key: keyof Utilities, value: any) => void;
  addVisitor: (visitor: Visitor) => void;
  removeVisitor: (visitorId: string) => void;
  addCommunityEvent: (event: CommunityEvent) => void;
  removeCommunityEvent: (eventId: string) => void;
  updateResident: (resident: Partial<Resident>) => void;
}

// ------------------------
// Context
// ------------------------
const DashboardContext = createContext<DashboardContextProps | undefined>(undefined);

// ------------------------
// Provider
// ------------------------
export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  // Notifications & UI state
  const [notifications, setNotifications] = useState<string[]>([]);
  const [hasNewNotif, setHasNewNotif] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Resident info
  const [resident, setResident] = useState<Resident>({
    name: "John Doe",
    estate: "Ochiga Estate",
    phase: "Phase 1",
    address: "12 Sunrise Avenue",
  });

  // Wallet & Utilities
  const [wallet, setWallet] = useState<Wallet>({ balance: 42300 });
  const [utilities, setUtilities] = useState<Utilities>({
    internet: true,
    power: true,
    water: 80,
  });

  // Devices
  const [devices, setDevices] = useState<Devices>({
    "Living Room": { light: false, fan: false, ac: false },
    Bedroom: { light: false, fan: false, ac: false },
    Kitchen: { light: false, fan: false, ac: false },
  });

  // Visitors & community events
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [communityEvents, setCommunityEvents] = useState<CommunityEvent[]>([]);

  // ------------------------
  // Notification actions
  // ------------------------
  const addNotification = (msg: string) => {
    setNotifications((prev) => [msg, ...prev]);
    setHasNewNotif(true);
  };

  const markNotifRead = () => setHasNewNotif(false);

  // ------------------------
  // UI toggle actions
  // ------------------------
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const toggleProfile = () => setProfileOpen((prev) => !prev);
  const toggleSearch = () => setSearchOpen((prev) => !prev);

  // ------------------------
  // AI / device actions
  // ------------------------
  const updateWallet = (amount: number) => {
    setWallet((prev) => ({ balance: prev.balance + amount }));
    addNotification(`Wallet updated: ₦${amount}`);
  };

  const toggleDevice = (room: string, device: keyof DeviceState) => {
    setDevices((prev) => ({
      ...prev,
      [room]: { ...prev[room], [device]: !prev[room][device] },
    }));
    addNotification(`Toggled ${device} in ${room}`);
  };

  const updateUtility = (key: keyof Utilities, value: any) => {
    setUtilities((prev) => ({ ...prev, [key]: value }));
    addNotification(`Updated ${key} to ${value}`);
  };

  const addVisitor = (visitor: Visitor) => {
    setVisitors((prev) => [...prev, visitor]);
    addNotification(`Added visitor ${visitor.name}`);
  };

  const removeVisitor = (visitorId: string) => {
    setVisitors((prev) => prev.filter((v) => v.id !== visitorId));
    addNotification(`Removed visitor ${visitorId}`);
  };

  const addCommunityEvent = (event: CommunityEvent) => {
    setCommunityEvents((prev) => [...prev, event]);
    addNotification(`Added community event ${event.title}`);
  };

  const removeCommunityEvent = (eventId: string) => {
    setCommunityEvents((prev) => prev.filter((e) => e.id !== eventId));
    addNotification(`Removed community event ${eventId}`);
  };

  const updateResident = (updates: Partial<Resident>) => {
    setResident((prev) => ({ ...prev, ...updates }));
    addNotification(`Resident info updated`);
  };

  return (
    <DashboardContext.Provider
      value={{
        notifications,
        hasNewNotif,
        sidebarOpen,
        profileOpen,
        searchOpen,
        resident,
        wallet,
        utilities,
        devices,
        visitors,
        communityEvents,
        addNotification,
        markNotifRead,
        toggleSidebar,
        toggleProfile,
        toggleSearch,
        updateWallet,
        toggleDevice,
        updateUtility,
        addVisitor,
        removeVisitor,
        addCommunityEvent,
        removeCommunityEvent,
        updateResident,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

// ------------------------
// Custom hook
// ------------------------
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) throw new Error("useDashboard must be used within DashboardProvider");
  return context;
};
