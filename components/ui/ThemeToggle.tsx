import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";
import { useAppTheme } from "@/features/theme/theme.provider";

// Permite alternar entre el modo claro y oscuro de la aplicación
export function ThemeToggle() {
  const { mode, colors, toggleTheme } = useAppTheme();
  // Determina si el tema oscuro está activo para adaptar el icono y la accesibilidad
  const isDark = mode === "dark";

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={
        isDark ? "Activar modo claro" : "Activar modo oscuro"
      }
      accessibilityState={{ checked: isDark }}
      onPress={toggleTheme}
      hitSlop={8}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        pressed && styles.pressed,
      ]}
    >
      <Ionicons
        name={isDark ? "sunny-outline" : "moon-outline"}
        size={24}
        color={colors.accent}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 0,
  },
  pressed: {
    opacity: 0.7,
  },
});
