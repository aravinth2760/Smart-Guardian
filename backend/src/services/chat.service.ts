import { prisma } from "../prisma/client.js";
import { getIO } from "../socket.js";

// Create or Get Private Chat
export const getOrCreatePrivateChat = async (
  currentUserId: string,
  targetUserId: string,
) => {
  if (currentUserId === targetUserId) {
    throw new Error("Cannot chat with yourself");
  }

  const privateKey = [currentUserId, targetUserId].sort().join("_");

  const existingChat = await prisma.chat.findUnique({
    where: {
      privateKey,
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  });

  if (existingChat) {
    return existingChat;
  }

  const chat = await prisma.chat.create({
    data: {
      type: "private",
      privateKey,
      createdById: currentUserId,
      members: {
        create: [{ userId: currentUserId }, { userId: targetUserId }],
      },
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  });

  return chat;
};

// Send Message
export const sendMessage = async (
  chatId: string,
  senderId: string,
  text: string,
) => {
  const member = await prisma.chatMember.findFirst({
    where: {
      chatId,
      userId: senderId,
    },
  });

  if (!member) {
    throw new Error("You are not a member of this chat");
  }

  const [message] = await prisma.$transaction([
    prisma.message.create({
      data: {
        chatId,
        senderId,
        text,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
    }),

    prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        updatedAt: new Date(),
      },
    }),
  ]);

  // Real-time event
  const io = getIO();
  io.to(chatId).emit("new-message", message);

  return message;
};

// Get User Chats
export const getUserChats = async (userId: string) => {
  return prisma.chat.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
        },
      },
      messages: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        include: {
          sender: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
};

// Get Chat Messages
export const getMessages = async (
  chatId: string,
  userId: string,
  page = 1,
  limit = 20,
) => {
  const member = await prisma.chatMember.findFirst({
    where: {
      chatId,
      userId,
    },
  });

  if (!member) {
    throw new Error("You are not a member of this chat");
  }

  const skip = (page - 1) * limit;

  const messages = await prisma.message.findMany({
    where: {
      chatId,
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          phone: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    skip,
    take: limit,
  });

  return messages.reverse();
};
