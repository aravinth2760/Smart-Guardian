import { prisma } from "../prisma/client.js";
import { getIO } from "../socket.js";
import { generateInviteCode } from "../utils/inviteCode.js";

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
      type: "private",
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

export const createGroupService = async (userId: string) => {
  const existingGroup = await prisma.chat.findFirst({
    where: {
      createdById: userId,
      type: "group",
    },
  });

  if (existingGroup) {
    throw new Error("Safety Circle already exists.");
  }

  let inviteCode: string;

  while (true) {
    inviteCode = generateInviteCode();

    const exists = await prisma.chat.findUnique({
      where: { inviteCode },
    });

    if (!exists) break;
  }

  return prisma.$transaction(async (tx) => {
    const chat = await tx.chat.create({
      data: {
        type: "group",
        name: "Safety Circle",
        inviteCode,
        inviteEnabled: false,
        createdById: userId,
      },
    });

    await tx.chatMember.create({
      data: {
        chatId: chat.id,
        userId,
        role: "owner",
      },
    });

    return chat;
  });
};

export const getMyGroupService = async (userId: string) => {
  const member = await prisma.chatMember.findFirst({
    where: {
      userId,
      chat: {
        type: "group",
      },
    },

    include: {
      chat: {
        include: {
          members: {
            include: {
              user: true,
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
      },
    },
  });

  if (!member) {
    throw new Error("You are not part of any Safety Circle");
  }

  const lastMessage = member.chat.messages[0];

  return {
    id: member.chat.id,
    name: member.chat.name,
    inviteEnabled: member.chat.inviteEnabled,
    inviteCode: member.chat.inviteCode,
    role: member.role,
    lastMessage: lastMessage
      ? {
          id: lastMessage.id,
          text: lastMessage.text,
          createdAt: lastMessage.createdAt,
          sender: {
            id: lastMessage.sender.id,
            name: lastMessage.sender.name,
          },
        }
      : null,
    members: member.chat.members.map((m) => ({
      id: m.user.id,
      name: m.user.name,
      phone: m.user.phone,
      role: m.role,
    })),
  };
};

export const enableInviteService = async (userId: string) => {
  const member = await prisma.chatMember.findFirst({
    where: {
      userId,

      chat: {
        type: "group",
      },

      role: "owner",
    },

    include: {
      chat: true,
    },
  });

  if (!member) {
    throw new Error("Only group owner can enable invite");
  }

  const updated = await prisma.chat.update({
    where: {
      id: member.chatId,
    },

    data: {
      inviteEnabled: true,
    },
  });

  return {
    inviteEnabled: updated.inviteEnabled,
  };
};

export const disableInviteService = async (userId: string) => {
  const member = await prisma.chatMember.findFirst({
    where: {
      userId,

      chat: {
        type: "group",
      },

      role: "owner",
    },
  });

  if (!member) {
    throw new Error("Only group owner can disable invite");
  }

  const updated = await prisma.chat.update({
    where: {
      id: member.chatId,
    },

    data: {
      inviteEnabled: false,
    },
  });

  return {
    inviteEnabled: updated.inviteEnabled,
  };
};

export const regenerateInviteCodeService = async (userId: string) => {
  const member = await prisma.chatMember.findFirst({
    where: {
      userId,

      chat: {
        type: "group",
      },

      role: "owner",
    },
  });

  if (!member) {
    throw new Error("Only group owner can regenerate invite code");
  }

  let newCode: string;

  while (true) {
    newCode = generateInviteCode();

    const exists = await prisma.chat.findUnique({
      where: {
        inviteCode: newCode,
      },
    });

    if (!exists) {
      break;
    }
  }

  const updated = await prisma.chat.update({
    where: {
      id: member.chatId,
    },

    data: {
      inviteCode: newCode,
    },
  });

  return {
    inviteCode: updated.inviteCode,
  };
};

export const joinGroupService = async (userId: string, inviteCode: string) => {
  const chat = await prisma.chat.findUnique({
    where: {
      inviteCode,
    },
  });

  if (!chat) {
    throw new Error("Invalid invite code");
  }

  if (!chat.inviteEnabled) {
    throw new Error("Invite is disabled");
  }

  const existingMember = await prisma.chatMember.findUnique({
    where: {
      chatId_userId: {
        chatId: chat.id,
        userId,
      },
    },
  });

  if (existingMember) {
    throw new Error("Already a group member");
  }

  const existingRequest = await prisma.joinRequest.findFirst({
    where: {
      chatId: chat.id,
      userId,
      status: "pending",
    },
  });

  if (existingRequest) {
    throw new Error("Join request already exists");
  }

  const request = await prisma.joinRequest.create({
    data: {
      chatId: chat.id,
      userId,
    },
  });

  return request;
};

export const getJoinRequestsService = async (userId: string) => {
  const ownerGroup = await prisma.chatMember.findFirst({
    where: {
      userId,

      role: "owner",

      chat: {
        type: "group",
      },
    },
  });

  if (!ownerGroup) {
    throw new Error("Only group owner can view requests");
  }

  const requests = await prisma.joinRequest.findMany({
    where: {
      chatId: ownerGroup.chatId,

      status: "pending",
    },

    include: {
      user: {
        select: {
          id: true,
          name: true,
          phone: true,
        },
      },
    },

    orderBy: {
      requestedAt: "desc",
    },
  });

  return requests;
};

export const approveJoinRequestService = async (
  ownerId: string,
  requestId: string,
) => {
  const ownerGroup = await prisma.chatMember.findFirst({
    where: {
      userId: ownerId,
      role: "owner",
      chat: {
        type: "group",
      },
    },
  });

  if (!ownerGroup) {
    throw new Error("Only group owner can approve requests");
  }

  const request = await prisma.joinRequest.findUnique({
    where: {
      id: requestId,
    },
  });

  if (!request) {
    throw new Error("Join request not found");
  }

  if (request.chatId !== ownerGroup.chatId) {
    throw new Error("Invalid join request");
  }

  const existingMember = await prisma.chatMember.findUnique({
    where: {
      chatId_userId: {
        chatId: request.chatId,
        userId: request.userId,
      },
    },
  });

  if (existingMember) {
    throw new Error("User is already a group member");
  }

  await prisma.$transaction(async (tx) => {
    await tx.chatMember.create({
      data: {
        chatId: request.chatId,
        userId: request.userId,
        role: "member",
      },
    });

    await tx.joinRequest.delete({
      where: {
        id: requestId,
      },
    });
  });

  return {
    message: "Join request approved successfully.",
  };
};

export const rejectJoinRequestService = async (
  ownerId: string,
  requestId: string,
) => {
  const ownerGroup = await prisma.chatMember.findFirst({
    where: {
      userId: ownerId,
      role: "owner",
      chat: {
        type: "group",
      },
    },
  });

  if (!ownerGroup) {
    throw new Error("Only group owner can reject requests");
  }

  const request = await prisma.joinRequest.findUnique({
    where: {
      id: requestId,
    },
  });

  if (!request) {
    throw new Error("Join request not found");
  }

  if (request.chatId !== ownerGroup.chatId) {
    throw new Error("Invalid join request");
  }

  await prisma.joinRequest.delete({
    where: {
      id: requestId,
    },
  });

  return {
    message: "Join request rejected successfully.",
  };
};

export const getGroupMembersService = async (userId: string) => {
  const member = await prisma.chatMember.findFirst({
    where: {
      userId,

      chat: {
        type: "group",
      },
    },
  });

  if (!member) {
    throw new Error("You are not part of any Safety Circle");
  }

  const members = await prisma.chatMember.findMany({
    where: {
      chatId: member.chatId,
    },

    include: {
      user: {
        select: {
          id: true,
          name: true,
          phone: true,
        },
      },
    },

    orderBy: {
      joinedAt: "asc",
    },
  });

  return members.map((item) => ({
    id: item.user.id,
    name: item.user.name,
    phone: item.user.phone,
    role: item.role,
    joinedAt: item.joinedAt,
  }));
};

export const removeGroupMemberService = async (
  ownerId: string,
  removeUserId: string,
) => {
  const ownerMember = await prisma.chatMember.findFirst({
    where: {
      userId: ownerId,

      role: "owner",

      chat: {
        type: "group",
      },
    },
  });

  if (!ownerMember) {
    throw new Error("Only group owner can remove members");
  }

  if (ownerId === removeUserId) {
    throw new Error("Owner cannot remove himself");
  }

  const targetMember = await prisma.chatMember.findUnique({
    where: {
      chatId_userId: {
        chatId: ownerMember.chatId,
        userId: removeUserId,
      },
    },
  });

  if (!targetMember) {
    throw new Error("Member not found");
  }

  if (targetMember.role === "owner") {
    throw new Error("Cannot remove owner");
  }

  await prisma.chatMember.delete({
    where: {
      id: targetMember.id,
    },
  });

  return {
    removedUserId: removeUserId,
  };
};

export const transferOwnerService = async (
  ownerId: string,
  newOwnerId: string,
) => {
  const owner = await prisma.chatMember.findFirst({
    where: {
      userId: ownerId,

      role: "owner",

      chat: {
        type: "group",
      },
    },
  });

  if (!owner) {
    throw new Error("Only owner can transfer ownership");
  }

  if (ownerId === newOwnerId) {
    throw new Error("Already owner");
  }

  const newOwner = await prisma.chatMember.findUnique({
    where: {
      chatId_userId: {
        chatId: owner.chatId,
        userId: newOwnerId,
      },
    },
  });

  if (!newOwner) {
    throw new Error("User is not a group member");
  }

  await prisma.$transaction([
    prisma.chatMember.update({
      where: {
        id: owner.id,
      },

      data: {
        role: "member",
      },
    }),

    prisma.chatMember.update({
      where: {
        id: newOwner.id,
      },

      data: {
        role: "owner",
      },
    }),
  ]);

  return {
    previousOwner: ownerId,
    newOwner: newOwnerId,
  };
};

export const leaveGroupService = async (userId: string) => {
  const member = await prisma.chatMember.findFirst({
    where: {
      userId,

      chat: {
        type: "group",
      },
    },
  });

  if (!member) {
    throw new Error("You are not a group member");
  }

  if (member.role === "owner") {
    throw new Error("Owner cannot leave. Transfer ownership first.");
  }

  await prisma.chatMember.delete({
    where: {
      id: member.id,
    },
  });

  return {
    userId,
  };
};

export const getGroupMessagesService = async (userId: string) => {
  console.log("Inside come");
  const member = await prisma.chatMember.findFirst({
    where: {
      userId,

      chat: {
        type: "group",
      },
    },
  });

  if (!member) {
    throw new Error("You are not a group member");
  }

  const messages = await prisma.message.findMany({
    where: {
      chatId: member.chatId,
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
      createdAt: "asc",
    },
  });

  console.log("Members : ", messages);

  return messages;
};

export const sendGroupMessageService = async (userId: string, text: string) => {
  const member = await prisma.chatMember.findFirst({
    where: {
      userId,

      chat: {
        type: "group",
      },
    },
  });

  if (!member) {
    throw new Error("You are not a group member");
  }

  if (!text || !text.trim()) {
    throw new Error("Message cannot be empty");
  }

  const message = await prisma.message.create({
    data: {
      chatId: member.chatId,
      senderId: userId,
      text: text.trim(),
    },

    include: {
      sender: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return message;
};
