import { prisma } from "../prisma/client.js";

export const getOrCreatePrivateChat = async (
  currentUserId: string,
  targetUserId: string,
) => {
  if (currentUserId === targetUserId) {
    throw new Error("Cannot chat with yourself");
  }

  // Generate unique private key
  const privateKey = [currentUserId, targetUserId].sort().join("_");

  // Check if private chat already exists
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

  // Create new private chat
  const chat = await prisma.chat.create({
    data: {
      type: "private",
      privateKey,
      createdById: currentUserId,
      members: {
        create: [
          {
            userId: currentUserId,
          },
          {
            userId: targetUserId,
          },
        ],
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

export const sendMessage = async (
  chatId: string,
  senderId: string,
  text: string,
) => {
  // Check if sender is a member of the chat
  const member = await prisma.chatMember.findFirst({
    where: {
      chatId,
      userId: senderId,
    },
  });

  if (!member) {
    throw new Error("You are not a member of this chat");
  }

  const message = await prisma.message.create({
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
  });

  return message;
};
