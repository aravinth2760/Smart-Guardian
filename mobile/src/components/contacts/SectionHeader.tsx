import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

import colors from "@/constants/colors";

type SectionHeaderProps = {
  title: string;
  count?: number;
};

function SectionHeader({ title, count }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {count !== undefined && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count}</Text>
        </View>
      )}
    </View>
  );
}

export default memo(SectionHeader);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.light.text,
  },

  badge: {
    marginLeft: 8,
    minWidth: 24,
    height: 24,
    borderRadius: 12,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: colors.light.primaryLight,
    borderWidth: 1,
    borderColor: colors.light.cardBorder,

    paddingHorizontal: 8,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.light.primary,
  },
});
