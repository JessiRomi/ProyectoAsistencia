import { Ionicons } from "@expo/vector-icons";
import {
  Stack,
  router,
  useLocalSearchParams,
} from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type {
  AttendanceRecord,
  AttendanceStatus,
} from "@/features/attendance/attendance.types";
import { useSessionAttendance } from "@/features/attendance/useSessionAttendance";

function getStatusLabel(status: AttendanceStatus) {
  switch (status) {
    case "PRESENT":
      return "Presente";

    case "ABSENT":
      return "Ausente";

    case "LATE":
      return "Tardanza";

    case "JUSTIFIED":
      return "Justificada";

    default:
      return status;
  }
}

function getStatusStyles(status: AttendanceStatus) {
  switch (status) {
    case "PRESENT":
      return {
        badge: styles.presentBadge,
        text: styles.presentText,
        icon: "checkmark-circle-outline" as const,
      };

    case "ABSENT":
      return {
        badge: styles.absentBadge,
        text: styles.absentText,
        icon: "close-circle-outline" as const,
      };

    case "LATE":
      return {
        badge: styles.lateBadge,
        text: styles.lateText,
        icon: "time-outline" as const,
      };

    case "JUSTIFIED":
      return {
        badge: styles.justifiedBadge,
        text: styles.justifiedText,
        icon: "document-text-outline" as const,
      };

    default:
      return {
        badge: styles.absentBadge,
        text: styles.absentText,
        icon: "help-circle-outline" as const,
      };
  }
}

