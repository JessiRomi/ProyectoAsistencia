import { Redirect } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { useAppTheme } from "@/features/theme/theme.provider";
import { useSession } from "@/features/auth/useSession";

// Redirige al usuario a la pantalla correspondiente según su sesión y rol
export default function Index() {
  const { user, loading } = useSession();
  const { colors } = useAppTheme();

  // Muestra un indicador mientras se verifica el estado de la sesión
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

   // Si no hay un usuario autenticado, redirige al inicio de sesión
  if (!user) {
    return <Redirect href="/login" />;
  }

  if (user.role === "TEACHER") {
    return <Redirect href="/teacher" />;
  }

  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
