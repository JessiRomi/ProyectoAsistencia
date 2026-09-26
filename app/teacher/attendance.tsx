import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AttendanceStatusSelector } from "@/components/attendance/AttendanceStatusSelector";
import { useCourseStudents } from "@/features/courses/useCourseStudents";
import { useTeacherCourses } from "@/features/courses/useTeacherCourses";
import { useAttendance } from "@/features/attendance/useAttendance";
import type { AttendanceStatus } from "@/features/attendance/attendance.types";

type AttendanceState = Record<string, AttendanceStatus>;

export default function AttendanceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    students,
    isLoading: studentsLoading,
    error: studentsError,
    reload: reloadStudents,
  } = useCourseStudents(id);

  const {
    courses,
    isLoading: coursesLoading,
  } = useTeacherCourses();

  const {
    saveAttendance,
    isSaving,
    error: attendanceError,
    clearError,
  } = useAttendance();

  const [attendance, setAttendance] =
    useState<AttendanceState>({});

  const course = courses.find((item) => item.id === id);

  useEffect(() => {
    if (students.length === 0) {
      setAttendance({});
      return;
    }

    setAttendance((current) => {
      const next: AttendanceState = {};

      students.forEach((student) => {
        next[student.id] =
          current[student.id] ?? "ABSENT";
      });

      return next;
    });
  }, [students]);

  const presentCount = students.filter(
    (student) => attendance[student.id] === "PRESENT",
  ).length;

  const absentCount = students.filter(
    (student) => attendance[student.id] === "ABSENT",
  ).length;

  const lateCount = students.filter(
    (student) => attendance[student.id] === "LATE",
  ).length;

  const justifiedCount = students.filter(
    (student) => attendance[student.id] === "JUSTIFIED",
  ).length;

  function updateAttendance(
    studentId: string,
    status: AttendanceStatus,
  ) {
    clearError();

    setAttendance((current) => ({
      ...current,
      [studentId]: status,
    }));
  }

  function markEveryonePresent() {
    const allPresent: AttendanceState = {};

    students.forEach((student) => {
      allPresent[student.id] = "PRESENT";
    });

    setAttendance(allPresent);
    clearError();
  }

  async function handleSaveAttendance() {
    if (!id) {
      return;
    }

    try {
      const records = students.map((student) => ({
        studentId: student.id,
        status: attendance[student.id] ?? "ABSENT",
      }));

      await saveAttendance(id, records);

      Alert.alert(
        "Asistencia guardada",
        "La asistencia se guardó correctamente.",
        [
          {
            text: "Aceptar",
            onPress: () => router.back(),
          },
        ],
      );
    } catch {
      // El error ya es gestionado por useAttendance.
    }
  }

  if (studentsLoading || coursesLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator
          size="large"
          color="#4070B2"
        />

        <Text style={styles.loadingText}>
          Cargando estudiantes...
        </Text>
      </View>
    );
  }

  if (studentsError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>
          No se pudieron cargar los estudiantes
        </Text>

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

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>
            Volver
          </Text>
        </Pressable>
      </View>
    );
  }

  if (!id) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>
          Cursada no seleccionada
        </Text>

        <Text style={styles.errorText}>
          No se recibió el identificador de la cursada.
        </Text>

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>
            Volver
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Pressable
          style={styles.backRow}
          onPress={() => router.back()}
        >
          <Text style={styles.backIcon}>‹</Text>

          <Text style={styles.backText}>
            Volver
          </Text>
        </Pressable>

        <Text style={styles.title}>
          Tomar asistencia
        </Text>

        <Text style={styles.subtitle}>
          {course
            ? `${course.subject.name} · Comisión ${course.commission}`
            : "Cursada seleccionada"}
        </Text>
      </View>

      {/* Resumen */}
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>
            {presentCount}
          </Text>

          <Text style={styles.summaryLabel}>
            Presentes
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>
            {absentCount}
          </Text>

          <Text style={styles.summaryLabel}>
            Ausentes
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>
            {lateCount}
          </Text>

          <Text style={styles.summaryLabel}>
            Tardanzas
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>
            {justifiedCount}
          </Text>

          <Text style={styles.summaryLabel}>
            Justificadas
          </Text>
        </View>
      </View>

      {/* Error al guardar */}
      {attendanceError && (
        <View style={styles.attendanceError}>
          <Text style={styles.attendanceErrorText}>
            {attendanceError}
          </Text>
        </View>
      )}

      {/* Marcar todos */}
      {students.length > 0 && (
        <Pressable
          style={styles.allPresentButton}
          onPress={markEveryonePresent}
          disabled={isSaving}
        >
          <Text style={styles.allPresentText}>
            Marcar todos presentes
          </Text>
        </Pressable>
      )}

      {/* Sin estudiantes */}
      {students.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>
            No hay estudiantes inscriptos
          </Text>

          <Text style={styles.emptyText}>
            Esta cursada no tiene estudiantes registrados.
          </Text>
        </View>
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.studentCard}>
              <View style={styles.studentInfo}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {item.firstName.charAt(0)}
                    {item.lastName.charAt(0)}
                  </Text>
                </View>

                <View style={styles.nameContainer}>
                  <Text style={styles.studentName}>
                    {item.firstName} {item.lastName}
                  </Text>
                </View>
              </View>

              <AttendanceStatusSelector
                status={
                  attendance[item.id] ?? "ABSENT"
                }
                onChange={(status) =>
                  updateAttendance(
                    item.id,
                    status,
                  )
                }
              />
            </View>
          )}
        />
      )}

      {/* Guardar */}
      {students.length > 0 && (
        <View style={styles.footer}>
          <Pressable
            style={[
              styles.saveButton,
              isSaving && styles.saveButtonDisabled,
            ]}
            onPress={handleSaveAttendance}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator
                color="#FFFFFF"
              />
            ) : (
              <Text style={styles.saveButtonText}>
                Guardar asistencia
              </Text>
            )}
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  centerContainer: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: "#6B7280",
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

  backButton: {
    marginTop: 12,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },

  backButtonText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "700",
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 15,
  },

  backRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  backIcon: {
    fontSize: 35,
    lineHeight: 30,
    color: "#4070B2",
    marginRight: 8,
  },

  backText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4070B2",
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

  summary: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },

  summaryItem: {
    alignItems: "center",
    flex: 1,
  },

  summaryNumber: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1F2937",
  },

  summaryLabel: {
    marginTop: 3,
    fontSize: 11,
    color: "#6B7280",
    textAlign: "center",
  },

  divider: {
    width: 1,
    height: 35,
    backgroundColor: "#E5E7EB",
  },

  attendanceError: {
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#FEE2E2",
  },

  attendanceErrorText: {
    color: "#991B1B",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },

  allPresentButton: {
    marginHorizontal: 20,
    marginBottom: 10,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#E8F0FB",
  },

  allPresentText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4070B2",
  },

  list: {
    paddingHorizontal: 20,
    paddingBottom: 110,
    gap: 10,
  },

  studentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  studentInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#E8F0FB",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#4070B2",
  },

  nameContainer: {
    flex: 1,
    marginLeft: 11,
  },

  studentName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  emptyTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#1F2937",
    textAlign: "center",
  },

  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },

  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  saveButton: {
    paddingVertical: 15,
    borderRadius: 13,
    alignItems: "center",
    backgroundColor: "#4070B2",
  },

  saveButtonDisabled: {
    opacity: 0.7,
  },

  saveButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});

