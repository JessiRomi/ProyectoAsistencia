import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Stack, router } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AppButton } from "@/components/ui/AppButton";
import { AppCard } from "@/components/ui/AppCard";
import { RouteGuard } from "@/components/auth/RouteGuard";
import { useQrScanner } from "@/features/attendance/useQrScanner";
import { useAppTheme } from "@/features/theme/theme.provider";

export default function QrScannerScreen() {
  return (
    <RouteGuard allowedRoles={["STUDENT"]}>
      <QrScannerContent />
    </RouteGuard>
  );
}

function QrScannerContent() {
  const { colors } = useAppTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const { value, enabled, status, error, onScanned, reset } = useQrScanner();

  if (!permission) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.secondary} />
        <Text style={[styles.message, { color: colors.textSecondary }]}>
          Comprobando permiso de cámara...
        </Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ headerShown: false }} />

        <Header />

        <View style={styles.permissionContent}>
          <View
            style={[
              styles.iconPanel,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Ionicons
              name="camera-outline"
              size={42}
              color={colors.secondary}
            />
          </View>

          <Text style={[styles.title, { color: colors.text }]}>
            Acceso a la cámara
          </Text>

          <Text style={[styles.message, { color: colors.textSecondary }]}>
            Necesitamos la cámara para leer el código QR que muestra tu
            profesor.
          </Text>

          <View style={styles.permissionButton}>
            <AppButton
              label="PERMITIR CÁMARA"
              icon="camera-outline"
              onPress={requestPermission}
              variant="primary"
              size="large"
              fullWidth
            />
          </View>

          <BackButton onPress={() => router.back()} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <Header />

      {!value ? (
        <ScrollView
          contentContainerStyle={styles.scanContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.intro}>
            <Text style={[styles.title, { color: colors.text }]}>
              Enfocá el código QR
            </Text>

            <Text style={[styles.message, { color: colors.textSecondary }]}>
              Ubicá el código dentro del marco para leerlo automáticamente.
            </Text>
          </View>

          <View style={[styles.cameraShell, { borderColor: colors.border }]}>
            <CameraView
              style={StyleSheet.absoluteFill}
              facing="back"
              barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
              onBarcodeScanned={
                enabled ? ({ data }) => onScanned(data) : undefined
              }
            />

            <View pointerEvents="none" style={styles.cameraOverlay}>
              <View style={styles.scanFrame}>
                <View
                  style={[
                    styles.cornerTopLeft,
                    { borderColor: colors.secondary },
                  ]}
                />
                <View
                  style={[
                    styles.cornerTopRight,
                    { borderColor: colors.secondary },
                  ]}
                />
                <View
                  style={[
                    styles.cornerBottomLeft,
                    { borderColor: colors.secondary },
                  ]}
                />
                <View
                  style={[
                    styles.cornerBottomRight,
                    { borderColor: colors.secondary },
                  ]}
                />
                <View
                  style={[styles.scanLine, { backgroundColor: colors.accent }]}
                />
              </View>
            </View>

            <View
              style={[styles.cameraTag, { backgroundColor: colors.primary }]}
            >
              <View
                style={[styles.liveDot, { backgroundColor: colors.success }]}
              />
              <Text style={[styles.cameraTagText, { color: colors.white }]}>
                LECTURA AUTOMÁTICA
              </Text>
            </View>
          </View>

          <AppCard style={styles.infoCard}>
            <View style={styles.scanHint}>
              <View
                style={[
                  styles.hintIcon,
                  { backgroundColor: colors.background },
                ]}
              >
                <Ionicons
                  name="qr-code-outline"
                  size={27}
                  color={colors.secondary}
                />
              </View>

              <View style={styles.hintContent}>
                <Text style={[styles.hintTitle, { color: colors.text }]}>
                  Cómo escanear
                </Text>

                <Text
                  style={[styles.hintText, { color: colors.textSecondary }]}
                >
                  Escaneá el código QR que muestra el docente para registrar tu
                  asistencia.
                </Text>
              </View>
            </View>
          </AppCard>

          <Footer />
        </ScrollView>
      ) : (
        <ScrollView
          contentContainerStyle={styles.resultContent}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.resultIcon,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            {status === "validating" ? (
              <ActivityIndicator size="large" color={colors.secondary} />
            ) : (
              <Ionicons
                name={
                  status === "success"
                    ? "checkmark-circle-outline"
                    : "alert-circle-outline"
                }
                size={43}
                color={status === "success" ? colors.success : colors.warning}
              />
            )}
          </View>

          <Text style={[styles.title, { color: colors.text }]}>
            {status === "validating"
              ? "Validando asistencia"
              : status === "success"
                ? "Asistencia registrada"
                : "No se pudo registrar"}
          </Text>

          <Text style={[styles.message, { color: colors.textSecondary }]}>
            {status === "validating"
              ? "Estamos verificando el código QR con el servidor."
              : status === "success"
                ? "El servidor confirmó el registro de tu asistencia."
                : "No fue posible completar el registro de asistencia."}
          </Text>

          {status === "validating" && (
            <AppCard style={styles.noticeCard}>
              <View style={styles.notice}>
                <ActivityIndicator size="small" color={colors.secondary} />

                <View style={styles.noticeContent}>
                  <Text style={[styles.noticeTitle, { color: colors.text }]}>
                    Procesando solicitud
                  </Text>

                  <Text
                    style={[styles.noticeText, { color: colors.textSecondary }]}
                  >
                    Esperá mientras verificamos tu registro.
                  </Text>
                </View>
              </View>
            </AppCard>
          )}

          {status === "success" && (
            <AppCard style={styles.noticeCard}>
              <View style={styles.notice}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={26}
                  color={colors.success}
                />

                <View style={styles.noticeContent}>
                  <Text style={[styles.noticeTitle, { color: colors.text }]}>
                    Registro confirmado
                  </Text>

                  <Text
                    style={[styles.noticeText, { color: colors.textSecondary }]}
                  >
                    Tu asistencia fue procesada correctamente por el backend.
                  </Text>
                </View>
              </View>
            </AppCard>
          )}

          {status === "error" && (
            <AppCard style={styles.noticeCard}>
              <View style={styles.notice}>
                <Ionicons
                  name="alert-circle-outline"
                  size={26}
                  color={colors.warning}
                />

                <View style={styles.noticeContent}>
                  <Text style={[styles.noticeTitle, { color: colors.text }]}>
                    Error de validación
                  </Text>

                  <Text
                    style={[styles.noticeText, { color: colors.textSecondary }]}
                  >
                    {error ?? "No se pudo validar el código QR."}
                  </Text>
                </View>
              </View>
            </AppCard>
          )}

          <View style={styles.actions}>
            {status !== "validating" && (
              <AppButton
                label="ESCANEAR NUEVAMENTE"
                icon="scan-outline"
                onPress={reset}
                variant="primary"
                size="large"
                fullWidth
              />
            )}

            <BackButton onPress={() => router.back()} />
          </View>

          <Footer />
        </ScrollView>
      )}
    </View>
  );
}

