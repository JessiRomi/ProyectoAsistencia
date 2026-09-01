import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import LogoutButton from "@/components/logout-button";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ENCABEZADO */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>¡Bienvenido!</Text>

            <Text style={styles.institution}>
              Instituto Técnico Superior
            </Text>
          </View>

          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>ITS</Text>
          </View>
        </View>

        {/* TARJETA DE BIENVENIDA */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeIcon}>
            <Ionicons
              name="school-outline"
              size={28}
              color="#FFFFFF"
            />
          </View>

          <View style={styles.welcomeContent}>
            <Text style={styles.welcomeTitle}>
              Mi espacio académico
            </Text>

            <Text style={styles.welcomeText}>
              Consultá tu información académica y el estado de tus materias.
            </Text>
          </View>
        </View>

        {/* ACCESOS PRINCIPALES */}
        <Text style={styles.sectionTitle}>
          Accesos rápidos
        </Text>

        <View style={styles.cardsContainer}>
          {/* ASISTENCIA */}
          <Pressable
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed,
            ]}
            onPress={() => router.push("/attendance")}
          >
            <View
              style={[
                styles.cardIcon,
                { backgroundColor: "#4070B2" },
              ]}
            >
              <Ionicons
                name="calendar-outline"
                size={26}
                color="#FFFFFF"
              />
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>
                Asistencia
              </Text>

              <Text style={styles.cardDescription}>
                Registrar y consultar asistencia.
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={22}
              color="#9CA3AF"
            />
          </Pressable>

          {/* MATERIAS */}
          <Pressable
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed,
            ]}
          >
            <View
              style={[
                styles.cardIcon,
                { backgroundColor: "#9DC45B" },
              ]}
            >
              <Ionicons
                name="book-outline"
                size={26}
                color="#FFFFFF"
              />
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>
                Mis materias
              </Text>

              <Text style={styles.cardDescription}>
                Consultá tus materias y comisiones.
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={22}
              color="#9CA3AF"
            />
          </Pressable>

          {/* ESTADO ACADÉMICO */}
          <Pressable
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed,
            ]}
          >
            <View
              style={[
                styles.cardIcon,
                { backgroundColor: "#4070B2" },
              ]}
            >
              <Ionicons
                name="school-outline"
                size={26}
                color="#FFFFFF"
              />
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>
                Estado académico
              </Text>

              <Text style={styles.cardDescription}>
                Consultá tus notas y situación académica.
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={22}
              color="#9CA3AF"
            />
          </Pressable>

          {/* HISTORIAL ACADÉMICO */}
          <Pressable
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed,
            ]}
          >
            <View
              style={[
                styles.cardIcon,
                { backgroundColor: "#9DC45B" },
              ]}
            >
              <Ionicons
                name="time-outline"
                size={26}
                color="#FFFFFF"
              />
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>
                Historial académico
              </Text>

              <Text style={styles.cardDescription}>
                Revisá tu trayectoria académica.
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={22}
              color="#9CA3AF"
            />
          </Pressable>
        </View>

        {/* INFORMACIÓN */}
        <View style={styles.infoCard}>
          <Ionicons
            name="information-circle-outline"
            size={22}
            color="#4070B2"
          />

          <Text style={styles.infoText}>
            Desde aquí podrás acceder a toda tu información académica.
          </Text>
        </View>

        {/* CERRAR SESIÓN */}
        <LogoutButton />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Colores institucionales del ITS
  // Azul: #4070B2
  // Verde: #9DC45B

  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 40,
  },

  /* ENCABEZADO */

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },

  headerText: {
    flex: 1,
    marginRight: 12,
  },

  greeting: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1F2937",
  },

  institution: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 5,
  },

  logoContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#4070B2",
    alignItems: "center",
    justifyContent: "center",
  },

  logoText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 1,
  },

  /* TARJETA DE BIENVENIDA */

  welcomeCard: {
    backgroundColor: "#4070B2",
    borderRadius: 18,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },

  welcomeIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },

  welcomeContent: {
    flex: 1,
  },

  welcomeTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 5,
  },

  welcomeText: {
    color: "#EAF1FA",
    fontSize: 13,
    lineHeight: 19,
  },

  /* SECCIÓN */

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 14,
  },

  /* TARJETAS */

  cardsContainer: {
    gap: 12,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.05,
    shadowRadius: 8,

    elevation: 2,
  },

  cardPressed: {
    opacity: 0.8,
  },

  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },

  cardDescription: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 17,
  },

  /* INFORMACIÓN */

  infoCard: {
    marginTop: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  infoText: {
    flex: 1,
    color: "#6B7280",
    fontSize: 12,
    lineHeight: 18,
  },
});
