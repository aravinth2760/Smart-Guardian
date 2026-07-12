import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";

import colors from "@/constants/colors";

type Props = {
  children: React.ReactNode;
};

export default function ScreenContainer({ children }: Props) {
  return <SafeAreaView style={styles.safeArea}>{children}</SafeAreaView>;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.light.background,
    paddingHorizontal: 10,
  },
});
