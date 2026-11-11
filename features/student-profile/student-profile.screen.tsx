import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppCard } from "@/components/ui/AppCard";
import { FeedbackState } from "@/components/ui/FeedbackState";
import { RouteGuard } from "@/components/auth/RouteGuard";
import LogoutButton from "@/components/logout-button";
import { useAppTheme } from "@/features/theme/theme.provider";
import { useStudentProfile } from "@/features/student-profile/useStudentProfile";

// Gestiona la visualización del perfil y sus estados de carga y error
function StudentProfileContent() {
  const { profile, isLoading, error, reload } = useStudentProfile();
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();

  const initialLoadStarted = useRef(false);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [showInstitutionalInfo, setShowInstitutionalInfo] = useState(false);

  // Evita repetir la carga inicial del perfil durante el ciclo de vida del componente
  useEffect(() => {
    if (initialLoadStarted.current) {
      return;
    }

    initialLoadStarted.current = true;
    void reload();
  }, [reload]);

  // Prepara los datos del perfil para mostrarlos en pantalla
  const fullName = profile
    ? `${profile.firstName} ${profile.lastName}`.trim()
    : "Nombre no disponible";

  const birthDate = profile?.birthDate
    ? new Date(profile.birthDate).toLocaleDateString("es-AR")
    : "No informado";

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.background,
              paddingTop: insets.top,
              minHeight: 76 + insets.top,
            },
          ]}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Volver"
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.backButtonPressed,
            ]}
          >
            <Ionicons name="arrow-back" size={25} color={colors.text} />
          </Pressable>

          <View style={styles.headerTitleContainer} pointerEvents="none">
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Mi perfil
            </Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + 40 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.profileHeader}>
            <View
              style={[styles.avatar, { backgroundColor: colors.secondary }]}
            >
              <Ionicons name="person-outline" size={42} color={colors.white} />
            </View>

            <Text style={[styles.title, { color: colors.text }]}>
              {profile ? fullName : "Mi perfil"}
            </Text>

            {profile && (
              <Text style={[styles.role, { color: colors.accent }]}>
                Estudiante
              </Text>
            )}
          </View>
          {/* Muestra el estado de carga, error o la información del perfil según corresponda. */}
          {isLoading && !profile ? (
            <FeedbackState type="loading" message="Cargando tu perfil..." />
          ) : error && !profile ? (
            <FeedbackState
              type="error"
              message={error}
              onRetry={() => void reload()}
            />
          ) : profile ? (
            <>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Información personal
              </Text>

              <AppCard style={styles.card}>
                <ProfileRow
                  icon="person-outline"
                  label="Nombre"
                  value={profile.firstName || "No informado"}
                  iconColor={colors.secondary}
                />

                <Divider />

                <ProfileRow
                  icon="person-outline"
                  label="Apellido"
                  value={profile.lastName || "No informado"}
                  iconColor={colors.accent}
                />

                <Divider />

                <ProfileRow
                  icon="mail-outline"
                  label="Correo electrónico"
                  value={profile.email || "No informado"}
                  iconColor={colors.success}
                />
              </AppCard>

              <AppCard style={styles.additionalCard}>
                <Pressable
                  onPress={() => setShowAdditionalInfo((previous) => !previous)}
                  accessibilityRole="button"
                  accessibilityLabel={
                    showAdditionalInfo
                      ? "Ocultar información adicional"
                      : "Ver más información personal"
                  }
                  accessibilityState={{
                    expanded: showAdditionalInfo,
                  }}
                  style={styles.expandButton}
                >
                  <Ionicons
                    name="person-circle-outline"
                    size={25}
                    color={colors.secondary}
                  />

                  <Text
                    style={[styles.expandButtonText, { color: colors.text }]}
                  >
                    Ver más información
                  </Text>

                  <Ionicons
                    name={showAdditionalInfo ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={colors.textSecondary}
                  />
                </Pressable>

                {showAdditionalInfo && (
                  <View>
                    <Divider />

                    <ProfileRow
                      icon="card-outline"
                      label="Documento"
                      value={profile.documentNumber || "No informado"}
                      iconColor={colors.success}
                    />

                    <Divider />

                    <ProfileRow
                      icon="school-outline"
                      label="Número de estudiante"
                      value={profile.studentNumber || "No informado"}
                      iconColor={colors.secondary}
                    />

                    <Divider />

                    <ProfileRow
                      icon="call-outline"
                      label="Teléfono"
                      value={profile.phone || "No informado"}
                      iconColor={colors.accent}
                    />

                    <Divider />

                    <ProfileRow
                      icon="calendar-outline"
                      label="Fecha de nacimiento"
                      value={birthDate}
                      iconColor={colors.success}
                    />

                    <Divider />

                    <ProfileRow
                      icon="checkmark-circle-outline"
                      label="Estado de la cuenta"
                      value={profile.isActive ? "Activa" : "Inactiva"}
                      iconColor={
                        profile.isActive ? colors.success : colors.error
                      }
                    />
                  </View>
                )}
              </AppCard>

              <AppCard style={styles.infoCard}>
                <Pressable
                  onPress={() =>
                    setShowInstitutionalInfo((previous) => !previous)
                  }
                  accessibilityRole="button"
                  accessibilityLabel={
                    showInstitutionalInfo
                      ? "Ocultar información institucional"
                      : "Consultar información institucional"
                  }
                  accessibilityState={{
                    expanded: showInstitutionalInfo,
                  }}
                  style={styles.infoButton}
                >
                  <Ionicons
                    name="information-circle-outline"
                    size={25}
                    color={colors.secondary}
                  />

                  <Text style={[styles.infoButtonText, { color: colors.text }]}>
                    Información institucional
                  </Text>

                  <Ionicons
                    name={showInstitutionalInfo ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={colors.textSecondary}
                  />
                </Pressable>

                {showInstitutionalInfo && (
                  <Text
                    style={[styles.infoText, { color: colors.textSecondary }]}
                  >
                    Estos datos corresponden a tu perfil institucional. Si
                    necesitás modificarlos, consultá con la administración del
                    instituto.
                  </Text>
                )}
              </AppCard>

              <View style={styles.logoutContainer}>
                <LogoutButton />
              </View>
            </>
          ) : null}
        </ScrollView>
      </View>
    </>
  );
}

