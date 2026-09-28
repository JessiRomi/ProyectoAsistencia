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

import type { ClassSession } from "@/features/attendance/attendance.types";
import { useCourseSessions } from "@/features/attendance/useCourseSessions";

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
}: {
  session: ClassSession;
}) {
  const isClosed = session.status === "CLOSED";

  function openSessionDetail() {
    router.push({
      pathname: "/teacher/session-attendance",
      params: {
        id: session.id,
      },
    });
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      onPress={openSessionDetail}
    >
      <View style={styles.cardHeader}>
        <View style={styles.dateContainer}>
          <Ionicons
            name="calendar-outline"
            size={20}
            color="#0E6FB8"
          />

          <Text style={styles.date}>
            {formatDate(session.date)}
          </Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            isClosed
              ? styles.closedBadge
              : styles.openBadge,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              isClosed
                ? styles.closedText
                : styles.openText,
            ]}
          >
            {getStatusLabel(session.status)}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.topicContainer}>
        <Ionicons
          name="book-outline"
          size={18}
          color="#64748B"
        />

        <View style={styles.topicContent}>
          <Text style={styles.topicLabel}>
            Tema
          </Text>

          <Text style={styles.topic}>
            {session.topic || "Sin tema registrado"}
          </Text>
        </View>
      </View>

      {session.notes ? (
        <View style={styles.notesContainer}>
          <Ionicons
            name="document-text-outline"
            size={18}
            color="#64748B"
          />

          <View style={styles.topicContent}>
            <Text style={styles.topicLabel}>
              Observaciones
            </Text>

            <Text style={styles.notes}>
              {session.notes}
            </Text>
          </View>
        </View>
      ) : null}

      <View style={styles.detailRow}>
        <Text style={styles.detailText}>
          Ver asistencia
        </Text>

        <Ionicons
          name="chevron-forward"
          size={20}
          color="#0E6FB8"
        />
      </View>
    </Pressable>
  );
}

export default function CourseSessionsScreen() {
  const params = useLocalSearchParams<{ id: string }>();

  const courseOfferingId = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const {
    sessions,
    isLoading,
    error,
    reload,
  } = useCourseSessions(courseOfferingId);

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
              Historial de clases
            </Text>

            <Text style={styles.subtitle}>
              Sesiones registradas
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
              Cargando historial...
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
              No se pudo cargar el historial
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
        ) : sessions.length === 0 ? (
          <View style={styles.centerContent}>
            <Ionicons
              name="calendar-outline"
              size={48}
              color="#64748B"
            />

            <Text style={styles.emptyTitle}>
              No hay clases registradas
            </Text>

            <Text style={styles.emptyText}>
              Todavia no se registraron sesiones para esta materia.
            </Text>
          </View>
        ) : (
          <FlatList
            data={sessions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <SessionCard session={item} />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshing={isLoading}
            onRefresh={reload}
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

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },

  cardPressed: {
    opacity: 0.75,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  date: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },

  closedBadge: {
    backgroundColor: "#DCFCE7",
  },

  openBadge: {
    backgroundColor: "#FEF3C7",
  },

  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },

  closedText: {
    color: "#166534",
  },

  openText: {
    color: "#92400E",
  },

  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
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
    color: "#64748B",
    marginBottom: 3,
  },

  topic: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },

  notesContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 14,
  },

  notes: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },

  detailText: {
    marginRight: 4,
    fontSize: 13,
    fontWeight: "700",
    color: "#0E6FB8",
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


