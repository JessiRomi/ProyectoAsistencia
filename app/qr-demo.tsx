import { Ionicons } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";
import { Stack, router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GeometricActionButton from "@/components/attendance/GeometricActionButton";

const DEMO_QR_VALUE = "ITS-DEMO-SESION-001";

const COLORS = {
  navy: "#071B3B",
  primary: "#0B2D6B",
  blue: "#2563EB",
  blueLight: "#DBEAFE",
  orange: "#FF8A00",
  background: "#F4F7FB",
  white: "#FFFFFF",
  text: "#0B1F4D",
  secondary: "#64748B",
  border: "#D7E0EF",
  notice: "#FFF3D6",
  noticeText: "#854D0E",
};

export default function QrDemoScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.container}>
          <Header />

          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View pointerEvents="none" style={styles.decorTop}>
              <View style={styles.decorLineOne} />
              <View style={styles.decorLineTwo} />
            </View>

            <View style={styles.intro}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name="qr-code-outline"
                  size={34}
                  color={COLORS.blue}
                />
                <View style={styles.iconAccent} />
              </View>

              <Text style={styles.title}>QR de prueba</Text>

              <Text style={styles.subtitle}>
                Escaneá este código desde la opción Escanear QR.
              </Text>
            </View>

            <View style={styles.qrFrame}>
              <View style={styles.qrCornerTopLeft} />
              <View style={styles.qrCornerTopRight} />
              <View style={styles.qrCornerBottomLeft} />
              <View style={styles.qrCornerBottomRight} />

              <View style={styles.qrCard}>
                <QRCode
                  value={DEMO_QR_VALUE}
                  size={260}
                  color="#000000"
                  backgroundColor="#FFFFFF"
                  ecl="H"
                />
              </View>
            </View>

            <View style={styles.demoLabel}>
              <View style={styles.labelLine} />
              <Text style={styles.demoBadge}>MODO DEMOSTRACIÓN</Text>
              <View style={styles.labelLine} />
            </View>

            <View style={styles.warning}>
              <Ionicons
                name="information-circle-outline"
                size={28}
                color={COLORS.orange}
              />

              <View style={styles.warningContent}>
                <Text style={styles.warningTitle}>Código de prueba</Text>
                <Text style={styles.warningText}>
                  Este QR sirve para probar la cámara. No registra asistencia ni
                  representa una clase real.
                </Text>
              </View>
            </View>

            <GeometricActionButton
              label="ABRIR ESCÁNER"
              icon="camera-outline"
              onPress={() => router.push("/qr-scanner")}
            />

            <View style={styles.footer}>
              <View style={styles.footerLine} />
              <Text style={styles.footerText}>ITS · ASISTENCIA ACADÉMICA</Text>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
}

function Header() {
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Volver"
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={27} color={COLORS.white} />
      </Pressable>

      <View style={styles.headerText}>
        <Text style={styles.headerTitle}>Código QR</Text>
        <Text style={styles.headerSubtitle}>ITS · Asistencia académica</Text>
      </View>

      <View style={styles.brand}>
        <Text style={styles.brandText}>ITS</Text>
        <View style={styles.brandSlash} />
        <View style={styles.brandSlashSecond} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.navy,
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    minHeight: 82,
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: COLORS.navy,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: COLORS.orange,
  },

  backButton: {
    width: 42,
    height: 48,
    justifyContent: "center",
    alignItems: "flex-start",
  },

  headerText: {
    flex: 1,
    gap: 4,
  },

  headerTitle: {
    color: COLORS.white,
    fontSize: 21,
    fontWeight: "800",
  },

  headerSubtitle: {
    color: "#B8C5E0",
    fontSize: 12,
    fontWeight: "500",
  },

  brand: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
    paddingLeft: 8,
    height: 36,
  },

  brandText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -1,
  },

  brandSlash: {
    width: 5,
    height: 24,
    marginLeft: 4,
    backgroundColor: COLORS.orange,
    transform: [{ skewX: "-22deg" }],
  },

  brandSlashSecond: {
    width: 3,
    height: 17,
    marginLeft: 3,
    backgroundColor: "#60A5FA",
    transform: [{ skewX: "-22deg" }],
  },

  content: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 22,
  },

  decorTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 110,
    overflow: "hidden",
  },

  decorLineOne: {
    position: "absolute",
    top: 28,
    left: -22,
    width: 100,
    height: 14,
    borderTopWidth: 5,
    borderColor: "#E1ECFC",
    transform: [{ rotate: "-45deg" }],
  },

  decorLineTwo: {
    position: "absolute",
    top: 24,
    right: -12,
    width: 110,
    height: 30,
    borderTopWidth: 5,
    borderColor: "#E1ECFC",
    transform: [{ rotate: "-45deg" }],
  },

  intro: {
    width: "100%",
    alignItems: "center",
  },

  iconContainer: {
    width: 70,
    height: 70,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.blueLight,
    borderRadius: 23,
  },

  iconAccent: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 6,
    height: 17,
    backgroundColor: COLORS.orange,
    transform: [{ skewY: "-25deg" }],
  },

  title: {
    color: COLORS.text,
    fontSize: 29,
    lineHeight: 36,
    fontWeight: "900",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 10,
    marginBottom: 26,
    color: COLORS.secondary,
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center",
  },

  qrFrame: {
    position: "relative",
    padding: 10,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: "#D8E5F8",
    borderRadius: 30,
    elevation: 6,
    shadowColor: COLORS.navy,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.13,
    shadowRadius: 10,
  },

  qrCard: {
    padding: 9,
    backgroundColor: COLORS.white,
    borderRadius: 18,
  },

  qrCornerTopLeft: {
    position: "absolute",
    top: -2,
    left: 16,
    width: 35,
    height: 5,
    backgroundColor: COLORS.orange,
    zIndex: 2,
  },

  qrCornerTopRight: {
    position: "absolute",
    top: 16,
    right: -2,
    width: 5,
    height: 35,
    backgroundColor: "#60A5FA",
    zIndex: 2,
  },

  qrCornerBottomLeft: {
    position: "absolute",
    bottom: 16,
    left: -2,
    width: 5,
    height: 35,
    backgroundColor: "#60A5FA",
    zIndex: 2,
  },

  qrCornerBottomRight: {
    position: "absolute",
    bottom: -2,
    right: 16,
    width: 35,
    height: 5,
    backgroundColor: COLORS.orange,
    zIndex: 2,
  },

  demoLabel: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 23,
  },

  labelLine: {
    width: 25,
    height: 2,
    backgroundColor: "#B7D4FF",
  },

  demoBadge: {
    color: COLORS.blue,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.1,
  },

  warning: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginTop: 20,
    marginBottom: 18,
    padding: 15,
    backgroundColor: COLORS.notice,
    borderWidth: 1,
    borderColor: "#FFD28A",
    borderLeftWidth: 4,
    borderLeftColor: COLORS.orange,
  },

  warningContent: {
    flex: 1,
    gap: 5,
  },

  warningTitle: {
    color: COLORS.noticeText,
    fontSize: 14,
    fontWeight: "800",
  },

  warningText: {
    color: COLORS.noticeText,
    fontSize: 13,
    lineHeight: 19,
  },

  footer: {
    width: "100%",
    marginTop: 25,
    alignItems: "center",
    gap: 12,
  },

  footerLine: {
    width: "100%",
    height: 1,
    backgroundColor: COLORS.border,
  },

  footerText: {
    color: COLORS.secondary,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
  },
});
