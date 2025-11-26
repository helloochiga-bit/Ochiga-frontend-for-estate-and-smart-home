import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_API_URL!, {
  withCredentials: true,
  transports: ["websocket"], // more stable for Codespaces
});

export default socket;
