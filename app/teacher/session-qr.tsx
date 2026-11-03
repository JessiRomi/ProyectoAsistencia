import { Ionicons } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import QRCode from "react-native-qrcode-svg";
import { useEffect, useState } from "react";

import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import GeometricActionButton from "@/components/attendance/GeometricActionButton";
import { AppButton } from "@/components/ui/AppButton";
import { AppCard } from "@/components/ui/AppCard";
import { getCurrentLocation } from "@/features/location/location.service";
import {
  getCheckInQr,
  openCheckInWindow,
} from "@/features/attendance/check-in.service";
import { useAppTheme } from "@/features/theme/theme.provider";

const ROTATION_SECONDS = 30;
const LOCATION_RADIUS_METERS = 60;

type CheckInMode = "QR" | "QR_GEO";

export default function SessionQrScreen() {
  const { colors } = useAppTheme();
  const { width: windowWidth } = useWindowDimensions();

  const [checkInMode, setCheckInMode] = useState<CheckInMode | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const [rotationSeconds, setRotationSeconds] = useState(ROTATION_SECONDS);

  const qrSize = Math.min(270, Math.max(190, windowWidth - 150));

  const params = useLocalSearchParams<{
    id?: string | string[];
    courseOfferingId?: string | string[];
  }>();

  const sessionId = Array.isArray(params.id) ? params.id[0] : params.id;

  const courseOfferingId = Array.isArray(params.courseOfferingId)
    ? params.courseOfferingId[0]
    : params.courseOfferingId;

  const [now, setNow] = useState(0);
  const [qrValue, setQrValue] = useState("");
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleModeChange(mode: CheckInMode) {
    if (isLoading || mode === checkInMode) {
      return;
    }

    setCheckInMode(mode);
    setIsLoading(true);
    setError(null);
    setQrValue("");
    setExpiresAt(null);
    setNow(0);
  }

  function handleChangeMode() {
    if (!checkInMode || isLoading) {
      return;
    }

    Alert.alert(
      "Cambiar modalidad",
      "Al cambiar la modalidad se cerrará la ventana de asistencia actual y se abrirá una nueva.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "QR tradicional",
          onPress: () => handleModeChange("QR"),
        },
        {
          text: "QR + ubicación",
          onPress: () => handleModeChange("QR_GEO"),
        },
      ],
    );
  }

  function handleRetry() {
    if (!checkInMode || isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setQrValue("");
    setExpiresAt(null);
    setNow(0);
    setRetryKey((previous) => previous + 1);
  }

  useEffect(() => {
    const currentSessionId = typeof sessionId === "string" ? sessionId : "";

    if (!currentSessionId || !checkInMode) {
      return;
    }

    let active = true;
    let refreshing = false;
    let expirationTimestamp = 0;

    async function refreshQr() {
      if (refreshing || !active) {
        return;
      }

      refreshing = true;

      try {
        const response = await getCheckInQr(currentSessionId);

        if (!active) {
          return;
        }

        expirationTimestamp = new Date(response.expiresAt).getTime();

        if (!Number.isFinite(expirationTimestamp)) {
          throw new Error("La API devolvió una fecha de vencimiento inválida.");
        }

        if (
          Number.isFinite(response.rotationSeconds) &&
          response.rotationSeconds > 0
        ) {
          setRotationSeconds(response.rotationSeconds);
        }

        setQrValue(response.token);
        setExpiresAt(response.expiresAt);
        setError(null);
      } catch (err) {
        expirationTimestamp = 0;

        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudo obtener el código QR.",
          );
        }
      } finally {
        refreshing = false;

        if (active) {
          setIsLoading(false);
        }
      }
    }

    async function initializeQr() {
      try {
        if (checkInMode === "QR_GEO") {
          const location = await getCurrentLocation();

          if (!active) {
            return;
          }

          await openCheckInWindow(currentSessionId, {
            mode: "QR_GEO",
            latitude: location.latitude,
            longitude: location.longitude,
            radiusMeters: LOCATION_RADIUS_METERS,
          });
        } else {
          await openCheckInWindow(currentSessionId);
        }

        if (active) {
          await refreshQr();
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudo abrir la ventana de autoregistro.",
          );
          setIsLoading(false);
        }
      }
    }

    void initializeQr();

    const timer = setInterval(() => {
      const timestamp = Date.now();

      setNow(timestamp);

      if (expirationTimestamp > 0 && timestamp >= expirationTimestamp) {
        expirationTimestamp = 0;
        void refreshQr();
      }
    }, 1000);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [sessionId, checkInMode, retryKey]);

  const remaining = expiresAt
    ? Math.max(0, Math.ceil((new Date(expiresAt).getTime() - now) / 1000))
    : 0;

  const qrProgress = Math.min(100, (remaining / rotationSeconds) * 100);

  function handleManualAttendance() {
    if (!sessionId || !courseOfferingId) {
      Alert.alert(
        "No se puede abrir la asistencia",
        "Faltan datos de la sesión o de la cursada.",
      );
      return;
    }

    router.push({
      pathname: "/teacher/attendance",
      params: {
        id: courseOfferingId,
        sessionId,
      },
    });
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.content}
      >
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          <AppButton
            label="Volver"
            icon="arrow-back"
            onPress={() => router.back()}
            variant="secondary"
            size="small"
          />

          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Código QR</Text>

            <Text style={styles.headerSubtitle}>
              ITS · Asistencia académica
            </Text>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.intro}>
            <Ionicons name="qr-code-outline" size={36} color={colors.primary} />

            <Text style={[styles.title, { color: colors.text }]}>
              Tomar asistencia
            </Text>

            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Seleccioná cómo deseas registrar la asistencia de esta clase.
            </Text>
          </View>

          <View style={styles.modeSelector}>
            {!checkInMode ? (
              <>
                <AppCard padding={15} style={styles.modeCard}>
                  <Ionicons
                    name="qr-code-outline"
                    size={32}
                    color={colors.primary}
                  />

                  <Text style={[styles.modeTitle, { color: colors.text }]}>
                    QR tradicional
                  </Text>

                  <Text
                    style={[
                      styles.modeDescription,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Los estudiantes escanean el código para registrar su
                    asistencia.
                  </Text>

                  <AppButton
                    label="SELECCIONAR QR"
                    icon="qr-code-outline"
                    onPress={() => handleModeChange("QR")}
                    variant="primary"
                    size="large"
                    fullWidth
                  />
                </AppCard>

                <AppCard padding={15} style={styles.modeCard}>
                  <Ionicons
                    name="location-outline"
                    size={32}
                    color={colors.primary}
                  />

                  <Text style={[styles.modeTitle, { color: colors.text }]}>
                    QR + ubicación
                  </Text>

                  <Text
                    style={[
                      styles.modeDescription,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Además del QR, se verifica la ubicación del estudiante.
                    Radio configurado: 60 metros.
                  </Text>

                  <AppButton
                    label="SELECCIONAR QR + GEO"
                    icon="location-outline"
                    onPress={() => handleModeChange("QR_GEO")}
                    variant="secondary"
                    size="large"
                    fullWidth
                  />
                </AppCard>
              </>
            ) : (
              <View style={styles.changeModeButton}>
                <AppButton
                  label="CAMBIAR MODALIDAD"
                  icon="swap-horizontal-outline"
                  onPress={handleChangeMode}
                  variant="secondary"
                  size="small"
                  disabled={isLoading}
                />
              </View>
            )}
          </View>

          <AppCard
            padding={15}
            style={[
              styles.qrCard,
              {
                width: qrSize + 30,
                height: qrSize + 30,
                backgroundColor: "#FFFFFF",
              },
            ]}
          >
            {!sessionId ? (
              <Text style={[styles.subtitle, { color: colors.warning }]}>
                No se pudo identificar la sesión de clase.
              </Text>
            ) : !checkInMode ? (
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Seleccioná una modalidad para generar el código QR.
              </Text>
            ) : isLoading ? (
              <View style={styles.loadingContent}>
                <Ionicons
                  name={
                    checkInMode === "QR_GEO"
                      ? "location-outline"
                      : "qr-code-outline"
                  }
                  size={35}
                  color={colors.primary}
                />

                <Text
                  style={[styles.subtitle, { color: colors.textSecondary }]}
                >
                  {checkInMode === "QR_GEO"
                    ? "Obteniendo ubicación y abriendo asistencia..."
                    : "Abriendo ventana de asistencia..."}
                </Text>
              </View>
            ) : error ? (
              <Text style={[styles.subtitle, { color: colors.warning }]}>
                {error}
              </Text>
            ) : qrValue ? (
              <QRCode
                value={qrValue}
                size={qrSize}
                color="#000000"
                backgroundColor="#FFFFFF"
              />
            ) : (
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Esperando código QR...
              </Text>
            )}
          </AppCard>

          {error && checkInMode && !isLoading && (
            <View style={styles.actionButton}>
              <AppButton
                label="REINTENTAR"
                icon="refresh-outline"
                onPress={handleRetry}
                variant="primary"
                size="large"
                fullWidth
              />
            </View>
          )}

          {checkInMode && qrValue && !error && (
            <AppCard padding={14} style={styles.timerPanel}>
              <View style={styles.timerHeader}>
                <Ionicons
                  name="time-outline"
                  size={20}
                  color={colors.primary}
                />

                <Text style={[styles.timerTitle, { color: colors.text }]}>
                  Renovación automática
                </Text>

                <Text style={[styles.timerValue, { color: colors.primary }]}>
                  {`${String(Math.floor(remaining / 60)).padStart(2, "0")}:${String(
                    remaining % 60,
                  ).padStart(2, "0")}`}
                </Text>
              </View>

              <View
                style={[styles.timerTrack, { backgroundColor: colors.border }]}
              >
                <View
                  style={[
                    styles.timerProgress,
                    {
                      backgroundColor: colors.primary,
                      width: `${qrProgress}%`,
                    },
                  ]}
                />
              </View>

              <Text style={[styles.timerHint, { color: colors.textSecondary }]}>
                El código se actualiza automáticamente según su vencimiento.
              </Text>
            </AppCard>
          )}

          <View style={styles.actionButton}>
            <GeometricActionButton
              label="TOMAR ASISTENCIA MANUAL"
              icon="clipboard-outline"
              onPress={handleManualAttendance}
            />
          </View>

          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              ITS · ASISTENCIA ACADÉMICA
            </Text>
          </View>

          <Text style={[styles.sessionId, { color: colors.textSecondary }]}>
            Sesión: {sessionId || "ID no disponible"}
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    paddingBottom: 14,
  },

  header: {
    minHeight: 112,
    paddingTop: 35,
    paddingHorizontal: 22,
    paddingBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  headerText: {
    flex: 1,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "800",
  },

  headerSubtitle: {
    color: "#FFFFFF",
    fontSize: 13,
    marginTop: 5,
  },

  body: {
    paddingHorizontal: 22,
    paddingTop: 24,
    alignItems: "center",
  },

  intro: {
    alignItems: "center",
    width: "100%",
    marginBottom: 18,
  },

  modeSelector: {
    width: "100%",
    gap: 12,
    marginBottom: 18,
  },

  modeCard: {
    width: "100%",
    gap: 10,
    alignItems: "flex-start",
  },

  modeTitle: {
    fontSize: 17,
    fontWeight: "800",
  },

  modeDescription: {
    fontSize: 13,
    lineHeight: 19,
  },

  changeModeButton: {
    width: "100%",
    alignItems: "center",
  },

  title: {
    fontSize: 25,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 12,
  },

  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
    textAlign: "center",
    marginTop: 7,
    paddingHorizontal: 8,
  },

  qrCard: {
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#D7E1EF",
    marginBottom: 16,
  },

  loadingContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },

  timerPanel: {
    width: "100%",
    maxWidth: 390,
    marginBottom: 12,
  },

  timerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  timerTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
  },

  timerValue: {
    fontSize: 23,
    fontWeight: "900",
    fontVariant: ["tabular-nums"],
  },

  timerTrack: {
    height: 6,
    marginTop: 10,
    overflow: "hidden",
  },

  timerProgress: {
    height: 6,
  },

  timerHint: {
    fontSize: 11,
    marginTop: 8,
  },

  actionButton: {
    width: "100%",
  },

  footer: {
    width: "100%",
    borderTopWidth: 1,
    alignItems: "center",
    paddingTop: 14,
    marginTop: 24,
  },

  footerText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },

  sessionId: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 12,
  },
});
