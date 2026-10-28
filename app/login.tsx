import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";

import { useSession } from "../features/auth/useSession";

const ROLE_ROUTES = {
  STUDENT: "/(tabs)",
  TEACHER: "/teacher",
  ACADEMIC: "/(tabs)",
  ADMIN: "/(tabs)",
} as const;

const COLORS = {
  light: {
    background: "#F5F7FB",
    surface: "#FFFFFF",
    text: "#0B1F4D",
    secondaryText: "#64748B",
    border: "#D7E0EF",
    inputBackground: "#FFFFFF",
    primary: "#0B2D6B",
    button: "#2563EB",
    buttonPressed: "#0B2D6B",
    accent: "#FF8A00",
    error: "#DC2626",
    icon: "#64748B",
  },
  dark: {
    background: "#07152E",
    surface: "#0E2145",
    text: "#F5F7FB",
    secondaryText: "#B8C5E0",
    border: "#263F67",
    inputBackground: "#07152E",
    primary: "#2563EB",
    button: "#2563EB",
    buttonPressed: "#0B2D6B",
    accent: "#FF8A00",
    error: "#F87171",
    icon: "#B8C5E0",
  },
};

export default function LoginScreen() {
  const { login } = useSession();

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? COLORS.dark : COLORS.light;

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
      const route = ROLE_ROUTES[authenticatedUser.role];

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
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.content}>
        {/* Logo institucional */}
        <View style={styles.header}>
          <View
            style={[
              styles.logoFrame,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}
          >
            <Image
              source={require("../assets/images/ITS_LOGO.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Formulario de inicio de sesión */}
        <View
          style={[
            styles.form,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.formTitle, { color: theme.text }]}>
            Iniciar sesión
          </Text>

          <Text style={[styles.formSubtitle, { color: theme.secondaryText }]}>
            Ingresá tus datos para continuar
          </Text>

          {/* Correo electrónico */}
          <Text style={[styles.label, { color: theme.text }]}>
            Correo electrónico
          </Text>

          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: theme.inputBackground,
                borderColor: theme.border,
              },
            ]}
          >
            <Ionicons name="mail-outline" size={23} color={theme.icon} />

            <TextInput
              style={[styles.input, { color: theme.text }]}
              value={email}
              onChangeText={setEmail}
              placeholder="alumno@its.edu.ar"
              placeholderTextColor={theme.secondaryText}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              editable={!loading}
              returnKeyType="next"
            />
          </View>

          {/* Contraseña */}
          <Text style={[styles.label, { color: theme.text }]}>Contraseña</Text>

          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: theme.inputBackground,
                borderColor: theme.border,
              },
            ]}
          >
            <Ionicons name="lock-closed-outline" size={23} color={theme.icon} />

            <TextInput
              style={[styles.input, { color: theme.text }]}
              value={password}
              onChangeText={setPassword}
              placeholder="Ingresá tu contraseña"
              placeholderTextColor={theme.secondaryText}
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
                color={theme.button}
              />
            </Pressable>
          </View>

          {/* Mensaje de error */}
          {error !== null && (
            <View
              style={[
                styles.errorContainer,
                {
                  borderColor: theme.error,
                  backgroundColor: isDark ? "#301C2B" : "#FEF2F2",
                },
              ]}
            >
              <Ionicons
                name="alert-circle-outline"
                size={19}
                color={theme.error}
              />

              <Text style={[styles.error, { color: theme.error }]}>
                {error}
              </Text>
            </View>
          )}

          {/* Botón de ingreso */}
          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: theme.button },
              loading && styles.buttonDisabled,
              pressed &&
                !loading && {
                  backgroundColor: theme.buttonPressed,
                },
            ]}
            onPress={handleLogin}
            disabled={loading}
            accessibilityRole="button"
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#FFFFFF" size="small" />
                <Text style={styles.buttonText}>Ingresando...</Text>
              </View>
            ) : (
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Ingresar</Text>

                <View
                  style={[styles.buttonIcon, { backgroundColor: theme.accent }]}
                >
                  <Ionicons name="arrow-forward" size={21} color="#FFFFFF" />
                </View>
              </View>
            )}
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 12,
  },

  header: {
    alignItems: "center",
    marginBottom: 36,
  },
  logoFrame: {
    width: 268,
    height: 176,
    padding: 12,
    borderWidth: 1,
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  form: {
    borderWidth: 1,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 3,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 28,
    padding: 24,
    paddingTop: 28,
    paddingBottom: 30,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  formTitle: {
    fontSize: 27,
    fontWeight: "800",
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 34,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 10,
  },
  inputContainer: {
    minHeight: 58,
    borderWidth: 1,
    borderRadius: 3,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 30,
  },
  input: {
    flex: 1,
    minWidth: 0,
    fontSize: 15,
    fontWeight: "500",
    paddingVertical: 14,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
  },
  error: {
    flex: 1,
    fontSize: 13,
    fontWeight: "500",
  },
  button: {
    minHeight: 60,
    borderTopLeftRadius: 34,
    borderTopRightRadius: 3,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    overflow: "hidden",
  },
  buttonDisabled: {
    opacity: 0.75,
  },
  buttonContent: {
    width: "100%",
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 24,
    paddingRight: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },
  buttonIcon: {
    position: "absolute",
    right: 8,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
});
