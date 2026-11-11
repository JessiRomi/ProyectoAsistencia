import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { AuthProvider } from "@/features/auth/session.provider";
import { AppThemeProvider, useAppTheme } from "@/features/theme/theme.provider";

// Configura la navegación principal y adapta el tema de Expo Router al tema de la aplicación
function AppNavigation() {
  const { mode, colors } = useAppTheme();

  // Sincroniza los colores de navegación con el modo claro u oscuro seleccionado
  const navigationTheme = {
    ...(mode === "dark" ? DarkTheme : DefaultTheme),
    colors: {
      ...(mode === "dark" ? DarkTheme.colors : DefaultTheme.colors),
      primary: colors.secondary,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      notification: colors.accent,
    },
  };
  {
    /* Aplica el tema personalizado a todas las pantallas de navegación. */
  }
  return (
    <ThemeProvider value={navigationTheme}>
      <Stack>
        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="teacher"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      {/* Adapta el estilo de la barra de estado al tema activo. */}
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
    </ThemeProvider>
  );
}

// Inicializa los proveedores globales de tema y autenticación de la aplicación
export default function RootLayout() {
  return (
    <AppThemeProvider>
      <AuthProvider>
        <AppNavigation />
      </AuthProvider>
    </AppThemeProvider>
  );
}
