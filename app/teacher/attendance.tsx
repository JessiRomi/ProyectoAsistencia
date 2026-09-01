import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Student = {
  id: string;
  name: string;
  present: boolean;
};

const INITIAL_STUDENTS: Student[] = [
  {
    id: "1",
    name: "Juan Pérez",
    present: false,
  },
  {
    id: "2",
    name: "María González",
    present: false,
  },
  {
    id: "3",
    name: "Lucas Rodríguez",
    present: false,
  },
  {
    id: "4",
    name: "Sofía Fernández",
    present: false,
  },
  {
    id: "5",
    name: "Martín López",
    present: false,
  },
  {
    id: "6",
    name: "Valentina Díaz",
    present: false,
  },
  {
    id: "7",
    name: "Nicolás Martínez",
    present: false,
  },
  {
    id: "8",
    name: "Camila Romero",
    present: false,
  },
];

export default function TeacherAttendanceScreen() {
  const [students, setStudents] =
    useState<Student[]>(INITIAL_STUDENTS);

  function toggleAttendance(id: string) {
    setStudents((current) =>
      current.map((student) =>
        student.id === id
          ? {
              ...student,
              present: !student.present,
            }
          : student
      )
    );
  }

  function markAllPresent() {
    setStudents((current) =>
      current.map((student) => ({
        ...student,
        present: true,
      }))
    );
  }

  function saveAttendance() {
    const present = students.filter(
      (student) => student.present
    ).length;

    Alert.alert(
      "Asistencia registrada",
      `Se registraron ${present} presentes de ${students.length} estudiantes.`
    );
  }

  const presentCount = students.filter(
    (student) => student.present
  ).length;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
            Aplicaciones Móviles
          </Text>
        </Pressable>

        <View style={styles.header}>
          <View>
            <Text style={styles.title}>
              Tomar asistencia
            </Text>

            <Text style={styles.subtitle}>
              Aplicaciones Móviles · Comisión A
            </Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>
              {students.length}
            </Text>

            <Text style={styles.summaryLabel}>
              Alumnos
            </Text>
          </View>

          <View style={styles.divider} />

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
              {students.length - presentCount}
            </Text>

            <Text style={styles.summaryLabel}>
              Ausentes
            </Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <Text style={styles.listTitle}>
            Lista de alumnos
          </Text>

          <Pressable
            style={styles.allButton}
            onPress={markAllPresent}
          >
            <Text style={styles.allButtonText}>
              Todos presentes
            </Text>
          </Pressable>
        </View>

        <View style={styles.studentList}>
          {students.map((student, index) => (
            <Pressable
              key={student.id}
              style={[
                styles.studentRow,
                index !== students.length - 1 &&
                  styles.studentBorder,
              ]}
              onPress={() =>
                toggleAttendance(student.id)
              }
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {student.name.charAt(0)}
                </Text>
              </View>

              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>
                  {student.name}
                </Text>

                <Text style={styles.studentStatus}>
                  {student.present
                    ? "Presente"
                    : "Ausente"}
                </Text>
              </View>

              <View
                style={[
                  styles.checkButton,
                  student.present &&
                    styles.checkButtonActive,
                ]}
              >
                <Ionicons
                  name={
                    student.present
                      ? "checkmark"
                      : "close"
                  }
                  size={21}
                  color="#FFFFFF"
                />
              </View>
            </Pressable>
          ))}
        </View>

        <Pressable
          style={styles.saveButton}
          onPress={saveAttendance}
        >
          <Ionicons
            name="save-outline"
            size={21}
            color="#FFFFFF"
          />

          <Text style={styles.saveButtonText}>
            Guardar asistencia
          </Text>
        </Pressable>
      </ScrollView>
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
    paddingBottom: 40,
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
    marginBottom: 20,
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

  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 25,
  },

  summaryItem: {
    alignItems: "center",
    flex: 1,
  },

  summaryNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: "#4070B2",
  },

  summaryLabel: {
    marginTop: 3,
    fontSize: 12,
    color: "#6B7280",
  },

  divider: {
    width: 1,
    height: 35,
    backgroundColor: "#E5E7EB",
  },

  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  listTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#1F2937",
  },

  allButton: {
    backgroundColor: "#E8F0FB",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 9,
  },

  allButtonText: {
    color: "#4070B2",
    fontSize: 12,
    fontWeight: "700",
  },

  studentList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 16,
  },

  studentRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },

  studentBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#EEF1F5",
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E8F0FB",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "#4070B2",
    fontSize: 17,
    fontWeight: "800",
  },

  studentInfo: {
    flex: 1,
    marginLeft: 13,
  },

  studentName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
  },

  studentStatus: {
    marginTop: 3,
    fontSize: 12,
    color: "#6B7280",
  },

  checkButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#9CA3AF",
    alignItems: "center",
    justifyContent: "center",
  },

  checkButtonActive: {
    backgroundColor: "#4070B2",
  },

  saveButton: {
    marginTop: 22,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#4070B2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});
