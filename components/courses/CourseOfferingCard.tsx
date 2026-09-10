import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { CourseOffering } from "@/features/courses/courses.types";

type Props = {
  course: CourseOffering;
  onPress: () => void;
};

export function CourseOfferingCard({
  course,
  onPress,
}: Props) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name="book-outline"
          size={27}
          color="#FFFFFF"
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>
          {course.subject.name}
        </Text>

        <Text style={styles.code}>
          {course.subject.code}
        </Text>

        <Text style={styles.commission}>
          Comisión {course.commission}
        </Text>

        <Text style={styles.year}>
          {course.academicYear.name}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={22}
        color="#9CA3AF"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 7,
  },

  cardPressed: {
    opacity: 0.8,
  },

  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: "#4070B2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  content: {
    flex: 1,
  },

  name: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1F2937",
  },

  code: {
    marginTop: 3,
    fontSize: 12,
    color: "#6B7280",
  },

  commission: {
    marginTop: 7,
    fontSize: 13,
    fontWeight: "600",
    color: "#4070B2",
  },

  year: {
    marginTop: 3,
    fontSize: 12,
    color: "#6B7280",
  },
});

