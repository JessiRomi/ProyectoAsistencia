import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import LogoutButton from "@/components/logout-button";
import { AppCard } from "@/components/ui/AppCard";
import { useAppTheme } from "@/features/theme/theme.provider";
import { useSession } from "@/features/auth/useSession";

export default function TeacherProfileScreen() {
  const { user } = useSession();
  const { colors } = useAppTheme();

  //Verifica que exista una sesion de usuario para mostrar el perfil
  if (!user) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.centerContainer}>
          <Text style={[styles.errorTitle, { color: colors.text }]}>
            No se pudo cargar el perfil
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  // Recupera el nombre y apellido para mostrarlos individualmente
  const fullName = user.profile
    ? `${user.profile.firstName} ${user.profile.lastName}`.trim()
    : "Sin nombre registrado";

  const firstName = user.profile?.firstName?.trim() ?? "";
  const lastName = user.profile?.lastName?.trim() ?? "";

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerSide}>
            <Ionicons.Button
              name="arrow-back"
              size={22}
              color={colors.text}
              backgroundColor="transparent"
              underlayColor="transparent"
              onPress={() => router.back()}
            />
          </View>

          <Text style={[styles.title, { color: colors.text }]}>Mi perfil</Text>

          <View style={styles.headerSide} />
        </View>

        <View style={styles.profileCard}>
          <View style={[styles.avatar, { backgroundColor: colors.secondary }]}>
            <Ionicons name="person-outline" size={42} color={colors.white} />
          </View>

          <Text style={[styles.name, { color: colors.text }]}>{fullName}</Text>

          <Text style={[styles.role, { color: colors.accent }]}>Docente</Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Información personal
        </Text>
        {/* DATOS PERSONALES Y DE ACCESO DEL DOCENTE */}
        <AppCard style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View
              style={[
                styles.infoIcon,
                { backgroundColor: `${colors.secondary}25` },
              ]}
            >
              <Ionicons
                name="person-outline"
                size={22}
                color={colors.secondary}
              />
            </View>

            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Nombre
              </Text>

              <Text style={[styles.infoValue, { color: colors.text }]}>
                {firstName || "No registrado"}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <View
              style={[
                styles.infoIcon,
                { backgroundColor: `${colors.accent}25` },
              ]}
            >
              <Ionicons name="person-outline" size={22} color={colors.accent} />
            </View>

            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Apellido
              </Text>

              <Text style={[styles.infoValue, { color: colors.text }]}>
                {lastName || "No registrado"}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <View
              style={[
                styles.infoIcon,
                { backgroundColor: `${colors.success}25` },
              ]}
            >
              <Ionicons name="mail-outline" size={22} color={colors.success} />
            </View>

            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Correo electrónico
              </Text>

              <Text
                style={[styles.infoValue, { color: colors.text }]}
                selectable
              >
                {user.email}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <View
              style={[
                styles.infoIcon,
                { backgroundColor: `${colors.accent}25` },
              ]}
            >
              <Ionicons name="school-outline" size={22} color={colors.accent} />
            </View>

            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Rol
              </Text>

              <Text style={[styles.infoValue, { color: colors.text }]}>
                Docente
              </Text>
            </View>
          </View>
        </AppCard>

        <View style={styles.logoutContainer}>
          <LogoutButton />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },

  header: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  headerSide: {
    width: 48,
    height: 44,
    justifyContent: "center",
  },

  title: {
    fontSize: 21,
    fontWeight: "800",
  },

  profileCard: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 28,
  },

  avatar: {
    width: 76,
    height: 76,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    borderRadius: 0,
  },

  name: {
    fontSize: 21,
    fontWeight: "800",
    textAlign: "center",
  },

  role: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: 6,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    marginBottom: 14,
  },

  infoCard: {
    paddingHorizontal: 16,
  },

  infoRow: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 14,
  },

  infoIcon: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 0,
  },

  infoContent: {
    flex: 1,
    gap: 4,
  },

  infoLabel: {
    fontSize: 12,
    fontWeight: "600",
  },

  infoValue: {
    fontSize: 15,
    fontWeight: "700",
  },

  divider: {
    height: 1,
  },

  logoutContainer: {
    marginTop: 28,
  },

  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  errorTitle: {
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },
});
