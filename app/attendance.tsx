import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { RouteGuard } from "@/components/auth/RouteGuard";
import GeometricActionButton from "@/components/attendance/GeometricActionButton";
import { AppCard } from "@/components/ui/AppCard";
import { useAppTheme } from "@/features/theme/theme.provider";

// Pantalla principal de asistencia del estudiante
export default function AttendanceScreen() {
  const { colors } = useAppTheme();

  {
    /* Restringe el acceso a esta pantalla al rol STUDENT. */
  }
  return (
    <RouteGuard allowedRoles={["STUDENT"]}>
      <>
        <Stack.Screen options={{ headerShown: false }} />

        <View
          style={[styles.container, { backgroundColor: colors.background }]}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
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
                onPress={() => router.back()}
                style={styles.backButton}
                accessibilityLabel="Volver"
                accessibilityRole="button"
              >
                <Ionicons name="arrow-back" size={28} color={colors.text} />
              </Pressable>

              <Text style={[styles.headerTitle, { color: colors.text }]}>
                Asistencia
              </Text>
            </View>

            <View style={styles.introduction}>
              <Text style={[styles.mainTitle, { color: colors.text }]}>
                ¿Qué querés hacer?
              </Text>

              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Gestioná la asistencia de tus clases.
              </Text>
            </View>

            {/* Permite al estudiante escanear el código QR para registrar su asistencia. */}
            <View style={styles.qrContainer}>
              <GeometricActionButton
                label="ESCANEAR QR"
                icon="camera-outline"
                onPress={() => router.push("/qr-scanner")}
              />
            </View>
            
            {/* Permite acceder al historial de asistencias registradas. */}
            <Pressable
              onPress={() => router.push("/attendance-history")}
              accessibilityRole="button"
              style={styles.cardContainer}
            >
              <AppCard>
                <View style={styles.cardContentRow}>
                  <View
                    style={[
                      styles.historyIcon,
                      { backgroundColor: colors.success },
                    ]}
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={30}
                      color={colors.white}
                    />
                  </View>

                  <View style={styles.cardContent}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>
                      Consultar asistencia
                    </Text>

                    <Text
                      style={[
                        styles.cardDescription,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Consultá el historial de asistencia.
                    </Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={25}
                    color={colors.inactive}
                  />
                </View>
              </AppCard>
            </Pressable>
          </ScrollView>
        </View>
      </>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 40,
  },

  header: {
    height: 95,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    borderBottomWidth: 1,
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
  },

  introduction: {
    paddingHorizontal: 28,
    paddingTop: 40,
    paddingBottom: 28,
  },

  mainTitle: {
    fontSize: 27,
    fontWeight: "800",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },

  qrContainer: {
    marginHorizontal: 22,
    marginBottom: 22,
  },

  cardContainer: {
    marginHorizontal: 24,
    marginBottom: 14,
  },

  cardContentRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  historyIcon: {
    width: 62,
    height: 62,
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
    marginBottom: 5,
  },

  cardDescription: {
    fontSize: 13,
    lineHeight: 19,
  },
});
