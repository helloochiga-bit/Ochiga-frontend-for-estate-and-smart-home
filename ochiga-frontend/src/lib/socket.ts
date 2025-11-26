// ochiga-frontend/src/lib/socket.ts
import { io, Socket } from "socket.io-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined"
    ? window.location.origin.replace("3000", "5000") // fallback for Codespaces
    : "");

export const socket: Socket = io(API_URL, {
  withCredentials: true,
  transports: ["websocket"],
  reconnection: true,
  reconnectionDelay: 500,
  reconnectionAttempts: 10,
});

export default socket;
