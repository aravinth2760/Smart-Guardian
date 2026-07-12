import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useSelector } from "react-redux";

import colors from "@/constants/colors";

import ScreenContainer from "@/components/common/ScreenContainer";
import ScreenHeader from "@/components/common/ScreenHeader";

import { RootState } from "@/store";

import {
  getGroupMembers,
  removeGroupMember,
  transferOwner,
} from "@/services/group.service";

type Member = {
  id: string;
  name: string | null;
  phone: string;
  role: "owner" | "manager" | "member";
  joinedAt: string;
};

export default function MembersScreen() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);

  useEffect(() => {
    void loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const res = await getGroupMembers();

      setMembers(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const currentUser = members.find((member) => member.id === currentUserId);
  const isOwner = currentUser?.role === "owner";

  const handleRemove = (member: Member) => {
    Alert.alert(
      "Remove Member",
      `Remove ${member.name ?? member.phone} from Safety Circle?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await removeGroupMember(member.id);

              setMembers((prev) => prev.filter((m) => m.id !== member.id));
            } catch (err) {
              console.log(err);
            }
          },
        },
      ],
    );
  };

  const handleTransfer = (member: Member) => {
    Alert.alert(
      "Transfer Ownership",
      `Transfer ownership to ${member.name ?? member.phone}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Transfer",
          onPress: async () => {
            try {
              await transferOwner(member.id);

              loadMembers();
            } catch (err) {
              console.log(err);
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <ScreenContainer>
        <ActivityIndicator size="large" color={colors.light.primary} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScreenHeader title="Members" />
      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadMembers}
            tintColor={colors.light.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No members found</Text>
            <Text style={styles.emptySubtitle}>
              This Safety Circle has no members yet.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const isMe = item.id === currentUserId;

          return (
            <View style={[styles.card, isMe && styles.myCard]}>
              <View style={{ flex: 1 }}>
                <View style={styles.nameRow}>
                  <Text style={styles.name}>
                    {item.name ?? item.phone}
                    {isMe && " (You)"}
                  </Text>

                  <View
                    style={[
                      styles.roleBadge,
                      item.role === "owner" && styles.ownerBadge,
                      item.role === "manager" && styles.managerBadge,
                    ]}
                  >
                    <Text style={styles.roleText}>
                      {item.role.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <Text style={styles.phone}>{item.phone}</Text>

                <Text style={styles.joined}>
                  Joined {new Date(item.joinedAt).toLocaleDateString()}
                </Text>
                {isOwner && !isMe && item.role !== "owner" && (
                  <View style={styles.actionRow}>
                    <Pressable
                      style={styles.transferButton}
                      onPress={() => handleTransfer(item)}
                    >
                      <Text style={styles.transferText}>Transfer Owner</Text>
                    </Pressable>

                    <Pressable
                      style={styles.removeButton}
                      onPress={() => handleRemove(item)}
                    >
                      <Text style={styles.removeText}>Remove</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            </View>
          );
        }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
    padding: 16,
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.light.background,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.light.text,
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 80,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.light.text,
  },

  emptySubtitle: {
    marginTop: 6,
    color: colors.light.textSecondary,
    textAlign: "center",
  },

  card: {
    backgroundColor: colors.light.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  myCard: {
    borderWidth: 2,
    borderColor: colors.light.primary,
  },

  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  joined: {
    marginTop: 6,
    fontSize: 12,
    color: colors.light.textSecondary,
  },

  ownerBadge: {
    backgroundColor: "#FFE9A8",
  },

  managerBadge: {
    backgroundColor: "#DDEBFF",
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.light.text,
  },

  phone: {
    marginTop: 4,
    color: colors.light.textSecondary,
  },

  roleBadge: {
    backgroundColor: colors.light.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  roleText: {
    color: colors.light.primary,
    fontWeight: "700",
    fontSize: 12,
  },

  actionRow: {
    flexDirection: "row",
    marginTop: 12,
  },

  transferButton: {
    backgroundColor: colors.light.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 10,
  },

  transferText: {
    color: colors.light.primary,
    fontWeight: "600",
  },

  removeButton: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },

  removeText: {
    color: colors.light.emergency,
    fontWeight: "600",
  },
});
