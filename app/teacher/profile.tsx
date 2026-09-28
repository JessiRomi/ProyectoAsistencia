import { Stack, router } from "expo-router";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useSession } from "@/features/auth/useSession";

export default function TeacherProfileScreen() {
  const { user } = useSession();

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorTitle}>
            No se pudo cargar el perfil
          </Text>

          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>
              Volver
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const fullName = user.profile
    ? `${user.profile.firstName} ${user.profile.lastName}`
    : "Sin nombre registrado";

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>
              ← Volver
            </Text>
          </Pressable>

          <Text style={styles.title}>
            Mi perfil
          </Text>

          <Text style={styles.subtitle}>
            Información de la cuenta
          </Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.profile?.firstName?.charAt(0).toUpperCase() ?? "P"}
            </Text>
          </View>

          <Text style={styles.name}>
            {fullName}
          </Text>

          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>
              Profesor
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              Nombre
            </Text>

            <Text style={styles.infoValue}>
              {fullName}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              Correo electrónico
            </Text>

            <Text style={styles.infoValue}>
              {user.email}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              Rol
            </Text>

            <Text style={styles.infoValue}>
              Profesor
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  header: {
    marginBottom: 24,
  },

  backButton: {
    alignSelf: "flex-start",
    marginBottom: 18,
    paddingVertical: 6,
  },

  backButtonText: {
    color: "#4070B2",
    fontSize: 15,
    fontWeight: "700",
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1F2937",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#6B7280",
  },

  profileCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 28,
    paddingHorizontal: 20,
    marginBottom: 16,
  },

  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#4070B2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
  },

  name: {
    fontSize: 21,
    fontWeight: "800",
    color: "#1F2937",
    textAlign: "center",
  },

  roleBadge: {
    marginTop: 10,
    backgroundColor: "#E8F0FA",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },

  roleText: {
    color: "#4070B2",
    fontSize: 13,
    fontWeight: "700",
  },

  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 18,
  },

  infoRow: {
    paddingVertical: 17,
  },

  infoLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 5,
  },

  infoValue: {
    fontSize: 15,
    color: "#1F2937",
    fontWeight: "600",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
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
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 18,
  },
});

