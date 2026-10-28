import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import GeometricActionButton from "@/components/attendance/GeometricActionButton";

export default function AttendanceScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Pressable
              onPress={() => router.back()}
              style={styles.backButton}
              accessibilityLabel="Volver"
            >
              <Ionicons name="arrow-back" size={28} color="#1F2937" />
            </Pressable>
            <Text style={styles.headerTitle}>Asistencia</Text>
          </View>

          <View style={styles.introduction}>
            <Text style={styles.mainTitle}>¿Qué querés hacer?</Text>
            <Text style={styles.subtitle}>
              Gestioná la asistencia de tus clases.
            </Text>
          </View>

          {/* ESCANEAR QR */}
          <View style={{ marginHorizontal: 22, marginBottom: 22 }}>
            <GeometricActionButton
              label="ESCANEAR QR"
              icon="camera-outline"
              onPress={() => router.push("/qr-scanner")}
            />
          </View>

          {/* CONSULTAR ASISTENCIA */}
          <Pressable
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed,
            ]}
            onPress={() => router.push("/attendance-history")}
            accessibilityRole="button"
          >
            <View style={styles.historyIcon}>
              <Ionicons name="calendar-outline" size={30} color="#FFFFFF" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Consultar asistencia</Text>
              <Text style={styles.cardDescription}>
                Consultá el historial de asistencia.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={25} color="#9CA3AF" />
          </Pressable>

          {/* INFORMACIÓN DEL USUARIO */}
          <View style={styles.userCard}>
            <Ionicons name="person-circle-outline" size={27} color="#4070B2" />
            <View style={styles.userContent}>
              <Text style={styles.userLabel}>Usuario</Text>
              <Text style={styles.userRole}>Estudiante</Text>
            </View>
          </View>
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
  scrollContent: {
    paddingBottom: 40,
  },

  header: {
    height: 95,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  backButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1F2937",
  },

  introduction: {
    paddingHorizontal: 28,
    paddingTop: 40,
    paddingBottom: 28,
  },

  mainTitle: {
    fontSize: 27,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    lineHeight: 22,
  },

  card: {
    marginHorizontal: 24,
    marginBottom: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  cardPressed: {
    opacity: 0.8,
  },

  historyIcon: {
    width: 62,
    height: 62,
    borderRadius: 17,
    backgroundColor: "#9DC45B",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 5,
  },

  cardDescription: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 19,
  },

  userCard: {
    marginHorizontal: 24,
    marginTop: 22,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  userContent: {
    marginLeft: 14,
  },

  userLabel: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 4,
  },

  userRole: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1F2937",
  },
});
