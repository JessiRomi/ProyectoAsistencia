import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useTeacherCourses } from "@/features/courses/useTeacherCourses";

export default function TeacherCourseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    courses,
    isLoading,
    error,
  } = useTeacherCourses();

  const course = courses.find((item) => item.id === id);

  function openAttendance() {
    if (!id) {
      return;
    }

    router.push({
      pathname: "/teacher/attendance",
      params: {
        id,
      },
    });
  }

  function openStudents() {
    if (!id) {
      return;
    }

    router.push({
      pathname: "/teacher/course-students",
      params: {
        id,
      },
    });
  }

  function openSessions() {
    if (!id) {
      return;
    }

    router.push({
      pathname: "/teacher/course-sessions",
      params: {
        id,
      },
    });
  }

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator
          size="large"
          color="#4070B2"
        />

        <Text style={styles.loadingText}>
          Cargando información de la cursada...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>
          No se pudo cargar la cursada
        </Text>

        <Text style={styles.errorText}>
          {error}
        </Text>

        <Pressable
          style={styles.retryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.retryButtonText}>
            Volver
          </Text>
        </Pressable>
      </View>
    );
  }

  if (!course) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>
          Cursada no encontrada
        </Text>

        <Text style={styles.errorText}>
          No se encontró la cursada seleccionada.
        </Text>

        <Pressable
          style={styles.retryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.retryButtonText}>
            Volver a mis cursadas
          </Text>
        </Pressable>
      </View>
    );
  }

  const schedule = course.scheduleSlots?.[0];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Volver */}
        <Pressable
          style={styles.backRow}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color="#4070B2"
          />

          <Text style={styles.backText}>
            Mis cursadas
          </Text>
        </Pressable>

        {/* Encabezado */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons
              name="book-outline"
              size={32}
              color="#FFFFFF"
            />
          </View>

          <View style={styles.headerContent}>
            <Text style={styles.title}>
              {course.subject.name}
            </Text>

            <Text style={styles.code}>
              {course.subject.code}
            </Text>
          </View>
        </View>

        {/* Información */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Información de la cursada
          </Text>

          <InfoRow
            icon="people-outline"
            label="Comisión"
            value={course.commission}
          />

          <InfoRow
            icon="time-outline"
            label="Turno"
            value={formatShift(course.shift)}
          />

          <InfoRow
            icon="calendar-outline"
            label="Ciclo lectivo"
            value={course.academicYear.name}
          />

          <InfoRow
            icon="school-outline"
            label="Año académico"
            value={String(course.academicYear.year)}
          />

          {schedule?.dayOfWeek !== undefined && (
            <InfoRow
              icon="calendar-outline"
              label="Día"
              value={formatDay(schedule.dayOfWeek)}
            />
          )}

          {schedule?.startTime && schedule?.endTime && (
            <InfoRow
              icon="time-outline"
              label="Horario"
              value={`${schedule.startTime} - ${schedule.endTime}`}
            />
          )}

          {schedule?.classroom && (
            <InfoRow
              icon="location-outline"
              label="Aula"
              value={schedule.classroom}
            />
          )}

          {course.classroom && !schedule?.classroom && (
            <InfoRow
              icon="location-outline"
              label="Aula"
              value={course.classroom}
            />
          )}

          {course.maxCapacity !== undefined && (
            <InfoRow
              icon="people-circle-outline"
              label="Capacidad"
              value={`${course.maxCapacity} estudiantes`}
              last
            />
          )}
        </View>

        {/* Acciones */}
        <Text style={styles.actionsTitle}>
          Gestión de la cursada
        </Text>

        {/* Estudiantes */}
        <Pressable
          style={({ pressed }) => [
            styles.actionCard,
            pressed && styles.actionCardPressed,
          ]}
          onPress={openStudents}
        >
          <View style={styles.actionIcon}>
            <Ionicons
              name="people-outline"
              size={27}
              color="#FFFFFF"
            />
          </View>

          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>
              Ver estudiantes
            </Text>

            <Text style={styles.actionDescription}>
              Consultar los alumnos inscriptos en esta cursada.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={22}
            color="#9CA3AF"
          />
        </Pressable>

        {/* Asistencia */}
        <Pressable
          style={({ pressed }) => [
            styles.actionCard,
            pressed && styles.actionCardPressed,
          ]}
          onPress={openAttendance}
        >
          <View style={styles.actionIcon}>
            <Ionicons
              name="checkmark-done-outline"
              size={27}
              color="#FFFFFF"
            />
          </View>

          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>
              Tomar asistencia
            </Text>

            <Text style={styles.actionDescription}>
              Ver alumnos y registrar presente o ausente.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={22}
            color="#9CA3AF"
          />
        </Pressable>

        {/* Historial */}
        <Pressable
          style={({ pressed }) => [
            styles.actionCard,
            pressed && styles.actionCardPressed,
          ]}
          onPress={openSessions}
        >
          <View style={styles.actionIcon}>
            <Ionicons
              name="time-outline"
              size={27}
              color="#FFFFFF"
            />
          </View>

          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>
              Historial de clases
            </Text>

            <Text style={styles.actionDescription}>
              Consultar las sesiones registradas de esta cursada.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={22}
            color="#9CA3AF"
          />
        </Pressable>
      </ScrollView>
    </View>
  );
}

function formatShift(
  shift:
    | "MORNING"
    | "AFTERNOON"
    | "EVENING"
    | "VIRTUAL"
    | "MIXED",
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

function InfoRow({
  icon,
  label,
  value,
  last = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View
      style={[
        styles.infoRow,
        !last && styles.infoRowBorder,
      ]}
    >
      <Ionicons
        name={icon}
        size={21}
        color="#4070B2"
      />

      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>
          {label}
        </Text>

        <Text style={styles.infoValue}>
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 35,
  },

  centerContainer: {
    flex: 1,
    backgroundColor: "#F4F7FB",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
  },

  errorTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#1F2937",
    textAlign: "center",
  },

  errorText: {
    marginTop: 8,
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },

  retryButton: {
    marginTop: 20,
    backgroundColor: "#4070B2",
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },

  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  backRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 22,
  },

  backText: {
    color: "#4070B2",
    fontSize: 14,
    fontWeight: "700",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },

  headerIcon: {
    width: 62,
    height: 62,
    borderRadius: 18,
    backgroundColor: "#4070B2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },

  headerContent: {
    flex: 1,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1F2937",
  },

  code: {
    marginTop: 4,
    fontSize: 13,
    color: "#6B7280",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 4,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 4,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },

  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#EEF1F5",
  },

  infoContent: {
    flex: 1,
    marginLeft: 13,
  },

  infoLabel: {
    fontSize: 12,
    color: "#9CA3AF",
  },

  infoValue: {
    marginTop: 2,
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
  },

  actionsTitle: {
    marginTop: 28,
    marginBottom: 14,
    fontSize: 19,
    fontWeight: "800",
    color: "#1F2937",
  },

  actionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
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

  actionCardPressed: {
    opacity: 0.8,
  },

  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#4070B2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  actionContent: {
    flex: 1,
  },

  actionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },

  actionDescription: {
    marginTop: 3,
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 17,
  },
});