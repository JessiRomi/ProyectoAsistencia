import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { AppButton } from "@/components/ui/AppButton";
import { AppCard } from "@/components/ui/AppCard";
import { FeedbackState } from "@/components/ui/FeedbackState";
import { RouteGuard } from "@/components/auth/RouteGuard";
import { useAppTheme } from "@/features/theme/theme.provider";
import { useStudentEnrollments } from "@/features/courses/useStudentEnrollments";

// Traduce los días de la semana a sus nombres en español
const DAYS: Record<number, string> = {
  0: "Domingo",
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
};

// Convierte los códigos de turno en descripciones para la interfaz
const SHIFTS: Record<string, string> = {
  MORNING: "Mañana",
  AFTERNOON: "Tarde",
  EVENING: "Noche",
  VIRTUAL: "Virtual",
  MIXED: "Mixto",
};

const PAGE_SIZE = 3;

// Protege el acceso al listado de materias para el rol STUDENT
export default function StudentSubjectsScreen() {
  return (
    <RouteGuard allowedRoles={["STUDENT"]}>
      <StudentSubjectsContent />
    </RouteGuard>
  );
}

// Gestiona las inscripciones, la información de las materias y su visualización
function StudentSubjectsContent() {
  const { enrollments, isLoading, error, reload } = useStudentEnrollments();

  const { colors } = useAppTheme();

  const [expandedSubjects, setExpandedSubjects] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  // Calcula la cantidad de páginas según el número de inscripciones
  const totalPages = Math.ceil(enrollments.length / PAGE_SIZE);

  const safeCurrentPage = Math.min(currentPage, Math.max(totalPages - 1, 0));

  // Obtiene las inscripciones correspondientes a la página actual
  const visibleEnrollments = enrollments.slice(
    safeCurrentPage * PAGE_SIZE,
    safeCurrentPage * PAGE_SIZE + PAGE_SIZE,
  );

  const subjectColors = [colors.secondary, colors.accent, colors.success];

  function toggleSubject(enrollmentId: string) {
    setExpandedSubjects((current) =>
      current.includes(enrollmentId)
        ? current.filter((id) => id !== enrollmentId)
        : [...current, enrollmentId],
    );
  }

  // Retrocede una página sin permitir índices negativos
  function goToPreviousPage() {
    setCurrentPage((current) => Math.max(current - 1, 0));
  }

  // Avanza una página sin superar el límite disponible
  function goToNextPage() {
    setCurrentPage((current) => Math.min(current + 1, totalPages - 1));
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Volver"
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
        >
          <Ionicons name="arrow-back" size={25} color={colors.text} />
        </Pressable>

        <View style={styles.header}>
          <View
            style={[styles.headerIcon, { backgroundColor: colors.primary }]}
          >
            <Ionicons name="book-outline" size={30} color={colors.white} />
          </View>

          <View style={styles.headerContent}>
            <Text style={[styles.title, { color: colors.text }]}>
              Mis materias
            </Text>

            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Tus cursadas e inscripciones
            </Text>
          </View>
        </View>

        {isLoading ? (
          <FeedbackState type="loading" message="Cargando tus materias..." />
        ) : error ? (
          <FeedbackState type="error" message={error} onRetry={reload} />
        ) : enrollments.length === 0 ? (
          <FeedbackState
            type="empty"
            message="No tenés materias inscriptas. Cuando tengas inscripciones activas, aparecerán acá."
            onRetry={reload}
          />
        ) : (
          <>
            {/* Muestra las inscripciones de la página actual. */}
            {visibleEnrollments.map((enrollment, index) => {
              const subjectColor =
                subjectColors[
                  (safeCurrentPage * PAGE_SIZE + index) % subjectColors.length
                ];

              const offering = enrollment.courseOffering;
              const subject = offering.subject;
              const isExpanded = expandedSubjects.includes(enrollment.id);

              const teacherName = offering.teacher
                ? `${offering.teacher.firstName} ${offering.teacher.lastName}`.trim()
                : "";

              const isActive = enrollment.status === "ACTIVE";

              return (
                <AppCard
                  key={enrollment.id}
                  style={[
                    styles.subjectCard,
                    {
                      backgroundColor: `${subjectColor}18`,
                      borderLeftWidth: 5,
                      borderLeftColor: subjectColor,
                    },
                  ]}
                >
                  <Pressable
                    style={styles.subjectHeader}
                    onPress={() => toggleSubject(enrollment.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`${subject.name}, ${
                      isExpanded ? "ocultar" : "mostrar"
                    } información`}
                    accessibilityState={{
                      expanded: isExpanded,
                    }}
                  >
                    <View
                      style={[
                        styles.subjectIcon,
                        {
                          backgroundColor: `${subjectColor}30`,
                        },
                      ]}
                    >
                      <Ionicons name="book" size={23} color={subjectColor} />
                    </View>

                    <View style={styles.subjectHeading}>
                      <Text
                        style={[styles.subjectName, { color: colors.text }]}
                      >
                        {subject.name}
                      </Text>

                      <Text
                        style={[
                          styles.subjectCode,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {subject.code} · Comisión {offering.commission}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.activeBadge,
                        {
                          backgroundColor: isActive
                            ? `${colors.success}20`
                            : colors.background,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.activeBadgeText,
                          {
                            color: isActive
                              ? colors.success
                              : colors.textSecondary,
                          },
                        ]}
                      >
                        {isActive ? "Activa" : enrollment.status}
                      </Text>
                    </View>

                    <Ionicons
                      name={isExpanded ? "chevron-up" : "chevron-down"}
                      size={20}
                      color={subjectColor}
                    />
                  </Pressable>
                  {/* Presenta los datos adicionales de la cursada seleccionada. */}
                  {isExpanded && (
                    <>
                      <View
                        style={[
                          styles.divider,
                          { backgroundColor: colors.border },
                        ]}
                      />

                      <InfoRow
                        icon="calendar-outline"
                        label="Día"
                        value={DAYS[offering.dayOfWeek] ?? "No informado"}
                      />

                      <InfoRow
                        icon="time-outline"
                        label="Horario"
                        value={`${offering.startTime} a ${offering.endTime}`}
                      />

                      <InfoRow
                        icon="sunny-outline"
                        label="Turno"
                        value={SHIFTS[offering.shift] ?? offering.shift}
                      />

                      <InfoRow
                        icon="location-outline"
                        label="Aula"
                        value={offering.classroom ?? "No informada"}
                      />

                      <InfoRow
                        icon="school-outline"
                        label="Ciclo lectivo"
                        value={offering.academicYear.name}
                      />

                      {teacherName ? (
                        <InfoRow
                          icon="person-outline"
                          label="Docente"
                          value={teacherName}
                        />
                      ) : null}

                      {subject.year ? (
                        <InfoRow
                          icon="bookmark-outline"
                          label="Año de la materia"
                          value={String(subject.year)}
                        />
                      ) : null}
                    </>
                  )}
                </AppCard>
              );
            })}
            {/* Permite navegar entre las páginas del listado de materias. */}
            {totalPages > 1 && (
              <View style={styles.pagination}>
                <AppButton
                  label="Anterior"
                  icon="chevron-back"
                  onPress={goToPreviousPage}
                  variant="secondary"
                  size="small"
                  disabled={safeCurrentPage === 0}
                />

                <Text
                  style={[
                    styles.pageIndicator,
                    { color: colors.textSecondary },
                  ]}
                >
                  {safeCurrentPage + 1} / {totalPages}
                </Text>

                <AppButton
                  label="Siguiente"
                  icon="chevron-forward"
                  iconPosition="right"
                  onPress={goToNextPage}
                  variant="primary"
                  size="small"
                  disabled={safeCurrentPage >= totalPages - 1}
                />
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

interface InfoRowProps {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  value: string;
}

// Componente reutilizable para mostrar datos de una cursada
function InfoRow({ icon, label, value }: InfoRowProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={18} color={colors.secondary} />

      <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
        {label}
      </Text>

      <Text style={[styles.infoValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 36,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 28,
    marginBottom: 24,
  },

  headerIcon: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },

  headerContent: {
    flex: 1,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
  },

  subjectCard: {
    marginBottom: 14,
  },

  subjectHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  subjectIcon: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  subjectHeading: {
    flex: 1,
  },

  subjectName: {
    fontSize: 16,
    fontWeight: "800",
  },

  subjectCode: {
    fontSize: 12,
    marginTop: 4,
  },

  activeBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  activeBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },

  divider: {
    height: 1,
    marginVertical: 14,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: 12,
  },

  infoLabel: {
    width: 94,
    fontSize: 12,
  },

  infoValue: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "right",
  },

  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 20,
  },

  pageIndicator: {
    fontSize: 13,
    fontWeight: "700",
  },

  backButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  backButtonPressed: {
    opacity: 0.6,
  },
});
