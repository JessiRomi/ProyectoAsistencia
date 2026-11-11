import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { StudentCard } from "@/components/students/StudentCard";
import { FeedbackState } from "@/components/ui/FeedbackState";
import { useCourseStudents } from "@/features/courses/useCourseStudents";
import { useAppTheme } from "@/features/theme/theme.provider";

//Define la cantidad de estudiantes que muestran por pag
const STUDENTS_PER_PAGE = 3;

export default function CourseStudentsScreen() {
  const { colors } = useAppTheme();
  const params = useLocalSearchParams<{ id: string }>();

  //Obtiene el ID de la cursada desde los parametros de navegacion
  const courseOfferingId = Array.isArray(params.id) ? params.id[0] : params.id;

  //Obtiene los estudiantes inscriptos en la cursada y permite recargar los datos
  const { students, isLoading, error, reload } =
    useCourseStudents(courseOfferingId);

  const [currentPage, setCurrentPage] = useState(0);

  //Calucula la cantidad de paginas y determina cual se puede mostrar
  const totalPages = Math.ceil(students.length / STUDENTS_PER_PAGE);
  const safePage = Math.min(currentPage, Math.max(totalPages - 1, 0));

  const startIndex = safePage * STUDENTS_PER_PAGE;

  //Obtiene los estudiantes correspondientes
  const paginatedStudents = students.slice(
    startIndex,
    startIndex + STUDENTS_PER_PAGE,
  );

  const cardColors = [colors.secondary, colors.accent, colors.success];

  //Controla los estados de carga, error y ausencia de estudiantes
  if (isLoading) {
    return <FeedbackState type="loading" message="Cargando estudiantes..." />;
  }

  if (error) {
    return <FeedbackState type="error" message={error} onRetry={reload} />;
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Estudiantes</Text>
      </View>
      {/* LISTADO DE ESTUDIANTES Y CONTROLES DE PAGINACIÓN */}
      <FlatList
        data={paginatedStudents}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <StudentCard
            student={item}
            cardColor={cardColors[(startIndex + index) % cardColors.length]}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={
          totalPages > 1
            ? () => (
                <View
                  style={[
                    styles.pagination,
                    {
                      borderTopColor: colors.border,
                      backgroundColor: colors.surface,
                    },
                  ]}
                >
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Página anterior"
                    disabled={safePage === 0}
                    onPress={() => setCurrentPage(safePage - 1)}
                    style={styles.paginationButton}
                  >
                    <Ionicons
                      name="chevron-back"
                      size={22}
                      color={
                        safePage === 0 ? colors.inactive : colors.secondary
                      }
                    />
                  </Pressable>

                  <Text style={[styles.paginationText, { color: colors.text }]}>
                    Página {safePage + 1} de {totalPages}
                  </Text>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Página siguiente"
                    disabled={safePage >= totalPages - 1}
                    onPress={() => setCurrentPage(safePage + 1)}
                    style={styles.paginationButton}
                  >
                    <Ionicons
                      name="chevron-forward"
                      size={22}
                      color={
                        safePage >= totalPages - 1
                          ? colors.inactive
                          : colors.secondary
                      }
                    />
                  </Pressable>
                </View>
              )
            : undefined
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 22,
  },

  title: {
    fontSize: 27,
    fontWeight: "800",
  },

  list: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  separator: {
    height: 12,
  },

  pagination: {
    marginTop: 24,
    paddingTop: 14,
    paddingBottom: 12,
    borderTopWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  paginationButton: {
    width: 44,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },

  paginationText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
