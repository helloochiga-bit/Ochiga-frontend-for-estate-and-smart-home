// ochiga-frontend/src/lib/socket.ts
import { io } from "socket.io-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined"
    ? window.location.origin.replace("3000", "5000")
    : "");

console.log("SOCKET_URL:", API_URL);

const socket = io(API_URL, {
  withCredentials: true,
  transports: ["websocket"],
});

export default socket;
