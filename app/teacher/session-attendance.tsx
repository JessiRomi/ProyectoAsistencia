import { Ionicons } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useState } from "react";

import GeometricActionButton from "@/components/attendance/GeometricActionButton";
import { AppCard } from "@/components/ui/AppCard";
import { FeedbackState } from "@/components/ui/FeedbackState";

import { useAppTheme } from "@/features/theme/theme.provider";
import { useCourseSessions } from "@/features/attendance/useCourseSessions";
import { useSessionAttendance } from "@/features/attendance/useSessionAttendance";

import type {
  AttendanceRecord,
  AttendanceStatus,
} from "@/features/attendance/attendance.types";

const STUDENTS_PER_PAGE = 4;

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

function getStatusPresentation(
  status: AttendanceStatus,
  colors: ReturnType<typeof useAppTheme>["colors"],
) {
  switch (status) {
    case "PRESENT":
      return {
        icon: "checkmark-circle-outline" as const,
        color: colors.success,
      };

    case "ABSENT":
      return {
        icon: "close-circle-outline" as const,
        color: colors.error,
      };

    case "LATE":
      return {
        icon: "time-outline" as const,
        color: colors.warning,
      };

    case "JUSTIFIED":
      return {
        icon: "document-text-outline" as const,
        color: colors.secondary,
      };

    default:
      return {
        icon: "help-circle-outline" as const,
        color: colors.textSecondary,
      };
  }
}

function StudentAttendanceCard({
  record,
  cardColor,
}: {
  record: AttendanceRecord;
  cardColor: string;
}) {
  const { colors } = useAppTheme();

  const statusPresentation = getStatusPresentation(record.status, colors);

  const initials =
    `${record.student.firstName.charAt(0)}${record.student.lastName.charAt(0)}`.toUpperCase();

  return (
    <AppCard
      padding={16}
      style={[
        styles.studentCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderLeftColor: cardColor,
        },
      ]}
    >
      <View style={styles.studentInfo}>
        <View style={[styles.avatar, { backgroundColor: `${cardColor}25` }]}>
          <Text style={[styles.avatarText, { color: cardColor }]}>
            {initials}
          </Text>
        </View>

        <View style={styles.studentData}>
          <Text style={[styles.studentName, { color: colors.text }]}>
            {record.student.firstName} {record.student.lastName}
          </Text>

          {record.student.studentNumber ? (
            <Text
              style={[styles.studentNumber, { color: colors.textSecondary }]}
            >
              Legajo: {record.student.studentNumber}
            </Text>
          ) : null}
        </View>
      </View>

      <View
        style={[styles.statusBadge, { backgroundColor: colors.background }]}
      >
        <Ionicons
          name={statusPresentation.icon}
          size={16}
          color={statusPresentation.color}
        />

        <Text style={[styles.statusText, { color: statusPresentation.color }]}>
          {getStatusLabel(record.status)}
        </Text>
      </View>

      {record.observation ? (
        <View
          style={[
            styles.observationContainer,
            { borderTopColor: colors.border },
          ]}
        >
          <Ionicons
            name="chatbubble-outline"
            size={16}
            color={colors.textSecondary}
          />

          <Text style={[styles.observation, { color: colors.textSecondary }]}>
            {record.observation}
          </Text>
        </View>
      ) : null}
    </AppCard>
  );
}

