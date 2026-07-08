import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { UserRound } from "lucide-react-native";

import colors from "@/constants/colors";

type ContactCardProps = {
  name: string;
  phone: string;
  onPress: () => void;
};

function ContactCard({ name, phone, onPress }: ContactCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.avatar}>
        <UserRound size={24} color={colors.light.textSecondary} />
      </View>

      <View style={styles.info}>
        <Text numberOfLines={1} style={styles.name}>
          {name}
        </Text>

        <Text numberOfLines={1} style={styles.phone}>
          {phone}
        </Text>
      </View>
    </Pressable>
  );
}

export default memo(ContactCard);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: colors.light.background,
  },

  pressed: {
    opacity: 0.7,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.light.backgroundSecondary,
  },

  info: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "center",
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.light.text,
  },

  phone: {
    marginTop: 4,
    fontSize: 13,
    color: colors.light.textSecondary,
  },
});
