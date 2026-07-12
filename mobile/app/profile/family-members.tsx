import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Crown, MessageCircle, UserRound } from "lucide-react-native";

import colors from "@/constants/colors";

import AppButton from "@/components/common/AppButton";
import ScreenContainer from "@/components/common/ScreenContainer";
import ScreenHeader from "@/components/common/ScreenHeader";

const members = [
  {
    id: "1",
    name: "Aravinth",
    relationship: "Parent (Admin)",
    admin: true,
  },
  {
    id: "2",
    name: "Lakshmi",
    relationship: "Mother",
    admin: false,
  },
  {
    id: "3",
    name: "Rahul",
    relationship: "Brother",
    admin: false,
  },
  {
    id: "4",
    name: "Priya",
    relationship: "Sister",
    admin: false,
  },
  {
    id: "5",
    name: "Suresh",
    relationship: "Grandfather",
    admin: false,
  },
  {
    id: "6",
    name: "Meena",
    relationship: "Grandmother",
    admin: false,
  },
  {
    id: "7",
    name: "Karthik",
    relationship: "Guardian",
    admin: false,
  },
];

export default function FamilyMembersScreen() {
  const [loading, setLoading] = useState(false);
  return (
    <ScreenContainer>
      {/* Header */}
      <ScreenHeader title="Family Members" />

      <View style={styles.content}>
        <Text style={styles.description}>
          These members belong to your family group. SOS alerts and live
          location are automatically shared with everyone in this group.
        </Text>

        {/* Family Group */}
        <View style={styles.groupContainer}>
          <Text style={styles.groupTitle}>Family Group</Text>

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
                    {member.admin ? (
                      <Crown size={20} color="#F59E0B" />
                    ) : (
                      <UserRound size={20} color={colors.light.primary} />
                    )}
                  </View>

                  <View>
                    <Text style={styles.name}>{member.name}</Text>

                    <Text style={styles.relationship}>
                      {member.relationship}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            Family members can only be managed from the Family Group in the Chat
            tab. Adding or removing members there automatically updates this
            list.
          </Text>
        </View>

        {/* Button */}
        <AppButton
          title="Open Family Group"
          Icon={MessageCircle}
          onPress={() => {}}
          loading={loading}
        />
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
