import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppButton } from "@/components/ui/AppButton";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAppTheme } from "@/features/theme/theme.provider";
import { useSession } from "../features/auth/useSession";

const ROLE_ROUTES = {
  STUDENT: "/(tabs)",
  TEACHER: "/teacher",
} as const;

export default function LoginScreen() {
  const { login, logout } = useSession();
  const { mode, colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const isDark = mode === "dark";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    setError(null);

    if (!email.trim()) {
      setError("Ingresá tu correo electrónico.");
      return;
    }

    if (!password.trim()) {
      setError("Ingresá tu contraseña.");
      return;
    }

    setLoading(true);

    try {
      const authenticatedUser = await login(email.trim(), password);

      if (!(authenticatedUser.role in ROLE_ROUTES)) {
        await logout();
        setError("Tu perfil no tiene acceso a esta aplicación.");
        return;
      }

      const route =
        ROLE_ROUTES[authenticatedUser.role as keyof typeof ROLE_ROUTES];

      router.replace(route);
    } catch (error) {
      console.error("Error de login:", error);

      setError(
        error instanceof Error ? error.message : "No se pudo iniciar sesión.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Decoraciones geométricas de fondo */}
      <View pointerEvents="none" style={styles.decorations}>
        {/* Esquina superior derecha */}
        <View style={[styles.decorationCircle, styles.topOrange]} />
        <View style={[styles.decorationCircle, styles.topBlue]} />
        <View style={[styles.decorationArc, styles.topGreenArc]} />

        {/* Esquina superior izquierda */}
        <View style={[styles.decorationArc, styles.leftOrangeArc]} />

        {/* Esquina inferior izquierda */}
        <View style={[styles.decorationCircle, styles.bottomOrange]} />
        <View style={[styles.decorationCircle, styles.bottomBlue]} />

        {/* Esquina inferior derecha */}
        <View style={[styles.decorationCircle, styles.bottomGreen]} />
        <View style={[styles.decorationArc, styles.bottomGreenArc]} />
      </View>

      {/* Selector de tema */}
      <View style={[styles.themeToggleContainer, { top: insets.top + 12 }]}>
        <ThemeToggle />
      </View>

      {/* Contenido principal */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Image
            source={
              isDark
                ? require("../assets/images/ITS_LOGO_DARK.png")
                : require("../assets/images/ITS_LOGO_LIGHT.png")
            }
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={styles.welcomeHeader}>
            <Text style={[styles.welcomeTitle, { color: colors.text }]}>
              Bienvenido
            </Text>

            <Text
              style={[styles.welcomeSubtitle, { color: colors.textSecondary }]}
            >
              Iniciá sesión para continuar
            </Text>
          </View>
        </View>

        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.text }]}>
            Correo electrónico
          </Text>

          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons
              name="mail-outline"
              size={23}
              color={colors.textSecondary}
            />

            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={email}
              onChangeText={setEmail}
              placeholder="alumno@its.edu.ar"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              editable={!loading}
              returnKeyType="next"
            />
          </View>

          <Text style={[styles.label, { color: colors.text }]}>Contraseña</Text>

          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons
              name="lock-closed-outline"
              size={23}
              color={colors.textSecondary}
            />

            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={password}
              onChangeText={setPassword}
              placeholder="Ingresá tu contraseña"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="current-password"
              editable={!loading}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />

            <Pressable
              onPress={() => setShowPassword((previous) => !previous)}
              disabled={loading}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={25}
                color={colors.accent}
              />
            </Pressable>
          </View>

          {error !== null && (
            <View
              style={[
                styles.errorContainer,
                {
                  borderColor: colors.error,
                  backgroundColor: isDark ? "#301C2B" : "#FEF2F2",
                },
              ]}
            >
              <Ionicons
                name="alert-circle-outline"
                size={19}
                color={colors.error}
              />

              <Text style={[styles.error, { color: colors.error }]}>
                {error}
              </Text>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <AppButton
              label="Ingresar"
              icon="arrow-forward"
              onPress={handleLogin}
              variant="danger"
              size="large"
              fullWidth
              loading={loading}
              disabled={loading}
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },

  decorations: {
    ...StyleSheet.absoluteFill,
    overflow: "hidden",
    zIndex: 0,
  },

  decorationCircle: {
    position: "absolute",
    borderRadius: 1000,
  },

  decorationArc: {
    position: "absolute",
    borderRadius: 1000,
    backgroundColor: "transparent",
    borderWidth: 2,
  },

  topOrange: {
    width: 125,
    height: 125,
    backgroundColor: "#FF8A00",
    top: -85,
    right: 95,
  },

  topBlue: {
    width: 150,
    height: 150,
    backgroundColor: "#2563EB",
    top: -65,
    right: -85,
  },

  topGreenArc: {
    width: 100,
    height: 100,
    borderColor: "#9DC45B",
    top: -58,
    right: 40,
  },

  leftOrangeArc: {
    width: 105,
    height: 105,
    borderColor: "#FF8A00",
    top: 105,
    left: -75,
  },

  bottomOrange: {
    width: 130,
    height: 130,
    backgroundColor: "#FF8A00",
    bottom: 65,
    left: -90,
  },

  bottomBlue: {
    width: 145,
    height: 145,
    backgroundColor: "#2563EB",
    bottom: -95,
    left: -75,
  },

  bottomGreen: {
    width: 145,
    height: 145,
    backgroundColor: "#9DC45B",
    bottom: -100,
    right: -85,
  },

  bottomGreenArc: {
    width: 105,
    height: 105,
    borderColor: "#9DC45B",
    bottom: 20,
    right: -55,
  },

  themeToggleContainer: {
    position: "absolute",
    right: 28,
    zIndex: 3,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingTop: 8,
    paddingBottom: 24,
    zIndex: 1,
  },

  header: {
    position: "relative",
    marginBottom: 28,
  },

  logo: {
    width: "100%",
    maxWidth: 450,
    height: 180,
    alignSelf: "center",
    marginBottom: 12,
  },

  welcomeHeader: {
    alignSelf: "stretch",
    gap: 5,
  },

  welcomeTitle: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },

  welcomeSubtitle: {
    fontSize: 15,
    fontWeight: "500",
  },

  form: {
    borderWidth: 0,
    padding: 0,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 7,
  },

  inputContainer: {
    minHeight: 50,
    borderWidth: 1,
    borderRadius: 0,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 15,
  },

  input: {
    flex: 1,
    minWidth: 0,
    fontSize: 15,
    fontWeight: "500",
    paddingVertical: 11,
  },

  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderWidth: 1,
    borderRadius: 0,
    marginBottom: 12,
  },

  error: {
    flex: 1,
    fontSize: 13,
    fontWeight: "500",
  },

  buttonContainer: {
    marginTop: 8,
  },
});
