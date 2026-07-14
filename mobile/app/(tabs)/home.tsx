import { Alert, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { router, useSegments } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";

import HomeHeader from "@/components/home/HomeHeader";
import GuardiansList from "@/components/home/HomeGuardians";
import HomeChat from "@/components/home/HomeChat";

import { sendSOSAlertApi } from "@/services/chat.service";
import { socket } from "@/services/socket";
import { incrementUnread, appendMessage } from "@/store/slices/chatSlice";
import { ROUTES } from "@/constants/routes";
import colors from "@/constants/colors";

export default function HomeScreen() {
  const [sendingAlert, setSendingAlert] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const userName = useSelector((state: RootState) => state.auth.user?.name);
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);
  const group = useSelector((state: RootState) => state.chat.groupChat);
  const groupUnread = useSelector((state: RootState) =>
    group ? (state.chat.unreadCounts[group.id] ?? 0) : 0,
  );

  const segments = useSegments();
  const activeTab = segments[1];

  // ── SOS handler ────────────────────────────────────────────────────────────

  const handleSOSPress = useCallback(() => {
    Alert.alert(
      "🚨 Emergency SOS",
      "This will send an emergency alert to your entire Safety Circle. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send SOS",
          style: "destructive",
          onPress: async () => {
            try {
              setSendingAlert(true);
              await sendSOSAlertApi();
              Alert.alert(
                "✅ SOS Sent",
                "Your Safety Circle has been alerted.",
              );
            } catch (error) {
              Alert.alert(
                "Error",
                "Failed to send SOS alert. Please try again.",
              );
            } finally {
              setSendingAlert(false);
            }
          },
        },
      ],
    );
  }, []);

  // ── Real-time: increment group unread on new messages while NOT in group ──

  useEffect(() => {
    if (!group?.id) return;

    const handleNewMessage = (msg: any) => {
      if (msg?.chatId !== group.id) return;
      if (msg?.senderId === currentUserId) return;
      // Only increment if user isn't currently on the group chat screen
      dispatch(incrementUnread(group.id));
      dispatch(appendMessage({ chatId: group.id, message: msg }));
    };

    socket.on("new-message", handleNewMessage);
    return () => {
      socket.off("new-message", handleNewMessage);
    };
  }, [group?.id, currentUserId, dispatch]);

  // ── Guardians (group members from Redux) ──────────────────────────────────

  const groupMembers = (group as any)?.members ?? [];
  const guardians = groupMembers
    .filter((m: any) => m.id !== currentUserId)
    .map((m: any) => ({
      id: m.id,
      name: m.name ?? m.phone ?? "Unknown",
      phone: m.phone ?? "",
      relationship: m.relationship ?? m.role ?? "",
    }));

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <StatusBar
        barStyle={activeTab === "home" ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />
      <HomeHeader
        userName={userName as string}
        onSOSPress={handleSOSPress}
        sendingAlert={sendingAlert}
      />
      <HomeChat groupUnread={groupUnread} />
      <GuardiansList contacts={guardians} />
    </ScrollView>
  );
}
