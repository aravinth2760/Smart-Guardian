import { memo } from "react";
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Search } from "lucide-react-native";

import colors from "@/constants/colors";

type SearchBarProps = TextInputProps & {
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
};

function SearchBar({
  value,
  onChangeText,
  placeholder = "Search contacts",
  containerStyle,
  inputStyle,
  ...props
}: SearchBarProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Search size={20} color={colors.light.textSecondary} strokeWidth={2} />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.light.textSecondary}
        style={[styles.input, inputStyle]}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        clearButtonMode="while-editing"
        {...props}
      />
    </View>
  );
}

export default memo(SearchBar);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    backgroundColor: colors.light.backgroundSecondary,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.light.cardBorder,
    paddingHorizontal: 14,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: colors.light.text,
  },
});
