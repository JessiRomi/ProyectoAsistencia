import { Ionicons } from "@expo/vector-icons";
import Svg, { Polygon } from "react-native-svg";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Stack, router } from "expo-router";
import { useQrScanner } from "@/features/attendance/useQrScanner";
import GeometricActionButton from "@/components/attendance/GeometricActionButton";

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const COLORS = {
  navy: "#082B68",
  navyDark: "#07152E",
  blue: "#1266FF",
  blueLight: "#DBEAFE",
  orange: "#FF9200",
  background: "#F4F7FB",
  white: "#FFFFFF",
  text: "#0B1F4D",
  secondary: "#64748B",
  border: "#D7E0EF",
  notice: "#FFF3D6",
  noticeText: "#854D0E",
};

export default function QrScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const { value, enabled, onScanned, reset } = useQrScanner();
  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.blue} />
        <Text style={styles.message}>Comprobando permiso de cámara...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <Header />
        <View style={styles.permissionContent}>
          <View style={styles.iconPanel}>
            <Ionicons name="camera-outline" size={42} color={COLORS.blue} />
          </View>
          <Text style={styles.title}>Acceso a la cámara</Text>
          <Text style={styles.message}>
            Necesitamos la cámara para leer el código QR que muestra tu
            profesor.
          </Text>
          <GeometricActionButton
            label="PERMITIR CÁMARA"
            icon="camera-outline"
            onPress={requestPermission}
          />
          <TextButton label="VOLVER" onPress={() => router.back()} />
        </View>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header />
      {!value ? (
        <ScrollView
          contentContainerStyle={styles.scanContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.intro}>
            <Text style={styles.title}>Enfocá el código QR</Text>
            <Text style={styles.message}>
              Ubicá el código dentro del marco para leerlo automáticamente.
            </Text>
          </View>
          <View style={styles.cameraShell}>
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
                <View style={styles.cornerTopLeft} />
                <View style={styles.cornerTopRight} />
                <View style={styles.cornerBottomLeft} />
                <View style={styles.cornerBottomRight} />
                <View style={styles.scanLine} />
              </View>
            </View>
            <View style={styles.cameraTag}>
              <View style={styles.liveDot} />
              <Text style={styles.cameraTagText}>LECTURA AUTOMÁTICA</Text>
            </View>
          </View>
          <View style={styles.scanHint}>
            <View style={styles.hintIcon}>
              <Ionicons name="qr-code-outline" size={27} color={COLORS.navy} />
            </View>
            <View style={styles.hintContent}>
              <Text style={styles.hintTitle}>Cómo escanear</Text>
              <Text style={styles.hintText}>
                Escaneá el código QR que muestra el docente para registrar tu
                asistencia.
              </Text>
            </View>
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerText}>ITS · ASISTENCIA ACADÉMICA</Text>
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          contentContainerStyle={styles.resultContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.resultIcon}>
            <Ionicons name="qr-code-outline" size={43} color={COLORS.blue} />
            <View style={styles.resultAccent} />
          </View>
          <Text style={styles.title}>Código QR leído</Text>
          <Text style={styles.message}>
            Se detectó correctamente el siguiente código.
          </Text>
          <View style={styles.valueCard}>
            <View style={styles.valueAccent} />
            <Text selectable style={styles.valueText}>
              {value}
            </Text>
          </View>
          <View style={styles.notice}>
            <Ionicons
              name="information-circle-outline"
              size={26}
              color={COLORS.orange}
            />
            <View style={styles.noticeContent}>
              <Text style={styles.noticeTitle}>Validación pendiente</Text>
              <Text style={styles.noticeText}>
                El código todavía no fue validado por el servidor y la
                asistencia no está registrada.
              </Text>
            </View>
          </View>
          <View style={styles.actions}>
            <GeometricActionButton
              label="ESCANEAR NUEVAMENTE"
              icon="scan-outline"
              onPress={reset}
            />
            <TextButton label="VOLVER" onPress={() => router.back()} />
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerText}>ITS · ASISTENCIA ACADÉMICA</Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

function Header() {
  return (
    <View style={styles.header}>
      <Pressable
        onPress={() => router.back()}
        style={styles.backButton}
        accessibilityRole="button"
        accessibilityLabel="Volver"
      >
        <Ionicons name="arrow-back" size={25} color={COLORS.white} />
      </Pressable>
      <View style={styles.headerText}>
        <Text style={styles.headerTitle}>Escanear QR</Text>
        <Text style={styles.headerSubtitle}>ITS · Asistencia académica</Text>
      </View>
      <View style={styles.brandMark}>
        <Ionicons name="qr-code-outline" size={28} color={COLORS.white} />
        <View style={styles.brandAccent} />
      </View>
    </View>
  );
}

function TextButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.textButton,
        pressed && styles.textButtonPressed,
      ]}
    >
      <Svg
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <Polygon
          points="7,1 93,1 99,15 99,85 93,99 7,99 1,85 1,15"
          fill="#FFFFFF"
          stroke="#5DB5FF"
          strokeWidth="1.2"
        />
        <Polygon points="7,1 16,1 1,17 1,15" fill={COLORS.navy} />
        <Polygon points="82,99 99,82 99,87 87,99" fill="#D6E9FF" />
      </Svg>
      <Ionicons name="arrow-back" size={21} color={COLORS.navy} />
      <Text style={styles.textButtonLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
    backgroundColor: COLORS.background,
  },

  header: {
    minHeight: 94,
    paddingHorizontal: 17,
    paddingVertical: 14,
    backgroundColor: COLORS.navyDark,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: COLORS.orange,
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
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "800",
  },

  headerSubtitle: {
    color: "#B8C5E0",
    fontSize: 12,
    fontWeight: "500",
  },

  brandMark: {
    width: 39,
    height: 39,
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: 2,
    borderLeftColor: COLORS.orange,
    marginLeft: 8,
  },

  brandAccent: {
    position: "absolute",
    right: 0,
    top: 2,
    width: 4,
    height: 12,
    backgroundColor: COLORS.orange,
    transform: [{ skewY: "-25deg" }],
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
    color: COLORS.navy,
    fontSize: 25,
    lineHeight: 32,
    fontWeight: "800",
    textAlign: "center",
  },

  message: {
    marginTop: 9,
    color: COLORS.secondary,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },

  cameraShell: {
    height: 410,
    position: "relative",
    overflow: "hidden",
    backgroundColor: COLORS.navyDark,
    borderWidth: 1,
    borderColor: COLORS.navyDark,
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
    borderColor: "#1677FF",
  },

  cornerTopRight: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 43,
    height: 43,
    borderTopWidth: 5,
    borderRightWidth: 5,
    borderColor: "#1677FF",
  },

  cornerBottomLeft: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 43,
    height: 43,
    borderBottomWidth: 5,
    borderLeftWidth: 5,
    borderColor: "#1677FF",
  },

  cornerBottomRight: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 43,
    height: 43,
    borderBottomWidth: 5,
    borderRightWidth: 5,
    borderColor: "#1677FF",
  },

  scanLine: {
    width: "100%",
    height: 2,
    backgroundColor: COLORS.orange,
    shadowColor: COLORS.orange,
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 6,
  },

  cameraTag: {
    position: "absolute",
    top: 13,
    left: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(7,21,46,0.86)",
    paddingHorizontal: 11,
    paddingVertical: 9,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.orange,
  },

  liveDot: {
    width: 7,
    height: 7,
    backgroundColor: "#4ADE80",
  },

  cameraTagText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },

  scanHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 22,
    padding: 16,
    backgroundColor: COLORS.white,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.orange,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  hintIcon: {
    width: 46,
    height: 46,
    backgroundColor: COLORS.blueLight,
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
    color: COLORS.navy,
  },

  hintText: {
    color: COLORS.secondary,
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
    backgroundColor: COLORS.blueLight,
    borderBottomWidth: 3,
    borderBottomColor: COLORS.orange,
  },

  resultAccent: {
    position: "absolute",
    right: -4,
    top: -4,
    width: 14,
    height: 14,
    backgroundColor: COLORS.orange,
  },

  valueCard: {
    minHeight: 94,
    marginTop: 27,
    padding: 18,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: "#A9C9FA",
    borderLeftWidth: 4,
    borderLeftColor: COLORS.blue,
    justifyContent: "center",
    alignItems: "center",
  },

  valueAccent: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 24,
    height: 4,
    backgroundColor: COLORS.orange,
  },

  valueText: {
    color: COLORS.navy,
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },

  notice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginTop: 22,
    padding: 16,
    backgroundColor: COLORS.notice,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.orange,
  },

  noticeContent: {
    flex: 1,
    gap: 5,
  },

  noticeTitle: {
    color: COLORS.noticeText,
    fontSize: 15,
    fontWeight: "800",
  },

  noticeText: {
    color: COLORS.noticeText,
    fontSize: 13,
    lineHeight: 20,
  },

  actions: {
    gap: 14,
    marginTop: 28,
  },

  textButton: {
    minHeight: 66,
    paddingHorizontal: 17,
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    backgroundColor: COLORS.white,
    borderWidth: 0,
    overflow: "hidden",
  },

  textButtonPressed: {
    backgroundColor: COLORS.blueLight,
  },

  textButtonLabel: {
    color: COLORS.navy,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.7,
  },

  permissionContent: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  iconPanel: {
    alignSelf: "center",
    width: 76,
    height: 76,
    marginBottom: 22,
    backgroundColor: COLORS.blueLight,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 3,
    borderBottomColor: COLORS.orange,
  },

  footer: {
    marginTop: 25,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: "center",
  },
  
  footerText: {
    color: COLORS.secondary,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
});
