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
} from "react-native";

import { useAuth } from "../hooks/use-auth";

const ROLE_ROUTES = {
  STUDENT: "/(tabs)",
  TEACHER: "/teacher",
  ACADEMIC: "/(tabs)",
  ADMIN: "/(tabs)",
} as const;

export default function LoginScreen() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] =
    useState<string | null>(null);

  async function handleLogin() {
    setError(null);

    if (!email.trim()) {
      setError(
        "Ingresá tu correo electrónico.",
      );
      return;
    }

    if (!password.trim()) {
      setError(
        "Ingresá tu contraseña.",
      );
      return;
    }

    setLoading(true);

    try {
      const authenticatedUser = await login(
        email.trim(),
        password,
      );

      const route =
        ROLE_ROUTES[authenticatedUser.role];

      router.replace(route);
    } catch (error) {
      console.error(
        "Error de login:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo iniciar sesión.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Image
            source={require("../assets/images/ITS_LOGO.jpg")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>
            Correo electrónico
          </Text>

          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="alumno@its.edu.ar"
            placeholderTextColor="#8A8A8A"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />

          <Text style={styles.label}>
            Contraseña
          </Text>

          <View
            style={styles.passwordContainer}
          >
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              placeholder="Ingresá tu contraseña"
              placeholderTextColor="#8A8A8A"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />

            <Pressable
              onPress={() =>
                setShowPassword(
                  !showPassword,
                )
              }
              disabled={loading}
            >
              <Text
                style={styles.showPassword}
              >
                {showPassword
                  ? "Ocultar"
                  : "Mostrar"}
              </Text>
            </Pressable>
          </View>

          {error && (
            <Text style={styles.error}>
              {error}
            </Text>
          )}

          <Pressable
            style={({ pressed }) => [
              styles.button,
              loading &&
                styles.buttonDisabled,
              pressed &&
                !loading &&
                styles.buttonPressed,
            ]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <View
                style={
                  styles.loadingContainer
                }
              >
                <ActivityIndicator
                  color="#FFFFFF"
                />

                <Text
                  style={styles.buttonText}
                >
                  Ingresando...
                </Text>
              </View>
            ) : (
              <Text
                style={styles.buttonText}
              >
                Ingresar
              </Text>
            )}
          </Pressable>
        </View>

        <Text style={styles.footer}>
          Instituto Técnico Superior
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
  },

  header: {
    alignItems: "center",
    marginBottom: 40,
  },

  logo: {
    width: 300,
    height: 160,
    alignSelf: "center",
  },

  form: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 24,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.08,
    shadowRadius: 12,

    elevation: 4,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    marginTop: 4,
  },

  input: {
    height: 50,

    borderWidth: 1,
    borderColor: "#D1D5DB",

    borderRadius: 10,

    paddingHorizontal: 14,

    fontSize: 16,
    color: "#111827",

    marginBottom: 18,
  },

  passwordContainer: {
    height: 50,

    borderWidth: 1,
    borderColor: "#D1D5DB",

    borderRadius: 10,

    flexDirection: "row",
    alignItems: "center",

    paddingLeft: 14,
    paddingRight: 12,

    marginBottom: 8,
  },

  passwordInput: {
    flex: 1,

    fontSize: 16,
    color: "#111827",
  },

  showPassword: {
    color: "#4070B2",

    fontWeight: "600",
    fontSize: 13,
  },

  error: {
    color: "#DC2626",

    fontSize: 14,

    marginTop: 6,
    marginBottom: 12,
  },

  button: {
    height: 52,

    backgroundColor: "#4070B2",

    borderRadius: 10,

    alignItems: "center",
    justifyContent: "center",

    marginTop: 12,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonPressed: {
    backgroundColor: "#9DC45B",
  },

  buttonText: {
    color: "#FFFFFF",

    fontSize: 16,
    fontWeight: "700",
  },

  loadingContainer: {
    flexDirection: "row",

    alignItems: "center",

    gap: 10,
  },

  footer: {
    textAlign: "center",

    color: "#9CA3AF",

    fontSize: 13,

    marginTop: 30,
  },
});
