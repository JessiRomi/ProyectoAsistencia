import { Pressable, StyleSheet, Text, View } from "react-native";

import type { AttendanceStatus } from "@/features/attendance/attendance.types";

type Props = {
  status: AttendanceStatus;
  onChange: (status: AttendanceStatus) => void;
};

const STATUS_OPTIONS: {
  value: AttendanceStatus;
  label: string;
}[] = [
  {
    value: "PRESENT",
    label: "Presente",
  },
  {
    value: "ABSENT",
    label: "Ausente",
  },
  {
    value: "LATE",
    label: "Tardanza",
  },
  {
    value: "JUSTIFIED",
    label: "Justificada",
  },
];

export function AttendanceStatusSelector({
  status,
  onChange,
}: Props) {
  return (
    <View style={styles.container}>
      {STATUS_OPTIONS.map((option) => {
        const isActive = status === option.value;

        return (
          <Pressable
            key={option.value}
            style={[
              styles.button,
              isActive && styles.activeButton,
            ]}
            onPress={() => onChange(option.value)}
          >
            <Text
              style={[
                styles.text,
                isActive && styles.activeText,
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
  },

  activeButton: {
    backgroundColor: "#DBEAFE",
  },

  text: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },

  activeText: {
    color: "#1F2937",
  },
});