export default function SessionAttendanceScreen() {
  const { colors } = useAppTheme();

  const [currentPage, setCurrentPage] = useState(0);

  const params = useLocalSearchParams<{
    id?: string | string[];
    courseOfferingId?: string | string[];
  }>();

  const sessionId = Array.isArray(params.id) ? params.id[0] : params.id;

  const courseOfferingId = Array.isArray(params.courseOfferingId)
    ? params.courseOfferingId[0]
    : params.courseOfferingId;

  const { attendance, isLoading, error, reload } =
    useSessionAttendance(sessionId);

  const {
    sessions,
    isLoading: isLoadingSessions,
    error: sessionsError,
  } = useCourseSessions(courseOfferingId ?? "");

  const session = sessions.find((item) => item.id === sessionId);

  const isSessionOpen = session?.status === "OPEN";

  // Los contadores se calculan sobre todos los registros.
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

  // Paginación de alumnos.
  const totalPages = Math.ceil(attendance.length / STUDENTS_PER_PAGE);

  const safePage = Math.min(currentPage, Math.max(totalPages - 1, 0));

  const startIndex = safePage * STUDENTS_PER_PAGE;

  const paginatedAttendance = attendance.slice(
    startIndex,
    startIndex + STUDENTS_PER_PAGE,
  );

  const cardColors = [colors.secondary, colors.accent, colors.success];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.surface,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Volver"
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="arrow-back" size={29} color={colors.text} />
          </Pressable>

          <View style={styles.headerContent}>
            <Text style={[styles.title, { color: colors.text }]}>
              Detalle de asistencia
            </Text>

            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Asistencia registrada
            </Text>
          </View>
        </View>

        {!isLoadingSessions && !sessionsError && isSessionOpen && (
          <View style={styles.qrButton}>
            <GeometricActionButton
              label="GENERAR QR DE ASISTENCIA"
              icon="qr-code-outline"
              onPress={() =>
                router.push({
                  pathname: "/teacher/session-qr",
                  params: {
                    id: sessionId,
                    courseOfferingId,
                  },
                })
              }
            />
          </View>
        )}

        {isLoading ? (
          <FeedbackState type="loading" message="Cargando asistencia..." />
        ) : error ? (
          <FeedbackState
            type="error"
            message={`No se pudo cargar la asistencia: ${error}`}
            onRetry={reload}
          />
        ) : attendance.length === 0 ? (
          <View style={styles.centerContent}>
            <Ionicons
              name="people-outline"
              size={48}
              color={colors.textSecondary}
            />

            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No hay asistencia registrada
            </Text>

            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No se encontraron registros de asistencia para esta sesión.
            </Text>
          </View>
        ) : (
          <FlatList
            data={paginatedAttendance}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <StudentAttendanceCard
                record={item}
                cardColor={cardColors[(startIndex + index) % cardColors.length]}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshing={isLoading}
            onRefresh={reload}
            ListHeaderComponent={
              <View>
                <AppCard
                  padding={16}
                  style={[
                    styles.summaryCard,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <View style={styles.summaryHeader}>
                    <Ionicons
                      name="stats-chart-outline"
                      size={22}
                      color={colors.secondary}
                    />

                    <Text style={[styles.summaryTitle, { color: colors.text }]}>
                      Resumen
                    </Text>
                  </View>

                  <View style={styles.summaryGrid}>
                    <View style={styles.summaryItem}>
                      <Text
                        style={[styles.summaryNumber, { color: colors.text }]}
                      >
                        {attendance.length}
                      </Text>

                      <Text
                        style={[
                          styles.summaryLabel,
                          { color: colors.textSecondary },
                        ]}
                      >
                        Alumnos
                      </Text>
                    </View>

                    <View style={styles.summaryItem}>
                      <Text
                        style={[
                          styles.summaryNumber,
                          { color: colors.success },
                        ]}
                      >
                        {presentCount}
                      </Text>

                      <Text
                        style={[
                          styles.summaryLabel,
                          { color: colors.textSecondary },
                        ]}
                      >
                        Presentes
                      </Text>
                    </View>

                    <View style={styles.summaryItem}>
                      <Text
                        style={[styles.summaryNumber, { color: colors.error }]}
                      >
                        {absentCount}
                      </Text>

                      <Text
                        style={[
                          styles.summaryLabel,
                          { color: colors.textSecondary },
                        ]}
                      >
                        Ausentes
                      </Text>
                    </View>

                    <View style={styles.summaryItem}>
                      <Text
                        style={[
                          styles.summaryNumber,
                          { color: colors.warning },
                        ]}
                      >
                        {lateCount}
                      </Text>

                      <Text
                        style={[
                          styles.summaryLabel,
                          { color: colors.textSecondary },
                        ]}
                      >
                        Tardanzas
                      </Text>
                    </View>

                    <View style={styles.summaryItem}>
                      <Text
                        style={[
                          styles.summaryNumber,
                          { color: colors.secondary },
                        ]}
                      >
                        {justifiedCount}
                      </Text>

                      <Text
                        style={[
                          styles.summaryLabel,
                          { color: colors.textSecondary },
                        ]}
                      >
                        Justificadas
                      </Text>
                    </View>
                  </View>
                </AppCard>

                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Estudiantes
                  </Text>

                  <Text
                    style={[
                      styles.sectionCount,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {attendance.length}
                  </Text>
                </View>
              </View>
            }
            ListFooterComponent={
              totalPages > 1
                ? () => (
                    <View
                      style={[
                        styles.pagination,
                        {
                          borderColor: colors.border,
                          backgroundColor: colors.surface,
                        },
                      ]}
                    >
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Página anterior"
                        disabled={safePage === 0}
                        onPress={() => setCurrentPage(safePage - 1)}
                        style={styles.paginationButton}
                      >
                        <Ionicons
                          name="chevron-back"
                          size={25}
                          color={
                            safePage === 0 ? colors.inactive : colors.secondary
                          }
                        />
                      </Pressable>

                      <Text
                        style={[styles.paginationText, { color: colors.text }]}
                      >
                        Página {safePage + 1} de {totalPages}
                      </Text>

                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Página siguiente"
                        disabled={safePage >= totalPages - 1}
                        onPress={() => setCurrentPage(safePage + 1)}
                        style={styles.paginationButton}
                      >
                        <Ionicons
                          name="chevron-forward"
                          size={25}
                          color={
                            safePage >= totalPages - 1
                              ? colors.inactive
                              : colors.secondary
                          }
                        />
                      </Pressable>
                    </View>
                  )
                : undefined
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
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 20,
    borderBottomWidth: 1,
    gap: 12,
  },

  backButton: {
    width: 40,
    height: 46,
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

  subtitle: {
    marginTop: 4,
    fontSize: 14,
  },

  qrButton: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  listContent: {
    padding: 16,
    paddingBottom: 32,
  },

  summaryCard: {
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 0,
  },

  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },

  summaryTitle: {
    fontSize: 17,
    fontWeight: "700",
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
  },

  summaryLabel: {
    marginTop: 4,
    fontSize: 10,
    textAlign: "center",
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
  },

  sectionCount: {
    fontSize: 13,
    fontWeight: "700",
  },

  studentCard: {
    marginBottom: 10,
    borderWidth: 1,
    borderLeftWidth: 6,
    borderRadius: 0,
  },

  studentInfo: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 0,
  },

  avatarText: {
    fontSize: 15,
    fontWeight: "800",
  },

  studentData: {
    flex: 1,
    marginLeft: 12,
  },

  studentName: {
    fontSize: 15,
    fontWeight: "700",
  },

  studentNumber: {
    marginTop: 3,
    fontSize: 12,
  },

  statusBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 0,
  },

  statusText: {
    marginLeft: 5,
    fontSize: 12,
    fontWeight: "700",
  },

  observationContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },

  observation: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    lineHeight: 19,
  },

  pagination: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 18,
    borderWidth: 1,
    borderRadius: 0,
    paddingHorizontal: 12,
  },

  paginationButton: {
    width: 42,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
  },

  paginationText: {
    fontSize: 14,
    fontWeight: "700",
  },

  pressed: {
    opacity: 0.65,
  },

  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },

  emptyTitle: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },

  emptyText: {
    marginTop: 6,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