function StudentAttendanceCard({
  record,
}: {
  record: AttendanceRecord;
}) {
  const statusStyles = getStatusStyles(record.status);

  const initials = `${record.student.firstName.charAt(0)}${record.student.lastName.charAt(0)}`.toUpperCase();

  return (
    <View style={styles.studentCard}>
      <View style={styles.studentInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {initials}
          </Text>
        </View>

        <View style={styles.studentData}>
          <Text style={styles.studentName}>
            {record.student.firstName}{" "}
            {record.student.lastName}
          </Text>

          {record.student.studentNumber ? (
            <Text style={styles.studentNumber}>
              Legajo: {record.student.studentNumber}
            </Text>
          ) : null}
        </View>
      </View>

      <View
        style={[
          styles.statusBadge,
          statusStyles.badge,
        ]}
      >
        <Ionicons
          name={statusStyles.icon}
          size={16}
          color={statusStyles.text.color}
        />

        <Text
          style={[
            styles.statusText,
            statusStyles.text,
          ]}
        >
          {getStatusLabel(record.status)}
        </Text>
      </View>

      {record.observation ? (
        <View style={styles.observationContainer}>
          <Ionicons
            name="chatbubble-outline"
            size={16}
            color="#64748B"
          />

          <Text style={styles.observation}>
            {record.observation}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

export default function SessionAttendanceScreen() {
  const params =
    useLocalSearchParams<{ id: string }>();

  const sessionId = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const {
    attendance,
    isLoading,
    error,
    reload,
  } = useSessionAttendance(sessionId);

  const presentCount = attendance.filter(
    (record) => record.status === "PRESENT",
  ).length;

  const absentCount = attendance.filter(
    (record) => record.status === "ABSENT",
  ).length;

  const lateCount = attendance.filter(
    (record) => record.status === "LATE",
  ).length;

  const justifiedCount = attendance.filter(
    (record) => record.status === "JUSTIFIED",
  ).length;

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color="#0F172A"
            />
          </Pressable>

          <View style={styles.headerContent}>
            <Text style={styles.title}>
              Detalle de asistencia
            </Text>

            <Text style={styles.subtitle}>
              Asistencia registrada
            </Text>
          </View>
        </View>

        {isLoading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator
              size="large"
              color="#0E6FB8"
            />

            <Text style={styles.loadingText}>
              Cargando asistencia...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.centerContent}>
            <Ionicons
              name="alert-circle-outline"
              size={42}
              color="#DC2626"
            />

            <Text style={styles.errorTitle}>
              No se pudo cargar la asistencia
            </Text>

            <Text style={styles.errorText}>
              {error}
            </Text>

            <Pressable
              style={styles.retryButton}
              onPress={reload}
            >
              <Text style={styles.retryButtonText}>
                Reintentar
              </Text>
            </Pressable>
          </View>
        ) : attendance.length === 0 ? (
          <View style={styles.centerContent}>
            <Ionicons
              name="people-outline"
              size={48}
              color="#64748B"
            />

            <Text style={styles.emptyTitle}>
              No hay asistencia registrada
            </Text>

            <Text style={styles.emptyText}>
              No se encontraron registros de asistencia
              para esta sesión.
            </Text>
          </View>
        ) : (
          <FlatList
            data={attendance}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <StudentAttendanceCard
                record={item}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshing={isLoading}
            onRefresh={reload}
            ListHeaderComponent={
              <View>
                <View style={styles.summaryCard}>
                  <View style={styles.summaryHeader}>
                    <Ionicons
                      name="stats-chart-outline"
                      size={22}
                      color="#0E6FB8"
                    />

                    <Text style={styles.summaryTitle}>
                      Resumen
                    </Text>
                  </View>

                  <View style={styles.summaryGrid}>
                    <View style={styles.summaryItem}>
                      <Text style={styles.summaryNumber}>
                        {attendance.length}
                      </Text>

                      <Text style={styles.summaryLabel}>
                        Alumnos
                      </Text>
                    </View>

                    <View style={styles.summaryItem}>
                      <Text
                        style={[
                          styles.summaryNumber,
                          styles.presentNumber,
                        ]}
                      >
                        {presentCount}
                      </Text>

                      <Text style={styles.summaryLabel}>
                        Presentes
                      </Text>
                    </View>

                    <View style={styles.summaryItem}>
                      <Text
                        style={[
                          styles.summaryNumber,
                          styles.absentNumber,
                        ]}
                      >
                        {absentCount}
                      </Text>

                      <Text style={styles.summaryLabel}>
                        Ausentes
                      </Text>
                    </View>

                    <View style={styles.summaryItem}>
                      <Text
                        style={[
                          styles.summaryNumber,
                          styles.lateNumber,
                        ]}
                      >
                        {lateCount}
                      </Text>

                      <Text style={styles.summaryLabel}>
                        Tardanzas
                      </Text>
                    </View>

                    <View style={styles.summaryItem}>
                      <Text
                        style={[
                          styles.summaryNumber,
                          styles.justifiedNumber,
                        ]}
                      >
                        {justifiedCount}
                      </Text>

                      <Text style={styles.summaryLabel}>
                        Justificadas
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>
                    Alumnos
                  </Text>

                  <Text style={styles.sectionCount}>
                    {attendance.length}
                  </Text>
                </View>
              </View>
            }
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#CBD5E1",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F5F9",
    marginRight: 12,
  },

  headerContent: {
    flex: 1,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0F172A",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#64748B",
  },

  listContent: {
    padding: 16,
    paddingBottom: 32,
  },

  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },

  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  summaryTitle: {
    marginLeft: 8,
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
  },

  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  summaryItem: {
    width: "19%",
    alignItems: "center",
  },

  summaryNumber: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
  },

  summaryLabel: {
    marginTop: 4,
    fontSize: 10,
    color: "#64748B",
    textAlign: "center",
  },

  presentNumber: {
    color: "#16A34A",
  },

  absentNumber: {
    color: "#DC2626",
  },

  lateNumber: {
    color: "#D97706",
  },

  justifiedNumber: {
    color: "#7C3AED",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },

  sectionCount: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748B",
  },

  studentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },

  studentInfo: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E0F2FE",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0E6FB8",
  },

  studentData: {
    flex: 1,
    marginLeft: 12,
  },

  studentName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },

  studentNumber: {
    marginTop: 3,
    fontSize: 12,
    color: "#64748B",
  },

  statusBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  statusText: {
    marginLeft: 5,
    fontSize: 12,
    fontWeight: "700",
  },

  presentBadge: {
    backgroundColor: "#DCFCE7",
  },

  presentText: {
    color: "#166534",
  },

  absentBadge: {
    backgroundColor: "#FEE2E2",
  },

  absentText: {
    color: "#991B1B",
  },

  lateBadge: {
    backgroundColor: "#FEF3C7",
  },

  lateText: {
    color: "#92400E",
  },

  justifiedBadge: {
    backgroundColor: "#EDE9FE",
  },

  justifiedText: {
    color: "#6D28D9",
  },

  observationContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },

  observation: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: "#475569",
    lineHeight: 19,
  },

  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#64748B",
  },

  errorTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
  },

  errorText: {
    marginTop: 6,
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
  },

  retryButton: {
    marginTop: 20,
    backgroundColor: "#0E6FB8",
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 10,
  },

  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  emptyTitle: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
  },

  emptyText: {
    marginTop: 6,
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
  },
});