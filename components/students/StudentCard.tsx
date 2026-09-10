import { StyleSheet, Text, View } from "react-native";

import type { EnrolledStudent } from "@/features/courses/courses.types";

type Props = {
  student: EnrolledStudent;
};

export function StudentCard({ student }: Props) {
  const initials = `${student.firstName.charAt(0)}${student.lastName.charAt(0)}`;

  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {initials}
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>
          {student.firstName} {student.lastName}
        </Text>

        <Text style={styles.status}>
          Estudiante inscripto
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#E8F0FB",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "#4070B2",
    fontSize: 16,
    fontWeight: "800",
  },

  content: {
    flex: 1,
    marginLeft: 13,
  },

  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
  },

  status: {
    marginTop: 3,
    fontSize: 12,
    color: "#6B7280",
  },
});
