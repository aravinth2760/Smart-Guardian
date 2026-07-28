import { Alert, ScrollView, StatusBar, RefreshControl } from "react-native";
import { useSegments } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";

import HomeHeader from "@/components/home/HomeHeader";
import GuardiansList from "@/components/home/HomeGuardians";
import HomeChat from "@/components/home/HomeChat";

import { sendSOSAlertApi, getChats } from "@/services/chat.service";
import { getMyGroup } from "@/services/group.service";
import { setChats, setGroupChat } from "@/store/slices/chatSlice";
import { chatCache } from "@/storage/chatCache";

export default function HomeScreen() {
  const [sendingAlert, setSendingAlert] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const userName = useSelector((state: RootState) => state.auth.user?.name);
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);
  const group = useSelector((state: RootState) => state.chat.groupChat);
  const groupUnread = useSelector((state: RootState) =>
    group ? (state.chat.unreadCounts[group.id] ?? 0) : 0,
  );

  const segments = useSegments();
  const activeTab = segments[1];
  const hasOtherMembers = (group?.members?.length ?? 0) > 1;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const [chatsRes, groupRes] = await Promise.all([
        getChats().catch(() => ({ data: { data: [] } })),
        getMyGroup().catch(() => ({ data: null })),
      ]);

      const chats = chatsRes.data?.data ?? [];
      const groupData = groupRes.data?.data ?? groupRes.data ?? null;

      dispatch(setChats(chats));
      dispatch(setGroupChat(groupData));

      await Promise.all([
        chatCache.saveChats(chats),
        chatCache.saveGroup(groupData),
      ]);
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  // ── SOS handler ────────────────────────────────────────────────────────────

  const handleSOSPress = useCallback(() => {
    if (!group?.id) {
      Alert.alert(
        "No Safety Circle",
        "You haven't created or joined a Safety Circle yet.",
      );
      return;
    }

    if (!group.members || !hasOtherMembers) {
      Alert.alert(
        "No Members",
        "Add family members and guardians to your Safety Circle before sending an SOS alert.",
      );
      return;
    }
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
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <StatusBar
        barStyle={activeTab === "home" ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />
      <HomeHeader
        userName={userName as string}
        onSOSPress={handleSOSPress}
        sendingAlert={sendingAlert}
        groupId={group?.id}
        groupMember={groupMembers.length}
      />
      <HomeChat
        groupId={group?.id}
        groupMember={groupMembers.length}
        groupUnread={groupUnread}
      />
      <GuardiansList contacts={guardians} />
    </ScrollView>
  );
}
