import api from "@/api/client";

export const createPrivateChat = (targetUserId: string) =>
  api.post("chat/private", { targetUserId });

export const getChats = () => api.get("/chat");

export const getMessages = (chatId: string) =>
  api.get(`/chat/${chatId}/messages`);

export const sendMessage = (chatId: string, text: string) =>
  api.post("/chat/message", { chatId, text });

export const getGroupMessages = () => api.get("/chat/group/messages");

export const sendGroupMessage = (text: string) =>
  api.post("/chat/group/message", { text });
