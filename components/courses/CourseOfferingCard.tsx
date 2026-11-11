import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppCard } from "@/components/ui/AppCard";
import type { CourseOffering } from "@/features/courses/courses.types";
import { useAppTheme } from "@/features/theme/theme.provider";

// Define los datos de la cursada y la acción al seleccionar la tarjeta
type Props = {
  course: CourseOffering;
  onPress: () => void;
  cardColor?: string;
};

// Muestra una tarjeta con la información principal de una cursada
export function CourseOfferingCard({ course, onPress, cardColor }: Props) {
  const { colors } = useAppTheme();

  // Determina el color de acento personalizado o utiliza el color secundario del tema
  const accentColor = cardColor ?? colors.secondary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Abrir cursada ${course.subject.name}, comisión ${course.commission}`}
      onPress={onPress}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
    >
      <AppCard
        padding={10}
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderLeftColor: accentColor,
          },
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: `${accentColor}25` },
          ]}
        >
          <Ionicons name="book-outline" size={32} color={accentColor} />
        </View>

        <View style={styles.content}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
            {course.subject.name}
          </Text>

          <Text style={[styles.code, { color: colors.textSecondary }]}>
            {course.subject.code}
          </Text>

          <Text style={[styles.commission, { color: colors.text }]}>
            Comisión {course.commission}
          </Text>

          <Text style={[styles.year, { color: colors.textSecondary }]}>
            {course.academicYear.name}
          </Text>
        </View>

        <View style={styles.arrowContainer}>
          <Ionicons name="chevron-forward" size={25} color={accentColor} />
        </View>
      </AppCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: "100%",
  },

  card: {
    minHeight: 108,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 0,
    borderLeftWidth: 6,
    borderWidth: 1,
  },

  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 0,
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    flex: 1,
    paddingVertical: 2,
    marginLeft: 12,
    gap: 2,
  },

  name: {
    fontSize: 16,
    fontWeight: "800",
  },

  code: {
    fontSize: 12,
    fontWeight: "500",
  },

  commission: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "700",
  },

  year: {
    fontSize: 12,
  },

  arrowContainer: {
    width: 26,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
  },

  pressed: {
    opacity: 0.8,
  },
});
