import {
  useLocalSearchParams,
} from "expo-router";

import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { StudentCard } from "@/components/students/StudentCard";
import { FeedbackState } from "@/components/ui/FeedbackState";
import { useCourseStudents } from "@/features/courses/useCourseStudents";

export default function CourseStudentsScreen() {
  const { id } = useLocalSearchParams();

  const {
    students,
    isLoading,
    error,
    reload,
  } = useCourseStudents(id);

  if (isLoading) {
    return (
      <FeedbackState
        type="loading"
        message="Cargando estudiantes..."
      />
    );
  }

  if (error) {
    return (
      <FeedbackState
        type="error"
        message={error}
        onRetry={reload}
      />
    );
  }

  if (students.length === 0) {
    return (
      <FeedbackState
        type="empty"
        message="No hay estudiantes inscriptos en esta cursada."
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Estudiantes
        </Text>

        <Text style={styles.subtitle}>
          {students.length} estudiantes inscriptos
        </Text>
      </View>

      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <StudentCard student={item} />
        )}
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
    paddingTop: 55,
    paddingBottom: 18,
  },

  title: {
    fontSize: 27,
    fontWeight: "800",
    color: "#1F2937",
  },

  subtitle: {
    marginTop: 5,
    fontSize: 14,
    color: "#6B7280",
  },

  list: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 10,
  },
});
