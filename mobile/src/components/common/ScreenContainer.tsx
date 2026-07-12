import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";

import colors from "@/constants/colors";

type Props = {
  children: React.ReactNode;
  center?: boolean;
};

export default function ScreenContainer({ children, center = false }: Props) {
  return (
    <SafeAreaView style={[styles.safeArea, center && styles.center]}>
      {children}
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
