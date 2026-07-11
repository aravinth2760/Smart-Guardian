import { Server } from "socket.io";
import { Server as HttpServer } from "http";

let io: Server;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("join-user", (userId: string) => socket.join(userId));
    socket.on("join-chat", (chatId: string) => socket.join(chatId));
    socket.on("leave-chat", (chatId: string) => socket.leave(chatId));
    socket.on("disconnect", (reason) =>
      console.log(`Socket disconnected: ${socket.id}, Reason: ${reason}`),
    );
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }

  return io;
};
