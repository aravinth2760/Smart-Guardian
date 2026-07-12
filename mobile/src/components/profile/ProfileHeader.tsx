import { ShieldCheck, UserRound } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

import ScreenHeader from "@/components/common/ScreenHeader";
import colors from "@/constants/colors";

export default function ProfileHeader() {
  return (
    <View>
      {/* Header */}
      <ScreenHeader
        title="Profile"
        subtitle="Manage your account and family safety."
        showBack={false}
      />

      {/* User Info */}
      <View style={styles.profileContainer}>
        <View style={styles.avatar}>
          <UserRound size={30} color={colors.light.primary} strokeWidth={2} />
        </View>

        <View style={styles.info}>
          <Text numberOfLines={1} style={styles.name}>
            Aravinth
          </Text>

          <View style={styles.roleContainer}>
            <ShieldCheck
              size={13}
              color={colors.light.primary}
              fill={colors.light.primary}
            />

            <Text style={styles.role}>Parent</Text>
          </View>

          <Text numberOfLines={1} style={styles.email}>
            aravinth@gmail.com
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FDECEF",
    justifyContent: "center",
    alignItems: "center",
  },

  info: {
    flex: 1,
    marginLeft: 18,
  },

  name: {
    fontSize: 16,
    color: colors.light.text,
  },

  roleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  role: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
    color: colors.light.primary,
  },

  email: {
    marginTop: 8,
    fontSize: 14,
    color: colors.light.textSecondary,
  },
});
