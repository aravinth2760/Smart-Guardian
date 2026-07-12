import { useCallback, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import {
  ChevronRight,
  LogOut,
  Shield,
  Trash2,
  UserCheck,
  Users,
} from "lucide-react-native";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

import ScreenHeader from "@/components/common/ScreenHeader";
import colors from "@/constants/colors";
import { RootState } from "@/store";
import { getMyGroup, leaveGroup, deleteGroup } from "@/services/group.service";

export default function GroupInfoScreen() {
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);

  const [role, setRole] = useState<string>("member");

  const loadGroupInfo = async () => {
    try {
      const res = await getMyGroup();

      const currentMember = res.data.members.find(
        (member: { id: string; role: string }) => member.id === currentUserId,
      );
      setRole(currentMember?.role ?? "member");
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      void loadGroupInfo();
    }, []),
  );

  const handleLeaveGroup = () => {
    if (role === "owner") {
      Alert.alert(
        "Cannot Leave Safety Circle",
        "You are the owner of this Safety Circle. Transfer ownership to another member before leaving.",
      );

      return;
    }

    Alert.alert(
      "Leave Safety Circle",
      "Are you sure you want to leave this Safety Circle?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Leave",
          style: "destructive",
          onPress: async () => {
            try {
              await leaveGroup();

              router.dismissAll();
              router.replace("/(tabs)/chat");
            } catch (error: any) {
              Alert.alert(
                "Unable to Leave",
                error?.response?.data?.message ?? "Something went wrong.",
              );
            }
          },
        },
      ],
    );
  };

  const handleDeleteGroup = () => {
    Alert.alert(
      "Delete Safety Circle",
      "This will permanently delete the Safety Circle, remove all members, messages, and data. This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteGroup();

              router.dismissAll();
              router.replace("/(tabs)/chat");
            } catch (error: any) {
              Alert.alert(
                "Unable to Delete",
                error?.response?.data?.message ?? "Something went wrong.",
              );
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Safety Circle"
        subtitle="Manage your trusted family"
      />

      <Text style={styles.sectionTitle}>GROUP SETTINGS</Text>

      <MenuCard
        icon={<Users size={20} color={colors.light.primary} />}
        title="Members"
        subtitle="View and manage members"
        onPress={() => router.push("/group/members")}
      />

      <MenuCard
        icon={<Shield size={20} color={colors.light.primary} />}
        title="Invite Settings"
        subtitle="Manage invite code"
        onPress={() => router.push("/group/invite")}
      />

      {role === "owner" && (
        <MenuCard
          icon={<UserCheck size={20} color={colors.light.primary} />}
          title="Join Requests"
          subtitle="Approve pending requests"
          onPress={() => router.push("/group/join-requests")}
        />
      )}

      <MenuCard
        icon={<LogOut size={20} color={colors.light.emergency} />}
        title="Leave Safety Circle"
        subtitle="Exit this family group"
        danger
        onPress={handleLeaveGroup}
      />

      {role === "owner" && (
        <MenuCard
          icon={<Trash2 size={20} color={colors.light.emergency} />}
          title="Delete Safety Circle"
          subtitle="Permanently delete this Safety Circle"
          danger
          onPress={handleDeleteGroup}
        />
      )}
    </SafeAreaView>
  );
}

type Props = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
  danger?: boolean;
};

function MenuCard({ icon, title, subtitle, onPress, danger }: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.left}>
        <View
          style={[styles.iconContainer, danger && styles.dangerIconContainer]}
        >
          {icon}
        </View>

        <View style={styles.content}>
          <Text
            style={[
              styles.cardTitle,
              danger && { color: colors.light.emergency },
            ]}
          >
            {title}
          </Text>

          <Text style={styles.cardSubtitle}>{subtitle}</Text>
        </View>
      </View>

      <ChevronRight size={18} color={colors.light.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
    paddingHorizontal: 20,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.light.textSecondary,
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },

  card: {
    backgroundColor: colors.light.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.light.cardBorder,
    padding: 16,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  content: {
    flex: 1,
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#EEF4FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  dangerIconContainer: {
    backgroundColor: "#FFE9E9",
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.light.text,
  },

  cardSubtitle: {
    marginTop: 3,
    fontSize: 13,
    color: colors.light.textSecondary,
  },
});
