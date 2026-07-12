import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import colors from "@/constants/colors";

type Props = {
  title: string;
  subtitle?: string;
};

export default function ScreenHeader({ title, subtitle }: Props) {
  return (
    <View style={styles.header}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <ArrowLeft size={22} color={colors.light.text} />
      </Pressable>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>

        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.light.card,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.light.cardBorder,
    marginRight: 14,
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.light.text,
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: colors.light.textSecondary,
  },
});
