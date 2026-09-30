import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { apiClient } from "../lib/api/api.client"

type AttendanceRecord = {
  id?: string;
  date?: string;
  status?: "PRESENT" | "ABSENT";
};

type AttendanceTotals = {
  PRESENT?: number;
  ABSENT?: number;
};

type AttendanceResponse = {
  success: boolean;
  data: {
    records: AttendanceRecord[];
    totals: AttendanceTotals;
  };
  timestamp: string;
};

const SUBJECTS = [
  "Desarrollo Web",
  "Desarrollo Móvil",
  "Gestión de Proyecto",
];

export default function AttendanceHistoryScreen() {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [totals, setTotals] = useState<AttendanceTotals>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAttendance();
  }, []);

  async function loadAttendance() {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient<AttendanceResponse>(
        "/students/me/attendance",
        {
          method: "GET",
        },
      );

      console.log(
        "Respuesta de asistencia:",
        JSON.stringify(response, null, 2),
      );

      const attendanceData = response.data;

      setRecords(
        Array.isArray(attendanceData?.records)
          ? attendanceData.records
          : [],
      );

      setTotals(attendanceData?.totals || {});
    } catch (error) {
      console.error("Error consultando asistencia:", error);

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo consultar la asistencia.",
      );
    } finally {
      setLoading(false);
    }
  }

  function getStatusText(status?: string) {
    switch (status?.toUpperCase()) {
      case "PRESENT":
        return "Presente";

      case "ABSENT":
        return "Ausente";

      default:
        return "Registrada";
    }
  }

  function getStatusColor(status?: string) {
    switch (status?.toUpperCase()) {
      case "PRESENT":
        return "#4070B2";

      case "ABSENT":
        return "#DC2626";

      default:
        return "#6B7280";
    }
  }

  function getSubjectName(index: number) {
    return SUBJECTS[index] || "Asignatura";
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={styles.container}>
        {/* LOGO DE FONDO */}
        <Image
          source={require("../assets/images/ITS_LOGO.jpg")}
          style={styles.backgroundLogo}
          resizeMode="contain"
        />

        {/* ENCABEZADO */}
        <View style={styles.header}>
          <Ionicons
            name="arrow-back"
            size={28}
            color="#1F2937"
            onPress={() => router.back()}
          />

          <Text style={styles.headerTitle}>Mi asistencia</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* TÍTULO */}
          <View style={styles.introduction}>
            <Text style={styles.title}>Historial de asistencia</Text>

            <Text style={styles.subtitle}>
              Consultá tus registros de asistencia a clases.
            </Text>
          </View>

          {/* CARGANDO */}
          {loading && (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#4070B2" />

              <Text style={styles.loadingText}>
                Consultando asistencia...
              </Text>
            </View>
          )}

          {/* ERROR */}
          {!loading && error && (
            <View style={styles.messageCard}>
              <Ionicons
                name="alert-circle-outline"
                size={38}
                color="#DC2626"
              />

              <Text style={styles.messageTitle}>
                Ocurrió un problema
              </Text>

              <Text style={styles.messageText}>{error}</Text>
            </View>
          )}

          {/* RESUMEN */}
          {!loading && !error && (
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Resumen</Text>

              <View style={styles.summaryRow}>
                {/* PRESENTES */}
                <View style={styles.summaryItem}>
                  <View
                    style={[
                      styles.summaryIcon,
                      { backgroundColor: "#EAF1FA" },
                    ]}
                  >
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={24}
                      color="#4070B2"
                    />
                  </View>

                  <Text
                    style={[
                      styles.summaryNumber,
                      { color: "#4070B2" },
                    ]}
                  >
                    {totals.PRESENT ?? 0}
                  </Text>

                  <Text style={styles.summaryLabel}>
                    Presentes
                  </Text>
                </View>

                <View style={styles.summaryDivider} />

                {/* AUSENTES */}
                <View style={styles.summaryItem}>
                  <View
                    style={[
                      styles.summaryIcon,
                      { backgroundColor: "#FEECEC" },
                    ]}
                  >
                    <Ionicons
                      name="close-circle-outline"
                      size={24}
                      color="#DC2626"
                    />
                  </View>

                  <Text
                    style={[
                      styles.summaryNumber,
                      { color: "#DC2626" },
                    ]}
                  >
                    {totals.ABSENT ?? 0}
                  </Text>

                  <Text style={styles.summaryLabel}>
                    Ausentes
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* SIN REGISTROS */}
          {!loading && !error && records.length === 0 && (
            <View style={styles.messageCard}>
              <View style={styles.emptyIcon}>
                <Ionicons
                  name="calendar-outline"
                  size={32}
                  color="#4070B2"
                />
              </View>

              <Text style={styles.messageTitle}>
                Sin registros
              </Text>

              <Text style={styles.messageText}>
                Todavía no hay registros de asistencia para
                mostrar.
              </Text>
            </View>
          )}

          {/* REGISTROS */}
          {!loading && !error && records.length > 0 && (
            <View style={styles.recordsContainer}>
              <Text style={styles.recordsTitle}>
                Registros
              </Text>

              {records.map((record, index) => (
                <View
                  key={record.id ?? index}
                  style={styles.recordCard}
                >
                  <View style={styles.recordIcon}>
                    <Ionicons
                      name="calendar-outline"
                      size={23}
                      color="#FFFFFF"
                    />
                  </View>

                  <View style={styles.recordContent}>
                    <Text style={styles.recordSubject}>
                      {getSubjectName(index)}
                    </Text>

                    {record.date && (
                      <Text style={styles.recordDate}>
                        {record.date}
                      </Text>
                    )}
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          record.status === "PRESENT"
                            ? "#EAF1FA"
                            : "#FEECEC",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.recordStatus,
                        {
                          color: getStatusColor(
                            record.status,
                          ),
                        },
                      ]}
                    >
                      {getStatusText(record.status)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },

  backgroundLogo: {
    position: "absolute",
    width: 330,
    height: 330,
    alignSelf: "center",
    top: "32%",
    opacity: 0.045,
  },

  header: {
    height: 95,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  headerTitle: {
    fontSize: 25,
    fontWeight: "800",
    color: "#1F2937",
  },

  scrollContent: {
    paddingHorizontal: 22,
    paddingBottom: 40,
  },

  introduction: {
    paddingTop: 32,
    paddingBottom: 22,
  },

  title: {
    fontSize: 25,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 7,
  },

  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },

  centerContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
  },

  loadingText: {
    marginTop: 14,
    fontSize: 15,
    color: "#6B7280",
  },

  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginBottom: 26,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  summaryTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 18,
  },

  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  summaryItem: {
    alignItems: "center",
    flex: 1,
  },

  summaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
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
    color: "#6B7280",
    marginTop: 3,
  },

  summaryDivider: {
    width: 1,
    height: 65,
    backgroundColor: "#E5E7EB",
  },

  messageCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 28,
    alignItems: "center",
  },

  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: "#EAF1FA",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  messageTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1F2937",
    marginTop: 10,
    marginBottom: 6,
  },

  messageText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },

  recordsContainer: {
    gap: 12,
  },

  recordsTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 2,
  },

  recordCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.035,
    shadowRadius: 6,
    elevation: 1,
  },

  recordIcon: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: "#4070B2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  recordContent: {
    flex: 1,
  },

  recordSubject: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
  },

  recordDate: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },

  statusBadge: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginLeft: 8,
  },

  recordStatus: {
    fontSize: 11,
    fontWeight: "800",
  },
});
