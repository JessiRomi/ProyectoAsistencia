import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "@/features/theme/theme.provider";
import type { AttendanceStatus } from "@/features/attendance/attendance.types";

type Props = {
  status: AttendanceStatus;
  onChange: (status: AttendanceStatus) => void;
};

const STATUS_OPTIONS: {
  value: AttendanceStatus;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  colorKey: "success" | "error" | "accent" | "secondary";
}[] = [
  {
    value: "PRESENT",
    label: "Presente",
    icon: "checkmark-circle-outline",
    colorKey: "success",
  },
  {
    value: "ABSENT",
    label: "Ausente",
    icon: "close-circle-outline",
    colorKey: "error",
  },
  {
    value: "LATE",
    label: "Tardanza",
    icon: "time-outline",
    colorKey: "accent",
  },
  {
    value: "JUSTIFIED",
    label: "Justificada",
    icon: "document-text-outline",
    colorKey: "secondary",
  },
];

export function AttendanceStatusSelector({ status, onChange }: Props) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      {STATUS_OPTIONS.map((option) => {
        const isActive = status === option.value;
        const activeColor = colors[option.colorKey];

        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityLabel={option.label}
            accessibilityState={{ checked: isActive }}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: isActive ? activeColor : colors.background,
                borderColor: isActive ? activeColor : colors.border,
              },
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name={option.icon}
              size={19}
              color={isActive ? colors.white : activeColor}
            />

            <Text
              style={[
                styles.text,
                {
                  color: isActive ? colors.white : colors.text,
                },
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  button: {
    width: "48%",
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 0,
  },

  text: {
    fontSize: 13,
    fontWeight: "700",
  },

  pressed: {
    opacity: 0.75,
  },
});
