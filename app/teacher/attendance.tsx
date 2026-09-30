import { router, useLocalSearchParams } from "expo-router";

import React, {
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  AttendanceStatusSelector,
} from "@/components/attendance/AttendanceStatusSelector";

import { useCourseStudents } from "@/features/courses/useCourseStudents";
import { useTeacherCourses } from "@/features/courses/useTeacherCourses";
import { useAttendance } from "@/features/attendance/useAttendance";

import type { AttendanceStatus } from "@/features/attendance/attendance.types";

type AttendanceState = Record<
  string,
  AttendanceStatus
>;

export default function TeacherAttendanceScreen() {
  const params = useLocalSearchParams<{
    id?: string;
    sessionId?: string;
  }>();

  const id = params.id;
  const sessionId = params.sessionId;

  const {
    courses,
    isLoading: isLoadingCourses,
  } = useTeacherCourses();

  const course = courses.find(
    (item) => item.id === id,
  );

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

  const [attendance, setAttendance] =
    useState<AttendanceState>({});

  useEffect(() => {
    if (!students.length) {
      return;
    }

    const initialState: AttendanceState = {};

    students.forEach((student) => {
      initialState[student.id] = "ABSENT";
    });

    setAttendance(initialState);
  }, [students]);

  function handleStatusChange(
    studentId: string,
    status: AttendanceStatus,
  ) {
    setAttendance((current) => ({
      ...current,
      [studentId]: status,
    }));
  }

  async function handleSaveAttendance() {
    if (!id) {
      Alert.alert(
        "Error",
        "No se encontró la cursada.",
      );
      return;
    }

    if (!students.length) {
      Alert.alert(
        "Sin estudiantes",
        "No hay estudiantes para registrar.",
      );
      return;
    }

    const records = students.map((student) => ({
      studentId: student.id,
      status:
        attendance[student.id] ?? "ABSENT",
    }));

    try {
      /*
       * Si llegamos desde "Crear nueva clase",
       * usamos exactamente la sesión creada.
       */
      if (sessionId) {
        await saveAttendanceForSession(
          sessionId,
          records,
        );
      } else {
        /*
         * Mantenemos el flujo anterior para no romper
         * la pantalla si se accede directamente.
         */
        await saveAttendance(
          id,
          records,
        );
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
      console.error(
        "Error guardando asistencia:",
        error,
      );

      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : attendanceError ||
              "No se pudo guardar la asistencia.",
      );
    }
  }

  if (
    isLoadingCourses ||
    isLoadingStudents
  ) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Cargando estudiantes...
        </Text>
      </View>
    );
  }

  if (!id) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          No se encontró la cursada.
        </Text>
      </View>
    );
  }

  if (studentsError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {studentsError}
        </Text>

        <Pressable
          style={styles.retryButton}
          onPress={reloadStudents}
        >
          <Text style={styles.retryButtonText}>
            Reintentar
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Tomar asistencia
        </Text>

        <Text style={styles.courseName}>
          {course?.subject?.name ??
            "Curso seleccionado"}
        </Text>

        {sessionId ? (
          <Text style={styles.sessionInfo}>
            Nueva clase
          </Text>
        ) : null}
      </View>

      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          styles.listContent
        }
        renderItem={({ item }) => (
          <View style={styles.studentCard}>
            <View
              style={styles.studentInfo}
            >
              <Text style={styles.studentName}>
                {item.firstName}{" "}
                {item.lastName}
              </Text>

              {item.studentNumber ? (
                <Text
                  style={
                    styles.studentNumber
                  }
                >
                  Legajo:{" "}
                  {item.studentNumber}
                </Text>
              ) : null}
            </View>

            <AttendanceStatusSelector
              status={
                attendance[item.id] ??
                "ABSENT"
              }
              onChange={(status) =>
                handleStatusChange(
                  item.id,
                  status,
                )
              }
            />
          </View>
        )}
        ListEmptyComponent={
          <View
            style={styles.emptyContainer}
          >
            <Text
              style={styles.emptyText}
            >
              No hay estudiantes registrados
              en esta cursada.
            </Text>
          </View>
        }
      />

      <View style={styles.footer}>
        <Pressable
          style={[
            styles.saveButton,
            isSaving &&
              styles.saveButtonDisabled,
          ]}
          onPress={handleSaveAttendance}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator
              color="#ffffff"
            />
          ) : (
            <Text
              style={styles.saveButtonText}
            >
              Guardar asistencia
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f8fa",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#555",
  },

  errorText: {
    fontSize: 16,
    color: "#c62828",
    textAlign: "center",
    marginBottom: 16,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
  },

  courseName: {
    marginTop: 6,
    fontSize: 16,
    color: "#4b5563",
  },

  sessionInfo: {
    marginTop: 4,
    fontSize: 14,
    color: "#2563eb",
    fontWeight: "600",
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },

  studentCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  studentInfo: {
    marginBottom: 12,
  },

  studentName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111827",
  },

  studentNumber: {
    marginTop: 4,
    fontSize: 13,
    color: "#6b7280",
  },

  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },

  emptyText: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
  },

  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },

  saveButton: {
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111827",
  },

  saveButtonDisabled: {
    opacity: 0.6,
  },

  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },

  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#111827",
  },

  retryButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
});