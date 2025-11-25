// src/app/estate-dashboard/services/dashboardService.ts

import { createClient } from "@supabase/supabase-js";

// -------------------------------
// SUPABASE CLIENT
// -------------------------------
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// -------------------------------
// GENERIC WRAPPER
// -------------------------------
async function handle<T>(promise: Promise<any>): Promise<T> {
  const { data, error } = await promise;
  if (error) throw new Error(error.message);
  return data as T;
}

// -------------------------------
// TYPES
// -------------------------------
export type Resident = {
  id: string;
  email: string;
  username?: string;
  role?: string;
  created_at?: string;
  estate_id?: string;
  home_id?: string;
};

export type Home = {
  id: string;
  name: string;
  estate_id: string;
  created_at?: string;
};

export type Estate = {
  id: string;
  name: string;
  address?: string;
  created_at?: string;
};

export type Device = {
  id: string;
  name: string;
  type: string;
  status: string;
  estate_id?: string;
  home_id?: string;
  created_at?: string;
};

export type ActivityLog = {
  id: string;
  action: string;
  user_id?: string;
  created_at?: string;
};

export type Alert = {
  id: string;
  title: string;
  level: string;
  message: string;
  created_at?: string;
};

// -------------------------------
// RESIDENTS MODULE
// -------------------------------
export const residentsAPI = {
  list: async (estate_id: string) =>
    handle<Resident[]>(
      supabase
        .from("users")
        .select("*")
        .eq("estate_id", estate_id)
        .order("created_at", { ascending: false })
        .throwOnError()
    ),

  invite: async (email: string, estate_id: string) =>
    handle<Resident>(
      supabase
        .from("users")
        .insert([{ email, estate_id, role: "resident" }])
        .select()
        .single()
        .throwOnError()
    ),

  remove: async (id: string) =>
    handle(
      supabase
        .from("users")
        .delete()
        .eq("id", id)
        .throwOnError()
    ),
};

// -------------------------------
// DEVICES MODULE
// -------------------------------
export const devicesAPI = {
  list: async (estate_id: string) =>
    handle<Device[]>(
      supabase
        .from("devices")
        .select("*")
        .eq("estate_id", estate_id)
        .order("created_at", { ascending: false })
        .throwOnError()
    ),

  toggle: async (id: string, status: string) =>
    handle(
      supabase
        .from("devices")
        .update({ status })
        .eq("id", id)
        .select()
        .single()
        .throwOnError()
    ),

  remove: async (id: string) =>
    handle(
      supabase
        .from("devices")
        .delete()
        .eq("id", id)
        .throwOnError()
    ),
};

// -------------------------------
// ESTATE MODULE
// -------------------------------
export const estateAPI = {
  get: async (estate_id: string) =>
    handle<Estate>(
      supabase
        .from("estates")
        .select("*")
        .eq("id", estate_id)
        .single()
        .throwOnError()
    ),
};

// -------------------------------
// HOMES MODULE
// -------------------------------
export const homesAPI = {
  list: async (estate_id: string) =>
    handle<Home[]>(
      supabase
        .from("homes")
        .select("*")
        .eq("estate_id", estate_id)
        .order("created_at", { ascending: false })
        .throwOnError()
    ),
};

// -------------------------------
// ACTIVITY LOGS
// -------------------------------
export const logsAPI = {
  list: async (estate_id: string) =>
    handle<ActivityLog[]>(
      supabase
        .from("activity_logs")
        .select("*")
        .eq("estate_id", estate_id)
        .order("created_at", { ascending: false })
        .throwOnError()
    ),
};

// -------------------------------
// ALERTS / SECURITY
// -------------------------------
export const alertAPI = {
  list: async (estate_id: string) =>
    handle<Alert[]>(
      supabase
        .from("alerts")
        .select("*")
        .eq("estate_id", estate_id)
        .order("created_at", { ascending: false })
        .throwOnError()
    ),
};
