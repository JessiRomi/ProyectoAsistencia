import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  present: boolean;
  onChange: (present: boolean) => void;
};

export function AttendanceStatusSelector({
  present,
  onChange,
}: Props) {
  return (
    <View style={styles.container}>
      <Pressable
        style={[
          styles.button,
          present && styles.presentActive,
        ]}
        onPress={() => onChange(true)}
      >
        <Text
          style={[
            styles.text,
            present && styles.activeText,
          ]}
        >
          Presente
        </Text>
      </Pressable>

      <Pressable
        style={[
          styles.button,
          !present && styles.absentActive,
        ]}
        onPress={() => onChange(false)}
      >
        <Text
          style={[
            styles.text,
            !present && styles.activeText,
          ]}
        >
          Ausente
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
  },

  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
  },

  presentActive: {
    backgroundColor: "#D1FAE5",
  },

  absentActive: {
    backgroundColor: "#FEE2E2",
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
