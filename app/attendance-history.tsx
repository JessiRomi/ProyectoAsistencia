import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { RouteGuard } from "@/components/auth/RouteGuard";
import { AppCard } from "@/components/ui/AppCard";
import { FeedbackState } from "@/components/ui/FeedbackState";
import { useAppTheme } from "@/features/theme/theme.provider";
import { useStudentAttendance } from "@/features/attendance/useStudentAttendance";
import { useStudentEnrollments } from "@/features/courses/useStudentEnrollments";

const PAGE_SIZE = 3;

export default function AttendanceHistoryScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <RouteGuard allowedRoles={["STUDENT"]}>
        <AttendanceHistoryContent />
      </RouteGuard>
    </>
  );
}

function AttendanceHistoryContent() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [currentPage, setCurrentPage] = useState(1);

  const {
    records,
    isLoading: attendanceLoading,
    error: attendanceError,
    reload: reloadAttendance,
  } = useStudentAttendance();

  const {
    enrollments,
    isLoading: enrollmentsLoading,
    error: enrollmentsError,
    reload: reloadEnrollments,
  } = useStudentEnrollments();

  const isLoading = attendanceLoading || enrollmentsLoading;
  const error = attendanceError || enrollmentsError;

  const activeEnrollments = enrollments.filter(
    (enrollment) => enrollment.status === "ACTIVE",
  );

  const subjects = activeEnrollments.map((enrollment) => {
    const offering = enrollment.courseOffering;

    const subjectRecords = records.filter(
      (record) =>
        record.classSession.courseOfferingId === enrollment.courseOfferingId,
    );

    const totals = subjectRecords.reduce(
      (result, record) => {
        result[record.status] += 1;
        return result;
      },
      {
        PRESENT: 0,
        ABSENT: 0,
        LATE: 0,
        JUSTIFIED: 0,
      },
    );

    return {
      id: enrollment.courseOfferingId,
      name: offering.subject.name,
      code: offering.subject.code,
      commission: offering.commission,
      year: offering.academicYear.year,
      total: subjectRecords.length,
      totals,
    };
  });

  const totalPages = Math.ceil(subjects.length / PAGE_SIZE);
  const safeCurrentPage = Math.min(currentPage, Math.max(totalPages, 1));

  const visibleSubjects = subjects.slice(
    (safeCurrentPage - 1) * PAGE_SIZE,
    safeCurrentPage * PAGE_SIZE,
  );

  const subjectColors = [colors.secondary, colors.accent, colors.success];

  async function handleRetry() {
    await Promise.all([reloadAttendance(), reloadEnrollments()]);
  }

  function handlePreviousPage() {
    setCurrentPage((previous) => Math.max(previous - 1, 1));
  }

  function handleNextPage() {
    setCurrentPage((previous) => Math.min(previous + 1, totalPages));
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.border,
            paddingTop: insets.top,
            minHeight: 95 + insets.top,
          },
        ]}
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

        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Mi asistencia
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading && (
          <FeedbackState
            type="loading"
            message="Consultando tus materias y asistencias..."
          />
        )}

        {!isLoading && error !== "" && (
          <FeedbackState
            type="error"
            message={error}
            onRetry={() => void handleRetry()}
          />
        )}

        {!isLoading && !error && (
          <>
            {subjects.length === 0 ? (
              <AppCard style={styles.messageCard}>
                <Ionicons
                  name="book-outline"
                  size={38}
                  color={colors.textSecondary}
                />

                <Text style={[styles.messageTitle, { color: colors.text }]}>
                  No tenés cursadas activas
                </Text>

                <Text
                  style={[styles.messageText, { color: colors.textSecondary }]}
                >
                  Cuando tengas materias inscriptas, aparecerán en esta sección.
                </Text>
              </AppCard>
            ) : (
              <>
                <View style={styles.subjectList}>
                  {visibleSubjects.map((subject, index) => {
                    const subjectIndex =
                      (safeCurrentPage - 1) * PAGE_SIZE + index;

                    const subjectColor =
                      subjectColors[subjectIndex % subjectColors.length];

                    return (
                      <Pressable
                        key={subject.id}
                        onPress={() =>
                          router.push({
                            pathname: "/student-subject-attendance",
                            params: {
                              courseOfferingId: subject.id,
                              subjectName: subject.name,
                              commission: subject.commission,
                            },
                          })
                        }
                        accessibilityRole="button"
                        accessibilityLabel={`Consultar asistencia de ${subject.name}, comisión ${subject.commission}`}
                        style={({ pressed }) => [
                          pressed && styles.subjectCardPressed,
                        ]}
                      >
                        <AppCard style={styles.subjectCard}>
                          <View style={styles.subjectHeader}>
                            <View
                              style={[
                                styles.subjectIcon,
                                { backgroundColor: subjectColor },
                              ]}
                            >
                              <Ionicons
                                name="book-outline"
                                size={24}
                                color={colors.white}
                              />
                            </View>

                            <View style={styles.subjectInfo}>
                              <Text
                                style={[
                                  styles.subjectName,
                                  { color: colors.text },
                                ]}
                              >
                                {subject.name}
                              </Text>

                              <Text
                                style={[
                                  styles.subjectMeta,
                                  { color: colors.textSecondary },
                                ]}
                              >
                                {subject.code} · Comisión {subject.commission}
                              </Text>

                              <Text
                                style={[
                                  styles.subjectMeta,
                                  { color: colors.textSecondary },
                                ]}
                              >
                                Año lectivo {subject.year}
                              </Text>
                            </View>

                            <Ionicons
                              name="chevron-forward"
                              size={23}
                              color={colors.textSecondary}
                            />
                          </View>

                          <View
                            style={[
                              styles.divider,
                              { backgroundColor: colors.border },
                            ]}
                          />

                          {subject.total === 0 ? (
                            <Text
                              style={[
                                styles.noRecords,
                                { color: colors.textSecondary },
                              ]}
                            >
                              Sin registros de asistencia
                            </Text>
                          ) : (
                            <View style={styles.attendanceSummary}>
                              <View style={styles.attendanceItem}>
                                <Ionicons
                                  name="checkmark-circle"
                                  size={18}
                                  color={colors.success}
                                />

                                <Text
                                  style={[
                                    styles.presentText,
                                    { color: colors.success },
                                  ]}
                                >
                                  Presentes: {subject.totals.PRESENT}
                                </Text>
                              </View>

                              <View style={styles.attendanceItem}>
                                <Ionicons
                                  name="close-circle"
                                  size={18}
                                  color={colors.error}
                                />

                                <Text
                                  style={[
                                    styles.absentText,
                                    { color: colors.error },
                                  ]}
                                >
                                  Ausentes: {subject.totals.ABSENT}
                                </Text>
                              </View>

                              <Text
                                style={[
                                  styles.totalText,
                                  { color: colors.textSecondary },
                                ]}
                              >
                                {subject.total}{" "}
                                {subject.total === 1 ? "registro" : "registros"}
                              </Text>
                            </View>
                          )}
                        </AppCard>
                      </Pressable>
                    );
                  })}
                </View>

                {totalPages > 1 && (
                  <View style={styles.pagination}>
                    <Pressable
                      onPress={handlePreviousPage}
                      disabled={safeCurrentPage === 1}
                      accessibilityRole="button"
                      accessibilityLabel="Página anterior"
                      style={[
                        styles.paginationButton,
                        {
                          borderColor: colors.border,
                          backgroundColor: colors.surface,
                        },
                        safeCurrentPage === 1 && styles.paginationDisabled,
                      ]}
                    >
                      <Ionicons
                        name="chevron-back"
                        size={18}
                        color={
                          safeCurrentPage === 1 ? colors.inactive : colors.text
                        }
                      />

                      <Text
                        style={[
                          styles.paginationButtonText,
                          {
                            color:
                              safeCurrentPage === 1
                                ? colors.inactive
                                : colors.text,
                          },
                        ]}
                      >
                        Anterior
                      </Text>
                    </Pressable>

                    <Text
                      style={[
                        styles.paginationIndicator,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Página {safeCurrentPage} de {totalPages}
                    </Text>

                    <Pressable
                      onPress={handleNextPage}
                      disabled={safeCurrentPage === totalPages}
                      accessibilityRole="button"
                      accessibilityLabel="Página siguiente"
                      style={[
                        styles.paginationButton,
                        {
                          borderColor: colors.border,
                          backgroundColor: colors.surface,
                        },
                        safeCurrentPage === totalPages &&
                          styles.paginationDisabled,
                      ]}
                    >
                      <Text
                        style={[
                          styles.paginationButtonText,
                          {
                            color:
                              safeCurrentPage === totalPages
                                ? colors.inactive
                                : colors.text,
                          },
                        ]}
                      >
                        Siguiente
                      </Text>

                      <Ionicons
                        name="chevron-forward"
                        size={18}
                        color={
                          safeCurrentPage === totalPages
                            ? colors.inactive
                            : colors.text
                        }
                      />
                    </Pressable>
                  </View>
                )}
              </>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    minHeight: 95,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 16,
    borderBottomWidth: 1,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
  },

  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 40,
  },

  subjectList: {
    gap: 14,
  },

  subjectCard: {
    marginBottom: 0,
  },

  subjectCardPressed: {
    opacity: 0.8,
  },

  subjectHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  subjectIcon: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
  },

  subjectInfo: {
    flex: 1,
  },

  subjectName: {
    fontSize: 16,
    fontWeight: "800",
  },

  subjectMeta: {
    fontSize: 12,
    marginTop: 4,
  },

  divider: {
    height: 1,
    marginVertical: 14,
  },

  attendanceSummary: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
  },

  attendanceItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  presentText: {
    fontSize: 12,
    fontWeight: "700",
  },

  absentText: {
    fontSize: 12,
    fontWeight: "700",
  },

  totalText: {
    fontSize: 11,
  },

  noRecords: {
    fontSize: 13,
    fontStyle: "italic",
  },

  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 24,
    gap: 8,
  },

  paginationButton: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
  },

  paginationButtonText: {
    fontSize: 12,
    fontWeight: "700",
  },

  paginationIndicator: {
    fontSize: 12,
    fontWeight: "600",
  },

  paginationDisabled: {
    opacity: 0.45,
  },

  messageCard: {
    alignItems: "center",
    gap: 10,
    padding: 26,
  },

  messageTitle: {
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
  },

  messageText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
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