interface ProfileRowProps {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  value: string;
  iconColor: string;
}

// Componente reutilizable para mostrar un dato del perfil con su icono y etiqueta
function ProfileRow({ icon, label, value, iconColor }: ProfileRowProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.row}>
      <View style={[styles.rowIcon, { backgroundColor: colors.background }]}>
        <Ionicons name={icon} size={21} color={iconColor} />
      </View>

      <View style={styles.rowContent}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {label}
        </Text>

        <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
      </View>
    </View>
  );
}

// Separador visual reutilizable entre los datos del perfil
function Divider() {
  const { colors } = useAppTheme();

  return <View style={[styles.divider, { backgroundColor: colors.border }]} />;
}

// Restringe el acceso a esta pantalla exclusivamente a usuarios con rol STUDENT
export default function StudentProfileScreen() {
  return (
    <RouteGuard allowedRoles={["STUDENT"]}>
      <StudentProfileContent />
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },

  headerTitleContainer: {
    position: "absolute",
    left: 76,
    right: 76,
    top: 0,
    bottom: 12,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ translateY: 28 }],
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },

  backButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  backButtonPressed: {
    opacity: 0.6,
  },

  content: {
    paddingHorizontal: 22,
    paddingTop: 24,
  },

  profileHeader: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 48,
  },

  avatar: {
    width: 76,
    height: 76,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  title: {
    fontSize: 25,
    fontWeight: "800",
    textAlign: "center",
  },

  role: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: 8,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: "800",
    marginBottom: 20,
  },

  card: {
    marginBottom: 16,
  },

  additionalCard: {
    marginBottom: 20,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },

  rowIcon: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },

  rowContent: {
    flex: 1,
  },

  label: {
    fontSize: 12,
    marginBottom: 5,
  },

  value: {
    fontSize: 15,
    fontWeight: "700",
  },

  divider: {
    height: 1,
  },

  expandButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 42,
  },

  expandButtonText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
  },

  infoCard: {
    marginBottom: 20,
  },

  infoButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 30,
  },

  infoButtonText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
  },

  infoText: {
    fontSize: 13,
    lineHeight: 20,
    marginTop: 14,
    marginLeft: 35,
  },

  logoutContainer: {
    marginBottom: 10,
  },
});
