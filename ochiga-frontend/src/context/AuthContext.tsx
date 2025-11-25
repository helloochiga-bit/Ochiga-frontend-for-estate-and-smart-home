"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "../lib/api";
import { User } from "../data/types";

interface RegisterManagerPayload {
  estateName: string;
  managerName: string;
  managerEmail: string;
  password: string;
}

interface InviteResidentPayload {
  estateId: string;
  houseId: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  loginUser: (email: string, password: string) => Promise<void>;
  registerManager: (data: RegisterManagerPayload) => Promise<void>;
  inviteResident: (data: InviteResidentPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  const loginUser = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await apiRequest("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.token && res.user) {
        setUser(res.user);
        setToken(res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        localStorage.setItem("token", res.token);
        router.push("/dashboard");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err: any) {
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const registerManager = async (data: RegisterManagerPayload) => {
    try {
      await apiRequest("/auth/register-estate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      alert("Estate and manager registered successfully!");
      router.push("/auth");
    } catch (err: any) {
      alert(err.message || "Registration failed");
    }
  };

  const inviteResident = async (data: InviteResidentPayload) => {
    try {
      const res = await apiRequest("/auth/invite-resident", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      });

      if (res.inviteLink) {
        alert(`Resident invited successfully! Activation link:\n${res.inviteLink}`);
      } else {
        alert("Invitation sent successfully.");
      }
    } catch (err: any) {
      alert(err.message || "Resident invitation failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    router.push("/auth");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, loginUser, registerManager, inviteResident, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
