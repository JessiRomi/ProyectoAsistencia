import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { CourseOfferingCard } from "@/components/courses/CourseOfferingCard";
import { useTeacherCourses } from "@/features/courses/useTeacherCourses";

export default function TeacherHomeScreen() {
  const router = useRouter();

  const {
    courses,
    isLoading,
    error,
    reload,
  } = useTeacherCourses();

  // Por ahora la API devuelve [] porque el profesor
  // todavía no tiene una cursada asociada.
  // Usamos esta cursada temporalmente.
  const temporaryCourse = {
    id: "temporary-aplicaciones-moviles",
    commission: "A",
    shift: "EVENING" as const,
    subject: {
      id: "temporary-subject",
      name: "Aplicaciones Móviles",
      code: "APM",
    },
    academicYear: {
      id: "temporary-year",
      year: 2026,
      name: "2026",
    },
  };

  const displayedCourses =
    courses.length > 0 ? courses : [temporaryCourse];

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.message}>
          Cargando cursadas...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>
          {error}
        </Text>

        <Text
          style={styles.retry}
          onPress={reload}
        >
          Reintentar
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Mis cursadas
        </Text>

        <Text style={styles.subtitle}>
          Seleccioná una cursada para continuar
        </Text>
      </View>

      <FlatList
        data={displayedCourses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <CourseOfferingCard
            course={item}
            onPress={() =>
              router.push({
                pathname: "/teacher/course",
                params: {
                  id: item.id,
                },
              })
            }
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No tenés cursadas asignadas.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1F2937",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#6B7280",
  },

  list: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 12,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  message: {
    marginTop: 12,
    fontSize: 15,
    color: "#6B7280",
  },

  error: {
    textAlign: "center",
    fontSize: 15,
    color: "#B91C1C",
  },

  retry: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: "700",
    color: "#4070B2",
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#6B7280",
  },
});
