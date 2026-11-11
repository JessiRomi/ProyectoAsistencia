import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { RouteGuard } from "@/components/auth/RouteGuard";
import { AppCard } from "@/components/ui/AppCard";
import { FeedbackState } from "@/components/ui/FeedbackState";
import { useAppTheme } from "@/features/theme/theme.provider";
import { useStudentAttendance } from "@/features/attendance/useStudentAttendance";

// Define la ruta protegida para consultar el detalle de asistencia del estudiante
export default function StudentSubjectAttendanceScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <RouteGuard allowedRoles={["STUDENT"]}>
        <StudentSubjectAttendanceContent />
      </RouteGuard>
    </>
  );
}

// Gestiona la consulta y visualización de las asistencias de una materia
function StudentSubjectAttendanceContent() {
  // Recupera los datos de la cursada enviados desde la pantalla anterior
  const params = useLocalSearchParams<{
    courseOfferingId?: string;
    subjectName?: string;
    commission?: string;
  }>();

  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();

  // Normaliza los parámetros recibidos para obtener un único valor
  const courseOfferingId = Array.isArray(params.courseOfferingId)
    ? params.courseOfferingId[0]
    : params.courseOfferingId;

  const subjectName = Array.isArray(params.subjectName)
    ? params.subjectName[0]
    : params.subjectName;

  const commission = Array.isArray(params.commission)
    ? params.commission[0]
    : params.commission;

  // Obtiene los registros, totales y estados de carga de la cursada seleccionada
  const { records, totals, isLoading, error, reload } =
    useStudentAttendance(courseOfferingId);

  // Convierte los estados de asistencia del backend en etiquetas para la interfaz
  function getStatusText(status: string) {
    switch (status) {
      case "PRESENT":
        return "Presente";
      case "ABSENT":
        return "Ausente";
      case "LATE":
        return "Tarde";
      case "JUSTIFIED":
        return "Justificada";
      default:
        return "Sin clasificar";
    }
  }

  // Asigna un color según el estado de asistencia.
  function getStatusColor(status: string) {
    switch (status) {
      case "PRESENT":
        return colors.success;
      case "ABSENT":
        return colors.error;
      case "LATE":
        return colors.warning;
      case "JUSTIFIED":
        return colors.secondary;
      default:
        return colors.textSecondary;
    }
  }

  // Valida y formatea las fechas para mostrarlas en formato local
  function formatDate(date: string) {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Fecha no disponible";
    }

    return parsedDate.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  }

  const sortedRecords = [...records].sort(
    (a, b) =>
      new Date(b.classSession.date).getTime() -
      new Date(a.classSession.date).getTime(),
  );

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
          Detalle de asistencia
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.introduction}>
          <Text style={[styles.title, { color: colors.text }]}>
            {subjectName ?? "Mi materia"}
          </Text>

          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {commission ? `Comisión ${commission}` : "Historial de asistencia"}
          </Text>
        </View>

        {/* Informa cuando no se recibió el identificador de la cursada. */}
        {!courseOfferingId && (
          <AppCard style={styles.messageCard}>
            <Ionicons
              name="alert-circle-outline"
              size={36}
              color={colors.error}
            />

            <Text style={[styles.messageTitle, { color: colors.text }]}>
              No se identificó la cursada
            </Text>

            <Text style={[styles.messageText, { color: colors.textSecondary }]}>
              Volvé al listado de materias e ingresá nuevamente.
            </Text>
          </AppCard>
        )}

        {Boolean(courseOfferingId) && isLoading && (
          <FeedbackState
            type="loading"
            message="Consultando tus asistencias..."
          />
        )}

        {Boolean(courseOfferingId) && !isLoading && error !== "" && (
          <FeedbackState
            type="error"
            message={error}
            onRetry={() => void reload()}
          />
        )}

        {/* Muestra los totales de asistencia según cada estado. */}
        {Boolean(courseOfferingId) && !isLoading && error === "" && (
          <>
            <AppCard style={styles.summaryCard}>
              <View style={styles.summaryItem}>
                <View
                  style={[
                    styles.summaryIcon,
                    { backgroundColor: colors.background },
                  ]}
                >
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={23}
                    color={colors.success}
                  />
                </View>

                <Text style={[styles.summaryNumber, { color: colors.success }]}>
                  {totals.PRESENT ?? 0}
                </Text>

                <Text
                  style={[styles.summaryLabel, { color: colors.textSecondary }]}
                >
                  Presentes
                </Text>
              </View>

              <View style={styles.summaryItem}>
                <View
                  style={[
                    styles.summaryIcon,
                    { backgroundColor: colors.background },
                  ]}
                >
                  <Ionicons
                    name="close-circle-outline"
                    size={23}
                    color={colors.error}
                  />
                </View>

                <Text style={[styles.summaryNumber, { color: colors.error }]}>
                  {totals.ABSENT ?? 0}
                </Text>

                <Text
                  style={[styles.summaryLabel, { color: colors.textSecondary }]}
                >
                  Ausentes
                </Text>
              </View>

              <View style={styles.summaryItem}>
                <View
                  style={[
                    styles.summaryIcon,
                    { backgroundColor: colors.background },
                  ]}
                >
                  <Ionicons
                    name="time-outline"
                    size={23}
                    color={colors.warning}
                  />
                </View>

                <Text style={[styles.summaryNumber, { color: colors.warning }]}>
                  {totals.LATE ?? 0}
                </Text>

                <Text
                  style={[styles.summaryLabel, { color: colors.textSecondary }]}
                >
                  Tardanzas
                </Text>
              </View>

              <View style={styles.summaryItem}>
                <View
                  style={[
                    styles.summaryIcon,
                    { backgroundColor: colors.background },
                  ]}
                >
                  <Ionicons
                    name="document-text-outline"
                    size={23}
                    color={colors.secondary}
                  />
                </View>

                <Text
                  style={[styles.summaryNumber, { color: colors.secondary }]}
                >
                  {totals.JUSTIFIED ?? 0}
                </Text>

                <Text
                  style={[styles.summaryLabel, { color: colors.textSecondary }]}
                >
                  Justificadas
                </Text>
              </View>
            </AppCard>

            <Text style={[styles.recordsTitle, { color: colors.text }]}>
              Clases registradas
            </Text>

            {/* Muestra las clases registradas con su fecha, tema y estado de asistencia. */}
            {sortedRecords.length === 0 ? (
              <AppCard style={styles.messageCard}>
                <Ionicons
                  name="calendar-outline"
                  size={36}
                  color={colors.secondary}
                />

                <Text style={[styles.messageTitle, { color: colors.text }]}>
                  Sin registros de asistencia
                </Text>

                <Text
                  style={[styles.messageText, { color: colors.textSecondary }]}
                >
                  Todavía no hay asistencias registradas para esta cursada.
                </Text>
              </AppCard>
            ) : (
              <View style={styles.recordsList}>
                {sortedRecords.map((record) => {
                  const statusColor = getStatusColor(record.status);

                  return (
                    <AppCard key={record.id} style={styles.recordCard}>
                      <View style={styles.recordIcon}>
                        <Ionicons
                          name="calendar-outline"
                          size={22}
                          color={colors.secondary}
                        />
                      </View>

                      <View style={styles.recordContent}>
                        <Text
                          style={[styles.recordDate, { color: colors.text }]}
                        >
                          {formatDate(record.classSession.date)}
                        </Text>

                        <Text
                          style={[
                            styles.recordTopic,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {record.classSession.topic?.trim() ||
                            "Clase sin tema especificado"}
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: `${statusColor}18` },
                        ]}
                      >
                        <Text
                          style={[styles.statusText, { color: statusColor }]}
                        >
                          {getStatusText(record.status)}
                        </Text>
                      </View>
                    </AppCard>
                  );
                })}
              </View>
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
    gap: 15,
    borderBottomWidth: 1,
  },

  headerTitle: {
    flex: 1,
    fontSize: 21,
    fontWeight: "800",
  },

  scrollContent: {
    paddingHorizontal: 22,
    paddingBottom: 40,
  },

  introduction: {
    paddingTop: 30,
    paddingBottom: 22,
  },

  title: {
    fontSize: 25,
    fontWeight: "800",
  },

  subtitle: {
    marginTop: 7,
    fontSize: 14,
  },

  summaryCard: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 26,
  },

  summaryItem: {
    width: "50%",
    alignItems: "center",
    paddingVertical: 12,
  },

  summaryIcon: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  summaryNumber: {
    fontSize: 25,
    fontWeight: "800",
  },

  summaryLabel: {
    fontSize: 12,
    marginTop: 3,
  },

  recordsTitle: {
    fontSize: 19,
    fontWeight: "800",
    marginBottom: 14,
  },

  recordsList: {
    gap: 12,
  },

  recordCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  recordIcon: {
    width: 43,
    height: 43,
    alignItems: "center",
    justifyContent: "center",
  },

  recordContent: {
    flex: 1,
  },

  recordDate: {
    fontSize: 14,
    fontWeight: "800",
  },

  recordTopic: {
    fontSize: 12,
    marginTop: 5,
  },

  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 7,
    marginLeft: 4,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "800",
  },

  messageCard: {
    alignItems: "center",
    gap: 10,
    padding: 25,
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
