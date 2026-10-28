
import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { CourseOffering } from "@/features/courses/courses.types";
import { COLORS, DARK_COLORS } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type Props = {
  course: CourseOffering;
  onPress: () => void;
};

export function CourseOfferingCard({
  course,
  onPress,
}: Props) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? DARK_COLORS : COLORS;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.primary,
          shadowColor: isDark ? "#000000" : theme.primary,
        },
        pressed && styles.cardPressed,
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: theme.surface,
          },
        ]}
      >
        <Ionicons
          name="book-outline"
          size={26}
          color={theme.primary}
        />
      </View>

      <View style={styles.content}>
        <Text
          style={[styles.name, { color: "#FFFFFF" }]}
          numberOfLines={2}
        >
          {course.subject.name}
        </Text>

        <Text
          style={[
            styles.code,
            { color: isDark ? "#DCE7FF" : "#DBEAFE" },
          ]}
        >
          {course.subject.code}
        </Text>

        <Text
          style={[styles.commission, { color: "#FFFFFF" }]}
        >
          Comisión {course.commission}
        </Text>

        <Text
          style={[
            styles.year,
            { color: isDark ? "#DCE7FF" : "#DBEAFE" },
          ]}
        >
          {course.academicYear.name}
        </Text>
      </View>

      <View
        style={[
          styles.arrowContainer,
          { backgroundColor: theme.accent },
        ]}
      >
        <Ionicons
          name="arrow-forward"
          size={21}
          color="#FFFFFF"
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 100,
    paddingVertical: 12,
    paddingLeft: 10,
    paddingRight: 12,
    flexDirection: "row",
    alignItems: "center",
    borderTopLeftRadius: 34,
    borderBottomRightRadius: 34,
    borderTopRightRadius: 2,
    borderBottomLeftRadius: 2,
    elevation: 4,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.16,
    shadowRadius: 5,
    overflow: "hidden",
  },

  cardPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.985 }],
  },

  iconContainer: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  content: {
    flex: 1,
    paddingVertical: 4,
  },

  name: {
    fontSize: 16,
    fontWeight: "800",
  },

  code: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: "500",
  },

  commission: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "700",
  },

  year: {
    marginTop: 3,
    fontSize: 12,
  },

  arrowContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
});


