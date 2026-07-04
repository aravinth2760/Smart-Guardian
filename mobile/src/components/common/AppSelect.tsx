import { View, Text, Pressable, Modal } from "react-native";
import { useState } from "react";
import { ChevronDown } from "lucide-react-native";
import colors from "@/constants/colors";

interface Props<T> {
  label: string;
  value: T;
  options: T[];
  onChange: (value: T) => void;
  error?: string | null;
}

export default function AppSelect<T extends string>({
  label,
  value,
  options,
  onChange,
  error,
}: Props<T>) {
  const [open, setOpen] = useState(false);

  return (
    <View>
      {/* SELECT BOX */}
      <Pressable
        onPress={() => setOpen(true)}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 16,
          borderWidth: 1,
          borderColor: colors.light.cardBorder,
          borderRadius: 16,
          backgroundColor: colors.light.background,
        }}
      >
        <Text style={{ color: colors.light.text }}>
          {value ? value.charAt(0).toUpperCase() + value.slice(1) : label}
        </Text>

        <ChevronDown size={18} color={colors.light.textSecondary} />
      </Pressable>

      {/* ERROR */}
      {error && <Text style={{ color: "red", marginTop: 6 }}>{error}</Text>}

      {/* MODAL */}
      <Modal transparent visible={open} animationType="fade">
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            padding: 20,
          }}
          onPress={() => setOpen(false)}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 10,
            }}
          >
            {options.map((item) => {
              const isSelected = value === item;

              return (
                <Pressable
                  key={item}
                  onPress={() => {
                    onChange(item);
                    setOpen(false);
                  }}
                  style={{
                    padding: 14,
                    borderRadius: 10,
                    backgroundColor: isSelected
                      ? colors.light.primaryLight
                      : "transparent",
                  }}
                >
                  <Text
                    style={{
                      color: isSelected
                        ? colors.light.text
                        : colors.light.textSecondary,
                      fontWeight: isSelected ? "600" : "400",
                    }}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
