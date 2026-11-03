import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import LogoutButton from "@/components/logout-button";
import { AppCard } from "@/components/ui/AppCard";
import { useAppTheme } from "@/features/theme/theme.provider";

export default function HomeScreen() {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ENCABEZADO Y PERFIL */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={[styles.greeting, { color: colors.text }]}>
              ¡Bienvenido!
            </Text>

            <Text style={[styles.subtitle, { color: colors.accent }]}>
              Estudiante
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ir a mi perfil"
            onPress={() => router.push("/student-profile")}
            style={({ pressed }) => [
              styles.profileButton,
              { backgroundColor: colors.secondary },
              pressed && styles.cardPressed,
            ]}
          >
            <Ionicons name="person-outline" size={30} color={colors.white} />
          </Pressable>
        </View>

        {/* ACCESOS PRINCIPALES */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          ¿Qué necesitás consultar?
        </Text>

        <View style={styles.cardsContainer}>
          {/* ASISTENCIA */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Consultar asistencia"
            onPress={() => router.push("/attendance")}
            style={({ pressed }) => pressed && styles.cardPressed}
          >
            <AppCard
              padding={16}
              style={[
                styles.card,
                {
                  backgroundColor: `${colors.accent}18`,
                  borderLeftWidth: 5,
                  borderLeftColor: colors.accent,
                },
              ]}
            >
              <View
                style={[
                  styles.cardIcon,
                  { backgroundColor: `${colors.accent}30` },
                ]}
              >
                <Ionicons
                  name="calendar-outline"
                  size={30}
                  color={colors.accent}
                />
              </View>

              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                  Asistencia
                </Text>

                <Text
                  style={[
                    styles.cardDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  Registrá y consultá tu asistencia.
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={24}
                color={colors.accent}
              />
            </AppCard>
          </Pressable>

          {/* MATERIAS */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Consultar mis materias"
            onPress={() => router.push("/student-subjects")}
            style={({ pressed }) => pressed && styles.cardPressed}
          >
            <AppCard
              padding={16}
              style={[
                styles.card,
                {
                  backgroundColor: `${colors.success}18`,
                  borderLeftWidth: 5,
                  borderLeftColor: colors.success,
                },
              ]}
            >
              <View
                style={[
                  styles.cardIcon,
                  { backgroundColor: `${colors.success}30` },
                ]}
              >
                <Ionicons
                  name="book-outline"
                  size={30}
                  color={colors.success}
                />
              </View>

              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                  Mis materias
                </Text>

                <Text
                  style={[
                    styles.cardDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  Consultá tus materias y comisiones.
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={24}
                color={colors.success}
              />
            </AppCard>
          </Pressable>
        </View>

        {/* CERRAR SESIÓN */}
        <View style={styles.logoutContainer}>
          <LogoutButton />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 30,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 38,
  },

  headerText: {
    flex: 1,
  },

  greeting: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 5,
  },

  profileButton: {
    width: 58,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: "800",
    marginBottom: 18,
  },

  cardsContainer: {
    gap: 16,
  },

  card: {
    minHeight: 112,
    flexDirection: "row",
    alignItems: "center",
  },

  cardPressed: {
    opacity: 0.75,
  },

  cardIcon: {
    width: 58,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
  },

  cardDescription: {
    fontSize: 13,
    lineHeight: 19,
  },

  logoutContainer: {
    marginTop: 32,
  },
});
