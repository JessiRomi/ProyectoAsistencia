import { Ionicons } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import QRCode from "react-native-qrcode-svg";
import GeometricActionButton from "@/components/attendance/GeometricActionButton";
import { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

const VALIDITY_SECONDS = 20;

/** DEMO. renueva el codigo qr local. No se valida la asistencia */
export default function SessionQrScreen() {
  const { width: windowWidth } = useWindowDimensions();
  const qrSize = Math.min(270, Math.max(190, windowWidth - 150));
  const params = useLocalSearchParams<{ id: string }>();

  const sessionId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [now, setNow] = useState(0);
  const [issuedAt, setIssuedAt] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const timestamp = Date.now();
      setNow(timestamp);
      setIssuedAt((current) => {
        if (current === 0 || timestamp - current >= VALIDITY_SECONDS * 1000) {
          return timestamp;
        }
        return current;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const remaining =
    issuedAt === 0
      ? VALIDITY_SECONDS
      : Math.max(0, VALIDITY_SECONDS - Math.floor((now - issuedAt) / 1000));

  const qrValue = useMemo(() => {
    if (!sessionId || issuedAt === 0) {
      return "";
    }

    return `ITS-DEMO-QR|SESSION=${sessionId}|ISSUED_AT=${issuedAt}|NONCE=${issuedAt}`;
  }, [sessionId, issuedAt]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Volver"
            style={styles.back}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={31} color="#FFFFFF" />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Código QR</Text>
            <Text style={styles.headerSubtitle}>
              ITS · Asistencia académica
            </Text>
          </View>
          <View style={styles.logo}>
            <Text style={styles.logoITS}>ITS</Text>
            <View style={styles.logoOrange} />
            <View style={styles.logoBlue} />
          </View>
          <View style={styles.headerUnderline} />
        </View>

        <View style={styles.body}>
          <View style={styles.decorTopLeft} />
          <View style={styles.decorTopRight} />

          <View style={styles.intro}>
            <View style={styles.qrIconBadge}>
              <Ionicons name="qr-code-outline" size={32} color="#356CE0" />
              <View style={styles.iconOrangeAccent} />
            </View>
            <Text style={styles.title}>QR de prueba</Text>
            <Text style={styles.subtitle}>
              Escaneá este código desde la opción Escanear
            </Text>
          </View>

          <View
            style={[styles.qrCard, { width: qrSize + 30, height: qrSize + 30 }]}
          >
            <View style={styles.qrAccentTop} />
            <View style={styles.qrAccentRight} />
            <View style={styles.qrAccentLeft} />
            <View style={styles.qrAccentBottom} />
            {qrValue ? (
              <QRCode
                value={qrValue}
                size={qrSize}
                color="#000000"
                backgroundColor="#FFFFFF"
              />
            ) : (
              <Text style={styles.subtitle}>
                Esperando una sesión válida...
              </Text>
            )}
          </View>

          <View style={styles.timerPanel}>
            <View style={styles.timerHeader}>
              <Ionicons name="time-outline" size={19} color="#356CE0" />
              <Text style={styles.timerTitle}>Renovación automática</Text>
              <Text style={styles.timerValue}>
                00:{String(remaining).padStart(2, "0")}
              </Text>
            </View>
            <View style={styles.timerTrack}>
              <View
                style={[
                  styles.timerProgress,
                  { width: `${(remaining / VALIDITY_SECONDS) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.timerHint}>
              El QR de demostración cambia cada 20 segundos.
            </Text>
          </View>

          <View style={styles.demoLabelRow}>
            <View style={styles.demoLine} />
            <Text style={styles.demoLabel}>MODO DEMOSTRACIÓN</Text>
            <View style={styles.demoLine} />
          </View>

          <View style={styles.notice}>
            <Ionicons
              name="information-circle-outline"
              size={28}
              color="#E68A00"
            />
            <View style={styles.noticeContent}>
              <Text style={styles.noticeTitle}>Código de prueba</Text>
              <Text style={styles.noticeText}>
                Este QR sirve para probar la cámara. No registra asistencia ni
                representa una clase real.
              </Text>
            </View>
          </View>

          <GeometricActionButton
            label="ABRIR ESCÁNER"
            icon="camera-outline"
            onPress={() =>
              router.push({
                pathname: "/qr-scanner",
                params: { sessionId: sessionId || "" },
              })
            }
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>ITS · ASISTENCIA ACADÉMICA</Text>
          </View>
          <Text style={styles.sessionId}>
            Sesión: {sessionId || "ID no disponible"}
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F6FC" },
  content: { flexGrow: 1, paddingBottom: 14 },

  header: {
    minHeight: 112,
    backgroundColor: "#071F43",
    paddingTop: 35,
    paddingHorizontal: 22,
    paddingBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },

  back: {
    width: 43,
    alignItems: "flex-start",
    justifyContent: "center",
    marginRight: 13,
  },

  headerText: { flex: 1 },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "800",
    letterSpacing: -0.5,
  },

  headerSubtitle: { color: "#C5D2E7", fontSize: 14, marginTop: 7 },

  logo: { flexDirection: "row", alignItems: "center", marginLeft: 8 },

  logoITS: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "900",
    letterSpacing: -1.8,
  },

  logoOrange: {
    height: 31,
    width: 5,
    backgroundColor: "#F59E0B",
    marginLeft: 4,
  },

  logoBlue: {
    height: 25,
    width: 4,
    backgroundColor: "#60A5FA",
    marginLeft: 3,
    marginTop: 6,
  },

  headerUnderline: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: "#F59E0B",
  },

  body: {
    paddingHorizontal: 22,
    paddingTop: 20,
    alignItems: "center",
    overflow: "hidden",
  },

  decorTopLeft: {
    position: "absolute",
    top: 35,
    left: -42,
    width: 155,
    height: 8,
    backgroundColor: "#DCE8FC",
    transform: [{ rotate: "-47deg" }],
  },

  decorTopRight: {
    position: "absolute",
    top: 49,
    right: -34,
    width: 155,
    height: 8,
    backgroundColor: "#DCE8FC",
    transform: [{ rotate: "-47deg" }],
  },

  intro: { alignItems: "center", width: "100%", marginBottom: 16 },

  qrIconBadge: {
    width: 66,
    height: 66,
    borderRadius: 23,
    backgroundColor: "#E0EBFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  iconOrangeAccent: {
    position: "absolute",
    width: 8,
    height: 24,
    backgroundColor: "#F59E0B",
    right: 8,
    bottom: -3,
    transform: [{ rotate: "-27deg" }],
  },

  title: {
    color: "#0B2451",
    fontSize: 27,
    fontWeight: "900",
    letterSpacing: -0.6,
    textAlign: "center",
  },

  subtitle: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
    textAlign: "center",
    marginTop: 7,
    paddingHorizontal: 8,
  },

  qrCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 27,
    borderWidth: 1,
    borderColor: "#D7E1EF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0B2451",
    shadowOpacity: 0.13,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    marginBottom: 14,
  },

  qrAccentTop: {
    position: "absolute",
    top: -3,
    left: 22,
    width: 49,
    height: 7,
    backgroundColor: "#F59E0B",
  },

  qrAccentRight: {
    position: "absolute",
    top: 22,
    right: -3,
    width: 7,
    height: 49,
    backgroundColor: "#60A5FA",
  },

  qrAccentLeft: {
    position: "absolute",
    bottom: 22,
    left: -3,
    width: 7,
    height: 49,
    backgroundColor: "#60A5FA",
  },

  qrAccentBottom: {
    position: "absolute",
    bottom: -3,
    right: 22,
    width: 49,
    height: 7,
    backgroundColor: "#F59E0B",
  },

  demoLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
    marginBottom: 15,
    gap: 10,
  },

  demoLine: { height: 2, width: 35, backgroundColor: "#B8D0F5" },

  demoLabel: {
    color: "#356CE0",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1.4,
  },

  timerPanel: {
    width: "100%",
    maxWidth: 390,
    backgroundColor: "#E7F0FA",
    borderRadius: 20,
    padding: 14,
    marginTop: 2,
    marginBottom: 8,
  },

  timerHeader: { flexDirection: "row", alignItems: "center", gap: 8 },

  timerTitle: { flex: 1, color: "#334155", fontSize: 13, fontWeight: "700" },

  timerValue: {
    color: "#356CE0",
    fontSize: 23,
    fontWeight: "900",
    fontVariant: ["tabular-nums"],
  },

  timerTrack: {
    height: 6,
    borderRadius: 4,
    backgroundColor: "#C9D8E9",
    marginTop: 10,
    overflow: "hidden",
  },

  timerProgress: { height: 6, borderRadius: 4, backgroundColor: "#356CE0" },

  timerHint: { color: "#64748B", fontSize: 11, marginTop: 8 },

  notice: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: "#FFF3D4",
    borderColor: "#F3D28A",
    borderWidth: 1,
    borderLeftWidth: 5,
    borderLeftColor: "#F59E0B",
    marginBottom: 18,
  },

  noticeContent: { flex: 1, marginLeft: 14 },

  noticeTitle: { color: "#82521A", fontWeight: "900", fontSize: 16 },

  noticeText: {
    color: "#82521A",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 7,
    fontWeight: "500",
  },

  cameraBox: {
    width: 48,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: "#6682B2",
    marginRight: 16,
  },

  scanButtonText: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },

  arrowCircle: {
    width: 49,
    height: 49,
    borderRadius: 25,
    backgroundColor: "#0878F9",
    borderWidth: 1,
    borderColor: "#62B7FF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },

  buttonOrangeSlash: {
    position: "absolute",
    right: 72,
    bottom: -14,
    width: 5,
    height: 43,
    backgroundColor: "#FF9200",
    transform: [{ rotate: "42deg" }],
  },

  pressed: { opacity: 0.82 },

  footer: {
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#D7E0ED",
    alignItems: "center",
    paddingTop: 12,
  },

  footerText: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
  },

  sessionId: {
    color: "#64748B",
    fontSize: 10,
    textAlign: "center",
    marginTop: 14,
  },
});
