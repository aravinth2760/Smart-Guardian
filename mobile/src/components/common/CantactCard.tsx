import { Pressable, StyleSheet, Text, View } from "react-native";
import { Phone, UserRound } from "lucide-react-native";

import colors from "@/constants/colors";

interface ContactCardProps {
  name: string;
  phone: string;
  isRegistered?: boolean;
  onPress?: () => void;
  onInvite?: () => void;
}

export default function ContactCard({
  name,
  phone,
  isRegistered = true,
  onPress,
  onInvite,
}: ContactCardProps) {
  return isRegistered ? (
    <Pressable onPress={onPress}>
      <View style={styles.card}>
        <View style={styles.avatar}>
          <UserRound size={22} color={colors.light.primary} />
        </View>

        <View style={styles.content}>
          <Text numberOfLines={1} style={styles.name}>
            {name}
          </Text>

          <View style={styles.phoneRow}>
            <Phone size={14} color={colors.light.textSecondary} />
            <Text style={styles.phone}>{phone}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  ) : (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <UserRound size={22} color={colors.light.primary} />
      </View>

      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.name}>
          {name}
        </Text>

        <View style={styles.phoneRow}>
          <Phone size={14} color={colors.light.textSecondary} />
          <Text style={styles.phone}>{phone}</Text>
        </View>
      </View>

      <Pressable onPress={onInvite}>
        <Text style={styles.inviteText}>Invite</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 2,
    borderRadius: 16,
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    flex: 1,
    marginLeft: 14,
  },

  name: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.light.text,
  },

  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  phone: {
    marginLeft: 6,
    fontSize: 12,
    color: colors.light.textSecondary,
    fontWeight: "500",
  },

  inviteText: {
    color: colors.light.primary,
    fontWeight: "600",
    fontSize: 12,
  },
});
