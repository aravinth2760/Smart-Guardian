import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type MessageStatus = "sent" | "delivered" | "read";

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  status: MessageStatus;
  createdAt: string;
  sender?: {
    id: string;
    name: string | null;
    phone?: string;
  };
}

export interface ChatUser {
  id: string;
  name: string | null;
  phone: string;
}

export interface ChatMember {
  user: ChatUser;
}

export interface PrivateChat {
  id: string;
  type: "private";
  members: ChatMember[];
  messages: ChatMessage[];
}

export interface GroupLastMessage {
  id: string;
  text: string;
  createdAt: string;
  sender: {
    id: string;
    name: string | null;
  };
}

export interface GroupChat {
  id: string;
  name: string;
  inviteEnabled: boolean;
  inviteCode: string | null;
  role: "owner" | "manager" | "member";
  members: GroupMember[];
  lastMessage?: GroupLastMessage | null;
}

export interface GroupMember {
  id: string;
  name: string;
  phone: string;
  role: string;
}

interface ChatState {
  chats: PrivateChat[];
  groupChat: GroupChat | null;
  messages: Record<string, ChatMessage[]>;
  unreadCounts: Record<string, number>;
  lastFetched: Record<string, string>;
  isChatsLoading: boolean;
}

const initialState: ChatState = {
  chats: [],
  groupChat: null,
  messages: {},
  unreadCounts: {},
  lastFetched: {},
  isChatsLoading: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChats(state, action: PayloadAction<PrivateChat[]>) {
      state.chats = action.payload;
    },

    setGroupChat(state, action: PayloadAction<GroupChat | null>) {
      state.groupChat = action.payload;
    },

    setChatsLoading(state, action: PayloadAction<boolean>) {
      state.isChatsLoading = action.payload;
    },

    updateChatLastMessage(
      state,
      action: PayloadAction<{ chatId: string; message: ChatMessage }>,
    ) {
      const { chatId, message } = action.payload;
      const chat = state.chats.find((c) => c.id === chatId);
      if (chat) {
        chat.messages = [message];
      }
    },

    updateGroupLastMessage(state, action: PayloadAction<GroupLastMessage>) {
      if (state.groupChat) {
        state.groupChat.lastMessage = action.payload;
      }
    },

    setMessages(
      state,
      action: PayloadAction<{ chatId: string; messages: ChatMessage[] }>,
    ) {
      const { chatId, messages } = action.payload;
      state.messages[chatId] = messages;
      if (messages.length > 0) {
        state.lastFetched[chatId] = messages[messages.length - 1].createdAt;
      }
    },

    appendMessage(
      state,
      action: PayloadAction<{ chatId: string; message: ChatMessage }>,
    ) {
      const { chatId, message } = action.payload;
      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }
      // Avoid duplicates
      const exists = state.messages[chatId].some((m) => m.id === message.id);
      if (!exists) {
        state.messages[chatId].push(message);
        state.lastFetched[chatId] = message.createdAt;
      }
    },

    updateMessageStatus(
      state,
      action: PayloadAction<{
        chatId: string;
        messageId: string;
        status: MessageStatus;
      }>,
    ) {
      const { chatId, messageId, status } = action.payload;
      const msgs = state.messages[chatId];
      if (msgs) {
        const msg = msgs.find((m) => m.id === messageId);
        if (msg) msg.status = status;
      }
    },

    markChatAsRead(state, action: PayloadAction<string>) {
      const chatId = action.payload;
      const msgs = state.messages[chatId];
      if (msgs) {
        msgs.forEach((m) => {
          if (m.status !== "read") m.status = "read";
        });
      }
      state.unreadCounts[chatId] = 0;
    },

    incrementUnread(state, action: PayloadAction<string>) {
      const chatId = action.payload;
      state.unreadCounts[chatId] = (state.unreadCounts[chatId] ?? 0) + 1;
    },

    clearUnread(state, action: PayloadAction<string>) {
      state.unreadCounts[action.payload] = 0;
    },

    setUnreadCounts(state, action: PayloadAction<Record<string, number>>) {
      state.unreadCounts = action.payload;
    },

    clearChatState() {
      return initialState;
    },
  },
});

export const {
  setChats,
  setGroupChat,
  setChatsLoading,
  updateChatLastMessage,
  updateGroupLastMessage,
  setMessages,
  appendMessage,
  updateMessageStatus,
  markChatAsRead,
  incrementUnread,
  clearUnread,
  setUnreadCounts,
  clearChatState,
} = chatSlice.actions;

export default chatSlice.reducer;
