export const ROUTES = {
  AUTH: {
    LOGIN: "/(auth)/login",
    COMPLETE_PROFILE: "/(auth)/complete-profile",
  },

  TABS: {
    HOME: "/(tabs)/home",
    PROFILE: "/(tabs)/profile",
    SAFETY: "/(tabs)/safety",
    CHAT: "/(tabs)/chat",
  },

  PROFILE: {
    EDIT: "/profile/edit",
    FAMILY_MEMBERS: "/profile/family-members",

    SOS: {
      INDEX: "/profile/sos",
      COUNTDOWN: "/profile/sos/countdown",
      HISTORY: "/profile/sos/history",
      LIVE_LOCATION_DURATION: "/profile/sos/live-location-duration",
      MESSAGE: "/profile/sos/message",
      TEST: "/profile/sos/test",
    },
  },

  CHAT: {
    CONTACTS: "/chat/contacts",

    ROOM: (chatId: string, name?: string, phone?: string) => ({
      pathname: "/chat/[chatId]" as const,
      params: {
        chatId,
        name,
        phone,
      },
    }),

    GROUP: {
      INDEX: "/chat/group",
      SETUP: "/chat/group/setup",

      INFO: {
        INDEX: "/chat/group/info",
        INVITE: "/chat/group/info/invite",
        MEMBERS: "/chat/group/info/members",
        JOIN_REQUESTS: "/chat/group/info/join-requests",
      },
    },
  },
} as const;
