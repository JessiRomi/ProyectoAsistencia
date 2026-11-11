import { StyleSheet, Text, View } from "react-native";

import { AppCard } from "@/components/ui/AppCard";
import { useAppTheme } from "@/features/theme/theme.provider";
import type { EnrolledStudent } from "@/features/courses/courses.types";

// Define los datos del estudiante y el color opcional de la tarjeta
type Props = {
  student: EnrolledStudent;
  cardColor?: string;
};

// Muestra la información básica de un estudiante en una tarjeta reutilizable
export function StudentCard({ student, cardColor }: Props) {
  const { colors } = useAppTheme();

  const accentColor = cardColor ?? colors.secondary;

  // Genera las iniciales del estudiante para representarlas en el avatar
  const initials =
    `${student.firstName.charAt(0)}${student.lastName.charAt(0)}`.toUpperCase();

  return (
    <AppCard
      padding={15}
      style={[
        styles.card,
        {
          borderColor: colors.border,
          borderLeftColor: accentColor,
        },
      ]}
    >
      <View style={[styles.avatar, { backgroundColor: `${accentColor}25` }]}>
        <Text style={[styles.avatarText, { color: accentColor }]}>
          {initials}
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.text }]}>
          {student.firstName} {student.lastName}
        </Text>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderLeftWidth: 6,
    borderRadius: 0,
    minHeight: 82,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 0,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: 17,
    fontWeight: "800",
  },

  content: {
    flex: 1,
    marginLeft: 14,
  },

  name: {
    fontSize: 16,
    fontWeight: "800",
  },
});
