import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { AppButton } from "@/components/ui/AppButton";
import { AppCard } from "@/components/ui/AppCard";
import { FeedbackState } from "@/components/ui/FeedbackState";
import { useAppTheme } from "@/features/theme/theme.provider";
import { useTeacherCourses } from "@/features/courses/useTeacherCourses";

//Define las acciones disponibles para gestionar la cursada
type CourseAction = {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
};

export default function TeacherCourseScreen() {
  const { colors } = useAppTheme();
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);

  const params = useLocalSearchParams<{ id?: string | string[] }>();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  //Obtiene las cursadad asignadas al docente
  const { courses, isLoading, error } = useTeacherCourses();

  //Busca la cursada seleccionada segun el ID recibido
  const course = courses.find((item) => item.id === id);

  //Navega a la pantalla para crear una nueva clase
  function openNewClass() {
    if (!id) {
      return;
    }

    router.push({
      pathname: "/teacher/new-class",
      params: { id },
    });
  }

  //Navega al listado de estudiantes inscriptos en la cursada
  function openStudents() {
    if (!id) {
      return;
    }

    router.push({
      pathname: "/teacher/course-students",
      params: { id },
    });
  }

  //Navega al historial de las clases registradas
  function openSessions() {
    if (!id) {
      return;
    }

    router.push({
      pathname: "/teacher/course-sessions",
      params: { id },
    });
  }

  if (isLoading) {
    return (
      <FeedbackState
        type="loading"
        message="Cargando información de la cursada..."
      />
    );
  }

  if (error) {
    return (
      <View
        style={[styles.stateContainer, { backgroundColor: colors.background }]}
      >
        <FeedbackState type="error" message={error} />

        <AppButton
          label="Volver"
          icon="arrow-back"
          onPress={() => router.back()}
          variant="secondary"
          size="medium"
        />
      </View>
    );
  }

  if (!course) {
    return (
      <View
        style={[styles.stateContainer, { backgroundColor: colors.background }]}
      >
        <FeedbackState
          type="empty"
          message="No se encontró la cursada seleccionada."
        />

        <AppButton
          label="Volver a mis cursadas"
          icon="arrow-back"
          onPress={() => router.back()}
          variant="secondary"
          size="medium"
        />
      </View>
    );
  }
  //Recupera el primer horario configurado por cursada
  const schedule = course.scheduleSlots?.[0];

  //Define las opciones de gestion disponibles para docentes
  const actions: CourseAction[] = [
    {
      title: "Crear nueva clase",
      description: "Registrar una nueva sesión para esta cursada.",
      icon: "add-circle-outline",
      color: colors.accent,
      onPress: openNewClass,
    },
    {
      title: "Ver estudiantes",
      description: "Consultar los alumnos inscriptos en esta cursada.",
      icon: "people-outline",
      color: colors.success,
      onPress: openStudents,
    },

    {
      title: "Historial de clases",
      description: "Consultar las sesiones registradas de esta cursada.",
      icon: "time-outline",
      color: colors.secondary,
      onPress: openSessions,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.courseHeaderRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Volver a mis cursadas"
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.actionPressed,
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
                {course.subject.name}
              </Text>

              <Text style={[styles.code, { color: colors.textSecondary }]}>
                {course.subject.code}
              </Text>
            </View>
          </View>
        </View>
        {/* INFORMACIÓN ACADÉMICA Y ORGANIZACIÓN DE LA CURSADA */}
        <AppCard style={styles.infoCard}>
          <Pressable
            onPress={() => setIsInfoExpanded((current) => !current)}
            accessibilityRole="button"
            accessibilityLabel="Información de la cursada"
            accessibilityState={{ expanded: isInfoExpanded }}
            style={styles.infoHeader}
          >
            <Ionicons
              name="information-circle-outline"
              size={25}
              color={colors.secondary}
            />

            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Información de la cursada
            </Text>

            <Ionicons
              name={isInfoExpanded ? "chevron-up" : "chevron-down"}
              size={22}
              color={colors.secondary}
            />
          </Pressable>

          {isInfoExpanded && (
            <View style={styles.infoDetails}>
              <InfoRow
                icon="people-outline"
                label="Comisión"
                value={course.commission}
                iconColor={colors.secondary}
              />

              <InfoRow
                icon="time-outline"
                label="Turno"
                value={formatShift(course.shift)}
                iconColor={colors.accent}
              />

              <InfoRow
                icon="calendar-outline"
                label="Ciclo lectivo"
                value={course.academicYear.name}
                iconColor={colors.success}
              />

              <InfoRow
                icon="school-outline"
                label="Año académico"
                value={String(course.academicYear.year)}
                iconColor={colors.secondary}
              />

              {schedule?.dayOfWeek !== undefined && (
                <InfoRow
                  icon="calendar-outline"
                  label="Día"
                  value={formatDay(schedule.dayOfWeek)}
                  iconColor={colors.accent}
                />
              )}

              {schedule?.startTime && schedule?.endTime && (
                <InfoRow
                  icon="time-outline"
                  label="Horario"
                  value={`${schedule.startTime} - ${schedule.endTime}`}
                  iconColor={colors.success}
                />
              )}

              {schedule?.classroom && (
                <InfoRow
                  icon="location-outline"
                  label="Aula"
                  value={schedule.classroom}
                  iconColor={colors.secondary}
                />
              )}

              {course.classroom && !schedule?.classroom && (
                <InfoRow
                  icon="location-outline"
                  label="Aula"
                  value={course.classroom}
                  iconColor={colors.secondary}
                />
              )}

              {course.maxCapacity !== undefined && (
                <InfoRow
                  icon="people-outline"
                  label="Capacidad"
                  value={`${course.maxCapacity} estudiantes`}
                  iconColor={colors.accent}
                  last
                />
              )}
            </View>
          )}
        </AppCard>

        <Text style={[styles.actionsTitle, { color: colors.text }]}>
          Gestión de la cursada
        </Text>
        {/* ACCESOS A LAS FUNCIONALIDADES DE LA CURSADA */}
        <View style={styles.actionsContainer}>
          {actions.map((action) => (
            <Pressable
              key={action.title}
              onPress={action.onPress}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.actionPressable,
                pressed && styles.actionPressed,
              ]}
            >
              <AppCard
                style={[styles.actionCard, { borderLeftColor: action.color }]}
              >
                <View style={styles.actionContent}>
                  <View
                    style={[
                      styles.actionIcon,
                      { backgroundColor: `${action.color}20` },
                    ]}
                  >
                    <Ionicons
                      name={action.icon}
                      size={24}
                      color={action.color}
                    />
                  </View>

                  <View style={styles.actionTextContent}>
                    <Text style={[styles.actionTitle, { color: colors.text }]}>
                      {action.title}
                    </Text>

                    <Text
                      style={[
                        styles.actionDescription,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {action.description}
                    </Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={22}
                    color={action.color}
                  />
                </View>
              </AppCard>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
//Componente reutilizable para mostrar datos de la cursada
function InfoRow({
  icon,
  label,
  value,
  iconColor,
  last = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  iconColor: string;
  last?: boolean;
}) {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.infoRow,
        !last && {
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <Ionicons name={icon} size={20} color={iconColor} />

      <View style={styles.infoContent}>
        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
          {label}
        </Text>

        <Text style={[styles.infoValue, { color: colors.text }]}>{value}</Text>
      </View>
    </View>
  );
}

//Convierte los codigos de turno en etiquetas comprensibles
function formatShift(
  shift: "MORNING" | "AFTERNOON" | "EVENING" | "VIRTUAL" | "MIXED",
) {
  const labels = {
    MORNING: "Mañana",
    AFTERNOON: "Tarde",
    EVENING: "Noche",
    VIRTUAL: "Virtual",
    MIXED: "Mixto",
  };

  return labels[shift];
}

//Convierte el numero del dia de la semana en su nombre
function formatDay(day: number) {
  const labels: Record<number, string> = {
    1: "Lunes",
    2: "Martes",
    3: "Miércoles",
    4: "Jueves",
    5: "Viernes",
    6: "Sábado",
    7: "Domingo",
  };

  return labels[day] ?? `Día ${day}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 35,
  },

  stateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    gap: 18,
  },

  courseHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 29,
    marginBottom: 22,
  },

  backButton: {
    width: 38,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
  },

  header: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  headerIcon: {
    width: 58,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
  },

  headerContent: {
    flex: 1,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
  },

  code: {
    marginTop: 4,
    fontSize: 13,
  },

  infoCard: {
    paddingHorizontal: 18,
    paddingVertical: 14,
  },

  infoHeader: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  sectionTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "800",
  },

  infoDetails: {
    marginTop: 10,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },

  infoContent: {
    flex: 1,
    marginLeft: 13,
  },

  infoLabel: {
    fontSize: 12,
  },

  infoValue: {
    marginTop: 2,
    fontSize: 15,
    fontWeight: "600",
  },

  actionsTitle: {
    marginTop: 28,
    marginBottom: 14,
    fontSize: 19,
    fontWeight: "800",
  },

  actionsContainer: {
    gap: 12,
  },

  actionPressable: {
    width: "100%",
  },

  actionPressed: {
    opacity: 0.75,
  },

  actionCard: {
    padding: 14,
    borderLeftWidth: 5,
    borderLeftColor: "transparent",
  },

  actionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },

  actionIcon: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
  },

  actionTextContent: {
    flex: 1,
  },

  actionTitle: {
    fontSize: 16,
    fontWeight: "700",
  },

  actionDescription: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 17,
  },
});
