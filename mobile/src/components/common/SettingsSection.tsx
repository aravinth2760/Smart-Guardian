import { ChevronRight, LucideIcon } from "lucide-react-native";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

import colors from "@/constants/colors";

interface SectionItem {
  icon: LucideIcon;
  title: string;

  // Navigation item
  onPress?: () => void;

  // Optional value (Example: 5 sec, English)
  value?: string;

  // Toggle item
  showToggle?: boolean;
  toggleValue?: boolean;
  onToggleChange?: (value: boolean) => void;
}

interface SettingsSectionProps {
  title: string;
  items: SectionItem[];
}

export default function SettingsSection({
  title,
  items,
}: SettingsSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>

      {items.map((item, index) => {
        const Icon = item.icon;

        return (
          <Pressable
            key={index}
            style={styles.row}
            disabled={item.showToggle}
            onPress={item.onPress}
          >
            <View style={styles.left}>
              <Icon size={20} color={colors.light.primary} />
              <Text style={styles.rowTitle}>{item.title}</Text>
            </View>

            {item.showToggle ? (
              <Switch
                value={item.toggleValue ?? false}
                onValueChange={item.onToggleChange}
                trackColor={{
                  false: colors.light.cardBorder,
                  true: colors.light.primaryLight,
                }}
                thumbColor={
                  item.toggleValue ? colors.light.primary : colors.light.card
                }
                style={styles.switch}
              />
            ) : (
              <View style={styles.right}>
                {item.value && <Text style={styles.value}>{item.value}</Text>}

                <ChevronRight size={18} color={colors.light.textSecondary} />
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginVertical: 15,
  },

  sectionTitle: {
    marginBottom: 10,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    color: colors.light.textSecondary,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  right: {
    flexDirection: "row",
    alignItems: "center",
  },

  rowTitle: {
    marginLeft: 16,
    fontSize: 14,
    color: colors.light.text,
  },

  switch: {
    transform: [{ scaleX: 0.65 }, { scaleY: 0.65 }],
  },

  value: {
    marginRight: 8,
    fontSize: 14,
    color: colors.light.textSecondary,
  },
});
