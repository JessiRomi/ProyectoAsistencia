import { useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AttendanceStatusSelector } from "@/components/attendance/AttendanceStatusSelector";

type Student = {
  id: string;
  firstName: string;
  lastName: string;
};

type AttendanceState = Record<string, boolean>;

const students: Student[] = [
  {
    id: "1",
    firstName: "Sofía",
    lastName: "Gómez",
  },
  {
    id: "2",
    firstName: "Martín",
    lastName: "Rodríguez",
  },
  {
    id: "3",
    firstName: "Lucía",
    lastName: "Fernández",
  },
  {
    id: "4",
    firstName: "Tomás",
    lastName: "Pérez",
  },
  {
    id: "5",
    firstName: "Valentina",
    lastName: "López",
  },
  {
    id: "6",
    firstName: "Nicolás",
    lastName: "García",
  },
  {
    id: "7",
    firstName: "Camila",
    lastName: "Martínez",
  },
  {
    id: "8",
    firstName: "Juan",
    lastName: "Sánchez",
  },
];

export default function AttendanceScreen() {
  const [attendance, setAttendance] =
    useState<AttendanceState>(() =>
      Object.fromEntries(
        students.map((student) => [student.id, false]),
      ),
    );

  const presentCount = students.filter(
    (student) => attendance[student.id],
  ).length;

  const absentCount = students.length - presentCount;

  function updateAttendance(
    studentId: string,
    present: boolean,
  ) {
    setAttendance((current) => ({
      ...current,
      [studentId]: present,
    }));
  }

  function markEveryonePresent() {
    setAttendance(
      Object.fromEntries(
        students.map((student) => [student.id, true]),
      ),
    );
  }

  function saveAttendance() {
    Alert.alert(
      "Asistencia",
      "La asistencia se guardaría mediante la API en este punto.",
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Tomar asistencia
        </Text>

        <Text style={styles.subtitle}>
          Aplicaciones Móviles · Comisión A
        </Text>
      </View>

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
      </View>

      <Pressable
        style={styles.allPresentButton}
        onPress={markEveryonePresent}
      >
        <Text style={styles.allPresentText}>
          Marcar todos presentes
        </Text>
      </Pressable>

      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
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
              present={attendance[item.id]}
              onChange={(present) =>
                updateAttendance(item.id, present)
              }
            />
          </View>
        )}
      />

      <View style={styles.footer}>
        <Pressable
          style={styles.saveButton}
          onPress={saveAttendance}
        >
          <Text style={styles.saveButtonText}>
            Guardar asistencia
          </Text>
        </Pressable>
      </View>
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
    paddingBottom: 15,
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
    padding: 16,
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
    fontSize: 24,
    fontWeight: "800",
    color: "#1F2937",
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

  saveButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});
