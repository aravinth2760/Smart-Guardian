import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { Crown, MessageCircle, UserRound } from "lucide-react-native";

import { RootState } from "@/store";
import colors from "@/constants/colors";

import AppButton from "@/components/common/AppButton";
import ScreenContainer from "@/components/common/ScreenContainer";
import ScreenHeader from "@/components/common/ScreenHeader";
import { getGroupMembers } from "@/services/group.service";

type Member = {
  id: string;
  name: string;
  relationship: string;
  role: "owner" | "manager" | "member";
};

export default function MembersScreen() {
  const router = useRouter();

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

  if (loading) {
    return <ScreenContainer loading />;
  }

  return (
    <ScreenContainer>
      <ScreenHeader title="Family Members" />

      <View style={styles.content}>
        {members.length > 0 ? (
          <>
            <Text style={styles.description}>
              These guardians belong to your Safety Circle. SOS alerts and live
              location are automatically shared with everyone in this group.
            </Text>

            <View style={styles.groupContainer}>
              <Text style={styles.groupTitle}>Safety Circle</Text>

              <ScrollView
                style={styles.memberList}
                showsVerticalScrollIndicator={false}
              >
                {members.map((member, index) => (
                  <View
                    key={member.id}
                    style={[
                      styles.memberRow,
                      index === members.length - 1 && {
                        borderBottomWidth: 0,
                      },
                    ]}
                  >
                    <View style={styles.left}>
                      <View style={styles.avatar}>
                        {member.role === "owner" ? (
                          <Crown size={20} color="#F59E0B" />
                        ) : (
                          <UserRound size={20} color={colors.light.primary} />
                        )}
                      </View>

                      <View>
                        <Text style={styles.name}>
                          {member.name}
                          {member.id === currentUserId ? " (You)" : ""}
                        </Text>

                        <Text style={styles.relationship}>
                          {member.role === "owner"
                            ? "Admin"
                            : member.relationship}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoText}>
                Family members can only be managed from the Safety Circle in the
                Chat tab. Adding or removing members there automatically updates
                this list.
              </Text>
            </View>

            <AppButton
              title="Open Safety Circle"
              Icon={MessageCircle}
              onPress={() => router.push("/chat/group")}
            />
          </>
        ) : (
          <>
            <Text style={styles.description}>
              No Safety Circle has been created yet.
            </Text>

            <View style={styles.infoCard}>
              <Text style={styles.infoText}>
                Create or join your Safety Circle from the Chat tab. Once
                available, all guardians will appear here automatically.
              </Text>
            </View>

            <AppButton
              title="Open Chat"
              Icon={MessageCircle}
              onPress={() => {
                if (members.length > 0) {
                  router.push("/chat/group");
                } else {
                  router.push("/group/setup");
                }
              }}
            />
          </>
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },

  description: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.light.textSecondary,
    marginBottom: 20,
  },

  groupContainer: {
    borderWidth: 1,
    borderColor: colors.light.cardBorder,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    marginBottom: 20,
  },

  groupTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.light.text,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.light.cardBorder,
  },

  memberList: {
    maxHeight: 320,
  },

  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.light.cardBorder,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.light.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.light.text,
  },

  relationship: {
    marginTop: 4,
    fontSize: 14,
    color: colors.light.textSecondary,
  },

  infoCard: {
    backgroundColor: colors.light.primaryLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },

  infoText: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.light.text,
  },
});
