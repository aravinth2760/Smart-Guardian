import { memo } from "react";
import { Pressable, StyleSheet } from "react-native";
import { Plus } from "lucide-react-native";

import colors from "@/constants/colors";

type FloatingButtonProps = {
  onPress: () => void;
};

function FloatingButton({ onPress }: FloatingButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
      android_ripple={{
        color: colors.light.primaryDark,
        borderless: true,
      }}
    >
      <Plus size={28} color="#fff" strokeWidth={2.5} />
    </Pressable>
  );
}

export default memo(FloatingButton);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 20,
    bottom: 24,

    width: 60,
    height: 60,
    borderRadius: 20,

    backgroundColor: colors.light.primary,

    justifyContent: "center",
    alignItems: "center",

    elevation: 8,

    shadowColor: colors.light.primary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },

  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
});
