import { Server } from "socket.io";
import { Server as HttpServer } from "http";

let io: Server;

/**
 * Track online users:  userId -> Set of socketIds (multiple tabs/devices)
 * Track active rooms:  socketId -> chatId the user is currently viewing
 */
export const onlineUsers = new Map<string, Set<string>>();  // userId -> socketIds
export const activeRoom = new Map<string, string>();         // socketId -> chatId

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    transports: ["websocket"],
  });

  io.on("connection", (socket) => {
    // ── Auth / Presence ────────────────────────────────────────────────

    socket.on("join-user", (userId: string) => {
      socket.join(userId);
      socket.data.userId = userId;

      if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
      onlineUsers.get(userId)!.add(socket.id);
    });

    // ── Chat Room ──────────────────────────────────────────────────────

    socket.on("join-chat", (chatId: string) => {
      socket.join(chatId);
      activeRoom.set(socket.id, chatId);
    });

    socket.on("leave-chat", (chatId: string) => {
      socket.leave(chatId);
      if (activeRoom.get(socket.id) === chatId) {
        activeRoom.delete(socket.id);
      }
    });

    // ── Read receipts ──────────────────────────────────────────────────

    /**
     * Client emits "read-chat" when the user opens a chat room.
     * Payload: { chatId, readerId }
     * We emit "messages-read" to all other members of that chat.
     */
    socket.on("read-chat", ({ chatId, readerId }: { chatId: string; readerId: string }) => {
      // Broadcast to all other sockets in the chat room
      socket.to(chatId).emit("messages-read", { chatId, readerId });
    });

    // ── Disconnect ─────────────────────────────────────────────────────

    socket.on("disconnect", (reason) => {
      const userId = socket.data.userId as string | undefined;
      if (userId) {
        const sids = onlineUsers.get(userId);
        if (sids) {
          sids.delete(socket.id);
          if (sids.size === 0) onlineUsers.delete(userId);
        }
      }
      activeRoom.delete(socket.id);
      console.log(`Socket disconnected: ${socket.id}, Reason: ${reason}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }
  return io;
};

/**
 * Given a list of user IDs that are members of a chat, determine which
 * members are currently viewing that specific chat room (→ "read") vs.
 * online but elsewhere (→ "delivered").
 */
export const getDeliveryStatus = (
  memberUserIds: string[],
  senderId: string,
  chatId: string,
): "read" | "delivered" | "sent" => {
  for (const uid of memberUserIds) {
    if (uid === senderId) continue;
    const sids = onlineUsers.get(uid);
    if (!sids || sids.size === 0) continue;
    // Check if any of this user's sockets are actively in this chat room
    for (const sid of sids) {
      if (activeRoom.get(sid) === chatId) return "read";
    }
    // Online but in a different screen
    return "delivered";
  }
  return "sent";
};
