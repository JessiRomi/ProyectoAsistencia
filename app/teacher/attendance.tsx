import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AppButton } from "@/components/ui/AppButton";
import { AppCard } from "@/components/ui/AppCard";
import { FeedbackState } from "@/components/ui/FeedbackState";
import { AttendanceStatusSelector } from "@/components/attendance/AttendanceStatusSelector";

import { useAppTheme } from "@/features/theme/theme.provider";
import { useCourseSessions } from "@/features/attendance/useCourseSessions";
import { useAttendance } from "@/features/attendance/useAttendance";
import { useCourseStudents } from "@/features/courses/useCourseStudents";
import { useTeacherCourses } from "@/features/courses/useTeacherCourses";

import type { AttendanceStatus } from "@/features/attendance/attendance.types";

//Estructura que almacena el estado de la asistencia 
type AttendanceState = Record<string, AttendanceStatus>;

export default function TeacherAttendanceScreen() {
  const { colors } = useAppTheme();

  //Recupera el ID de la cursada y de la clase enviados
  const params = useLocalSearchParams<{
    id?: string;
    sessionId?: string;
  }>();

  const id = params.id;
  const sessionId = params.sessionId;

  const {
    sessions,
    isLoading: isLoadingSessions,
    error: sessionsError,
  } = useCourseSessions(sessionId ? (id ?? "") : "");

  const currentSession = sessions.find((session) => session.id === sessionId);

  const isSessionClosed = currentSession?.status === "CLOSED";

  const { courses, isLoading: isLoadingCourses } = useTeacherCourses();
  const course = courses.find((item) => item.id === id);

  const {
    students,
    isLoading: isLoadingStudents,
    error: studentsError,
    reload: reloadStudents,
  } = useCourseStudents(id);

  const {
    saveAttendanceForSession,
    saveAttendance,
    isSaving,
    error: attendanceError,
  } = useAttendance();

  const [attendance, setAttendance] = useState<AttendanceState>({});

  //Inicia con todos los estudiantes como ausente
  //Los estados se modifican por el docente 
  const attendanceWithDefaults: AttendanceState = {
    ...Object.fromEntries(
      students.map((student) => [student.id, "ABSENT" as AttendanceStatus]),
    ),
    ...attendance,
  };

  //Actualiza el estado de la asistencia del estudiante seleccionado
  function handleStatusChange(studentId: string, status: AttendanceStatus) {
    setAttendance((current) => ({
      ...current,
      [studentId]: status,
    }));
  }
//Valida que la clase este abierta y registrar asistencia 
  async function handleSaveAttendance() {
    if (sessionId) {
      if (isLoadingSessions) {
        Alert.alert("Un momento", "Estamos verificando el estado de la clase.");
        return;
      }

      if (sessionsError || !currentSession) {
        Alert.alert(
          "No se puede guardar",
          "No pudimos verificar el estado de la clase. Volvé al historial e intentá nuevamente.",
        );
        return;
      }

      if (currentSession.status !== "OPEN") {
        Alert.alert(
          "Clase cerrada",
          "La asistencia de esta clase ya no se puede modificar.",
        );
        return;
      }
    }

    if (!id) {
      Alert.alert("Error", "No se encontró la cursada.");
      return;
    }

    if (!students.length) {
      Alert.alert("Sin estudiantes", "No hay estudiantes para registrar.");
      return;
    }

    const records = students.map((student) => ({
      studentId: student.id,
      status: attendanceWithDefaults[student.id],
    }));

    try {
      if (sessionId) {
        await saveAttendanceForSession(sessionId, records);
      } else {
        await saveAttendance(id, records);
      }

      Alert.alert(
        "Asistencia guardada",
        "La asistencia se registró correctamente.",
        [
          {
            text: "Aceptar",
            onPress: () => {
              router.back();
            },
          },
        ],
      );
    } catch (error) {
      console.error("Error guardando asistencia:", error);

      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : attendanceError || "No se pudo guardar la asistencia.",
      );
    }
  }

  //Controla los estados de carga y los posibles errores antes de mostrar el listado
  if (
    isLoadingCourses ||
    isLoadingStudents ||
    (sessionId && isLoadingSessions)
  ) {
    return <FeedbackState type="loading" message="Cargando estudiantes..." />;
  }

  if (!id) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>
          No se encontró la cursada.
        </Text>
      </View>
    );
  }

  if (studentsError) {
    return (
      <FeedbackState
        type="error"
        message={studentsError}
        onRetry={reloadStudents}
      />
    );
  }

  if (sessionId && (sessionsError || !currentSession)) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>
          No se pudo verificar el estado de la clase. Volvé al historial e
          intentá nuevamente.
        </Text>

        <AppButton
          label="Volver al historial"
          onPress={() => router.back()}
          variant="secondary"
          size="medium"
        />
      </View>
    );
  }

  if (sessionId && isSessionClosed) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>
          Esta clase está cerrada. La asistencia solo se puede consultar.
        </Text>

        <AppButton
          label="Volver al historial"
          onPress={() => router.back()}
          variant="secondary"
          size="medium"
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Volver"
          onPress={() => router.back()}
          disabled={isSaving}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
        >
          <Ionicons name="arrow-back" size={26} color={colors.text} />
        </Pressable>

        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.text }]}>
            Tomar asistencia
          </Text>

          <Text style={[styles.courseName, { color: colors.textSecondary }]}>
            {course?.subject?.name ?? "Curso seleccionado"}
          </Text>

          {sessionId ? (
            <Text style={[styles.sessionInfo, { color: colors.secondary }]}>
              Nueva clase
            </Text>
          ) : null}
        </View>
      </View>

      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <AppCard padding={16} style={styles.studentCard}>
            <View style={styles.studentInfo}>
              <View style={styles.studentIcon}>
                <Ionicons
                  name="person-outline"
                  size={23}
                  color={colors.secondary}
                />
              </View>

              <View style={styles.studentDetails}>
                <Text style={[styles.studentName, { color: colors.text }]}>
                  {item.firstName} {item.lastName}
                </Text>

                {item.studentNumber ? (
                  <Text
                    style={[
                      styles.studentNumber,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Legajo: {item.studentNumber}
                  </Text>
                ) : null}
              </View>
            </View>

            <View
              style={[styles.statusDivider, { backgroundColor: colors.border }]}
            />

            <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>
              Estado de asistencia
            </Text>

            <AttendanceStatusSelector
              status={attendanceWithDefaults[item.id]}
              onChange={(status) => handleStatusChange(item.id, status)}
            />
          </AppCard>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={38} color={colors.inactive} />

            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No hay estudiantes registrados en esta cursada.
            </Text>
          </View>
        }
      />

      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
          },
        ]}
      > //Confirma y envia los registros
        <AppButton
          label="Guardar asistencia"
          icon="checkmark-done"
          onPress={handleSaveAttendance}
          variant="danger"
          size="large"
          fullWidth
          loading={isSaving}
          disabled={isSaving}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 22,
    gap: 16,
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

  headerText: {
    gap: 6,
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.5,
  },

  courseName: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
  },

  sessionInfo: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: "700",
  },

  listContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 105,
  },

  separator: {
    height: 12,
  },

  studentCard: {
    borderRadius: 0,
  },

  studentInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 15,
  },

  studentIcon: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2563EB20",
  },

  studentDetails: {
    flex: 1,
    gap: 5,
  },

  studentName: {
    fontSize: 17,
    fontWeight: "800",
  },

  studentNumber: {
    fontSize: 13,
    fontWeight: "500",
  },

  statusDivider: {
    height: 1,
    marginBottom: 13,
  },

  statusLabel: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 10,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    gap: 12,
  },

  emptyText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
  },

  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderTopWidth: 1,
  },
});