function Header() {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: colors.primary,
          borderBottomColor: colors.accent,
        },
      ]}
    >
      <Pressable
        onPress={() => router.back()}
        style={styles.backButton}
        accessibilityRole="button"
        accessibilityLabel="Volver"
      >
        <Ionicons name="arrow-back" size={25} color={colors.white} />
      </Pressable>

      <View style={styles.headerText}>
        <Text style={[styles.headerTitle, { color: colors.white }]}>
          Escanear QR
        </Text>

        <Text style={[styles.headerSubtitle, { color: colors.white }]}>
          ITS · Asistencia académica
        </Text>
      </View>

      <View style={[styles.brandMark, { borderLeftColor: colors.accent }]}>
        <Ionicons name="qr-code-outline" size={28} color={colors.white} />
      </View>
    </View>
  );
}

function BackButton({ onPress }: { onPress: () => void }) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Volver"
      style={({ pressed }) => [
        styles.backActionButton,
        pressed && styles.backActionButtonPressed,
      ]}
    >
      <Ionicons name="arrow-back" size={25} color={colors.text} />
    </Pressable>
  );
}

function Footer() {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.footer, { borderTopColor: colors.border }]}>
      <Text style={[styles.footerText, { color: colors.textSecondary }]}>
        ITS · ASISTENCIA ACADÉMICA
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
  },

  header: {
    minHeight: 94,
    paddingHorizontal: 17,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 3,
  },

  backButton: {
    width: 38,
    height: 46,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  headerText: {
    flex: 1,
    gap: 4,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
  },

  headerSubtitle: {
    fontSize: 12,
    fontWeight: "500",
    opacity: 0.8,
  },

  brandMark: {
    width: 39,
    height: 39,
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: 2,
    marginLeft: 8,
  },

  scanContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 22,
  },

  intro: {
    marginBottom: 22,
    paddingHorizontal: 2,
  },

  title: {
    fontSize: 25,
    lineHeight: 32,
    fontWeight: "800",
    textAlign: "center",
  },

  message: {
    marginTop: 9,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },

  cameraShell: {
    height: 410,
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#07152E",
    borderWidth: 1,
  },

  cameraOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(7,21,46,0.10)",
  },

  scanFrame: {
    width: "88%",
    height: 300,
    alignItems: "center",
    justifyContent: "center",
  },

  cornerTopLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 43,
    height: 43,
    borderTopWidth: 5,
    borderLeftWidth: 5,
  },

  cornerTopRight: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 43,
    height: 43,
    borderTopWidth: 5,
    borderRightWidth: 5,
  },

  cornerBottomLeft: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 43,
    height: 43,
    borderBottomWidth: 5,
    borderLeftWidth: 5,
  },

  cornerBottomRight: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 43,
    height: 43,
    borderBottomWidth: 5,
    borderRightWidth: 5,
  },

  scanLine: {
    width: "100%",
    height: 2,
  },

  cameraTag: {
    position: "absolute",
    top: 13,
    left: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 11,
    paddingVertical: 9,
    borderLeftWidth: 3,
    borderLeftColor: "#FF8A00",
  },

  liveDot: {
    width: 7,
    height: 7,
  },

  cameraTagText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },

  infoCard: {
    marginTop: 22,
  },

  scanHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  hintIcon: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
  },

  hintContent: {
    flex: 1,
    gap: 4,
  },

  hintTitle: {
    fontSize: 15,
    fontWeight: "800",
  },

  hintText: {
    fontSize: 13,
    lineHeight: 19,
  },

  resultContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 35,
    paddingBottom: 22,
    alignItems: "stretch",
  },

  resultIcon: {
    alignSelf: "center",
    width: 70,
    height: 70,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 3,
    borderBottomColor: "#FF8A00",
  },

  valueCard: {
    minHeight: 94,
    marginTop: 27,
    justifyContent: "center",
    alignItems: "center",
  },

  valueText: {
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },

  noticeCard: {
    marginTop: 22,
  },

  notice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },

  noticeContent: {
    flex: 1,
    gap: 5,
  },

  noticeTitle: {
    fontSize: 15,
    fontWeight: "800",
  },

  noticeText: {
    fontSize: 13,
    lineHeight: 20,
  },

  actions: {
    gap: 14,
    marginTop: 28,
  },

  permissionContent: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  permissionButton: {
    marginTop: 24,
    marginBottom: 14,
  },

  iconPanel: {
    alignSelf: "center",
    width: 76,
    height: 76,
    marginBottom: 22,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 3,
  },

  footer: {
    marginTop: 25,
    paddingTop: 14,
    borderTopWidth: 1,
    alignItems: "center",
  },

  footerText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  backActionButton: {
    width: 48,
    height: 48,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },

  backActionButtonPressed: {
    opacity: 0.6,
  },
});
