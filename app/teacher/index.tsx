import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { AppButton } from "@/components/ui/AppButton";
import { FeedbackState } from "@/components/ui/FeedbackState";
import { CourseOfferingCard } from "@/components/courses/CourseOfferingCard";
import { useAppTheme } from "@/features/theme/theme.provider";
import { useSession } from "@/features/auth/useSession";
import { useTeacherCourses } from "@/features/courses/useTeacherCourses";
import LogoutButton from "@/components/logout-button";

const PAGE_SIZE = 3;

export default function TeacherHomeScreen() {
  const { colors } = useAppTheme();
  const { user } = useSession();
  const { courses, isLoading, error, reload } = useTeacherCourses();

  const [currentPage, setCurrentPage] = useState(0);

  const firstName = user?.profile?.firstName?.trim() || "Docente";

  const totalPages = Math.ceil(courses.length / PAGE_SIZE);

  const paginatedCourses = useMemo(() => {
    const startIndex = currentPage * PAGE_SIZE;
    return courses.slice(startIndex, startIndex + PAGE_SIZE);
  }, [courses, currentPage]);

  function handleProfile() {
    router.push("/teacher/profile");
  }

  function handlePreviousPage() {
    setCurrentPage((page) => Math.max(page - 1, 0));
  }

  function handleNextPage() {
    setCurrentPage((page) => Math.min(page + 1, totalPages - 1));
  }

  if (isLoading) {
    return <FeedbackState type="loading" message="Cargando tus cursadas..." />;
  }

  if (error) {
    return (
      <View
        style={[styles.centerContainer, { backgroundColor: colors.background }]}
      >
        <Text style={[styles.errorTitle, { color: colors.text }]}>
          No se pudieron cargar las cursadas
        </Text>

        <Text style={[styles.message, { color: colors.textSecondary }]}>
          {error}
        </Text>

        <View style={styles.centerActions}>
          <AppButton
            label="Reintentar"
            onPress={reload}
            variant="primary"
            size="medium"
          />
          <LogoutButton />
        </View>
      </View>
    );
  }

  if (courses.length === 0) {
    return (
      <View
        style={[styles.centerContainer, { backgroundColor: colors.background }]}
      >
        <Text style={[styles.errorTitle, { color: colors.text }]}>
          No tenés cursadas asignadas
        </Text>

        <Text style={[styles.message, { color: colors.textSecondary }]}>
          No se encontraron cursadas para este profesor.
        </Text>

        <View style={styles.centerActions}>
          <LogoutButton />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={paginatedCourses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={reload}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text
                style={[styles.greeting, { color: colors.text }]}
                numberOfLines={2}
              >
                ¡Bienvenido, {firstName}!
              </Text>

              <Text style={[styles.subtitle, { color: colors.accent }]}>
                Docente
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Ir a mi perfil"
              onPress={handleProfile}
              style={({ pressed }) => [
                styles.profileButton,
                { backgroundColor: colors.secondary },
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="person-outline" size={30} color={colors.white} />
            </Pressable>
          </View>
        }
        renderItem={({ item, index }) => {
          const globalIndex = currentPage * PAGE_SIZE + index;

          const cardColors = [colors.secondary, colors.accent, colors.success];

          return (
            <CourseOfferingCard
              course={item}
              cardColor={cardColors[globalIndex % cardColors.length]}
              onPress={() =>
                router.push({
                  pathname: "/teacher/course",
                  params: { id: item.id },
                })
              }
            />
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.cardSeparator} />}
        ListFooterComponent={
          <View style={styles.footer}>
            {totalPages > 1 && (
              <View style={styles.pagination}>
                <AppButton
                  label="Anterior"
                  onPress={handlePreviousPage}
                  variant="secondary"
                  size="small"
                  disabled={currentPage === 0}
                />

                <Text
                  style={[
                    styles.pageIndicator,
                    { color: colors.textSecondary },
                  ]}
                >
                  Página {currentPage + 1} de {totalPages}
                </Text>

                <AppButton
                  label="Siguiente"
                  onPress={handleNextPage}
                  variant="danger"
                  size="small"
                  disabled={currentPage === totalPages - 1}
                />
              </View>
            )}

            <LogoutButton />
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  listContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 46,
  },

  headerText: {
    flex: 1,
    marginRight: 14,
  },

  greeting: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
    lineHeight: 36,
  },

  subtitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 8,
  },

  profileButton: {
    width: 58,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
  },

  cardSeparator: {
    height: 12,
  },

  footer: {
    marginTop: 24,
    gap: 28,
  },

  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  pageIndicator: {
    fontSize: 13,
    fontWeight: "600",
  },

  pressed: {
    opacity: 0.75,
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  errorTitle: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
  },

  message: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 22,
  },

  centerActions: {
    gap: 12,
    width: "100%",
    maxWidth: 280,
  },
});
