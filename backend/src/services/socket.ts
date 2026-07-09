import { io } from "socket.io-client";

export const socket = io("http://YOUR_SERVER_IP:5001", {
  transports: ["websocket"],
});
