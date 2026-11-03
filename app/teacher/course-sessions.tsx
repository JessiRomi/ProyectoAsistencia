import { Ionicons } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useState } from "react";

import { AppButton } from "@/components/ui/AppButton";
import { AppCard } from "@/components/ui/AppCard";
import type { ClassSession } from "@/features/attendance/attendance.types";
import { useCourseSessions } from "@/features/attendance/useCourseSessions";
import { useAppTheme } from "@/features/theme/theme.provider";

const SESSIONS_PER_PAGE = 3;

function formatDate(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
}

function getStatusLabel(status: ClassSession["status"]) {
  return status === "CLOSED" ? "Cerrada" : "Abierta";
}

function SessionCard({
  session,
  cardColor,
}: {
  session: ClassSession;
  cardColor: string;
}) {
  const { colors } = useAppTheme();
  const isClosed = session.status === "CLOSED";

  function openSessionDetail() {
    router.push({
      pathname: "/teacher/session-attendance",
      params: {
        id: session.id,
        courseOfferingId: session.courseOfferingId,
      },
    });
  }

  return (
    <AppCard
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderLeftColor: cardColor,
        },
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={23} color={cardColor} />

          <Text style={[styles.date, { color: colors.text }]}>
            {formatDate(session.date)}
          </Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: isClosed
                ? `${colors.success}20`
                : `${colors.warning}20`,
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              {
                color: isClosed ? colors.success : colors.warning,
              },
            ]}
          >
            {getStatusLabel(session.status)}
          </Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.topicContainer}>
        <Ionicons name="book-outline" size={20} color={cardColor} />

        <View style={styles.topicContent}>
          <Text style={[styles.topicLabel, { color: colors.textSecondary }]}>
            Tema
          </Text>

          <Text style={[styles.topic, { color: colors.text }]}>
            {session.topic || "Sin tema registrado"}
          </Text>
        </View>
      </View>

      {session.notes ? (
        <View style={styles.notesContainer}>
          <Ionicons name="document-text-outline" size={20} color={cardColor} />

          <View style={styles.topicContent}>
            <Text style={[styles.topicLabel, { color: colors.textSecondary }]}>
              Observaciones
            </Text>

            <Text style={[styles.notes, { color: colors.textSecondary }]}>
              {session.notes}
            </Text>
          </View>
        </View>
      ) : null}

      <View style={[styles.detailRow, { borderTopColor: colors.border }]}>
        <AppButton
          label="Ver asistencia"
          icon="chevron-forward"
          iconPosition="right"
          onPress={openSessionDetail}
          variant="danger"
          size="small"
        />
      </View>
    </AppCard>
  );
}

export default function CourseSessionsScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const { colors } = useAppTheme();

  const [currentPage, setCurrentPage] = useState(0);

  const courseOfferingId = Array.isArray(params.id) ? params.id[0] : params.id;

  const { sessions, isLoading, error, reload } =
    useCourseSessions(courseOfferingId);

  const totalPages = Math.ceil(sessions.length / SESSIONS_PER_PAGE);
  const safePage = Math.min(currentPage, Math.max(totalPages - 1, 0));

  const startIndex = safePage * SESSIONS_PER_PAGE;
  const paginatedSessions = sessions.slice(
    startIndex,
    startIndex + SESSIONS_PER_PAGE,
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
              Historial de clases
            </Text>

            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Sesiones registradas
            </Text>
          </View>
        </View>

        {isLoading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color={colors.primary} />

            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              Cargando historial...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.centerContent}>
            <Ionicons
              name="alert-circle-outline"
              size={42}
              color={colors.error}
            />

            <Text style={[styles.errorTitle, { color: colors.text }]}>
              No se pudo cargar el historial
            </Text>

            <Text style={[styles.errorText, { color: colors.textSecondary }]}>
              {error}
            </Text>

            <AppButton
              label="Reintentar"
              icon="refresh"
              onPress={reload}
              variant="primary"
              size="medium"
            />
          </View>
        ) : sessions.length === 0 ? (
          <View style={styles.centerContent}>
            <Ionicons
              name="calendar-outline"
              size={48}
              color={colors.textSecondary}
            />

            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No hay clases registradas
            </Text>

            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Todavía no se registraron sesiones para esta materia.
            </Text>
          </View>
        ) : (
          <FlatList
            data={paginatedSessions}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <SessionCard
                session={item}
                cardColor={cardColors[(startIndex + index) % cardColors.length]}
              />
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshing={isLoading}
            onRefresh={reload}
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
    gap: 16,
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

  listContent: {
    padding: 16,
    paddingBottom: 30,
  },

  separator: {
    height: 12,
  },

  card: {
    borderWidth: 1,
    borderLeftWidth: 6,
    borderRadius: 0,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  date: {
    fontSize: 17,
    fontWeight: "800",
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 7,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "800",
  },

  divider: {
    height: 1,
    marginVertical: 14,
  },

  topicContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  topicContent: {
    flex: 1,
    marginLeft: 10,
  },

  topicLabel: {
    fontSize: 12,
    marginBottom: 4,
  },

  topic: {
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 21,
  },

  notesContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 14,
  },

  notes: {
    fontSize: 14,
    lineHeight: 20,
  },

  detailRow: {
    alignItems: "flex-start",
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
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
    gap: 12,
  },

  loadingText: {
    fontSize: 14,
  },

  errorTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },

  errorText: {
    fontSize: 14,
    textAlign: "center",
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },

  emptyText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
