import { ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import colors from "@/constants/colors";

type Props = {
  children?: React.ReactNode;
  center?: boolean;
  loading?: boolean;
};

export default function ScreenContainer({
  children,
  center = false,
  loading = false,
}: Props) {
  return (
    <SafeAreaView
      style={[styles.safeArea, (center || loading) && styles.center]}
    >
      {loading ? (
        <ActivityIndicator size="large" color={colors.light.primary} />
      ) : (
        children
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.light.background,
    paddingHorizontal: 10,
  },

  center: {
    justifyContent: "center",
    alignItems: "center",
  },
});
