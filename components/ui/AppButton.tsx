import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/features/theme/theme.provider";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

// Define las variantes visuales, tamaños y posiciones de los iconos
type ButtonVariant = "primary" | "secondary" | "danger";
type ButtonSize = "small" | "medium" | "large";
type IconPosition = "left" | "right";

// Define las propiedades configurables del botón reutilizable
export type AppButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: IconPosition;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
};

// Renderiza un botón adaptable al tema, con soporte para carga y deshabilitación
export function AppButton({
  label,
  onPress,
  variant = "primary",
  size = "medium",
  icon,
  iconPosition = "left",
  disabled = false,
  loading = false,
  fullWidth = false,
}: AppButtonProps) {
  const { colors } = useAppTheme();

 // Evita la interacción mientras el botón está deshabilitado o procesando una acción 
  const isDisabled = disabled || loading;

  // Centraliza los colores de cada variante según el tema activo
  const variantStyles = {
    primary: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
      textColor: colors.white,
    },
    secondary: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      textColor: colors.text,
    },
    danger: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
      textColor: colors.white,
    },
  };

  // Define las dimensiones y tamaños de texto e iconos para cada tamaño
  const sizeStyles = {
    small: {
      minHeight: 40,
      paddingHorizontal: 12,
      fontSize: 13,
      iconSize: 17,
    },
    medium: {
      minHeight: 48,
      paddingHorizontal: 18,
      fontSize: 14,
      iconSize: 19,
    },
    large: {
      minHeight: 54,
      paddingHorizontal: 22,
      fontSize: 16,
      iconSize: 21,
    },
  };

  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{
        disabled: isDisabled,
        busy: loading,
      }}
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        {
          minHeight: currentSize.minHeight,
          paddingHorizontal: currentSize.paddingHorizontal,
          backgroundColor: currentVariant.backgroundColor,
          borderColor: currentVariant.borderColor,
          alignSelf: fullWidth ? "stretch" : "flex-start",
        },
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={currentVariant.textColor} />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === "left" && (
            <Ionicons
              name={icon}
              size={currentSize.iconSize}
              color={currentVariant.textColor}
            />
          )}

          <Text
            style={[
              styles.label,
              {
                color: currentVariant.textColor,
                fontSize: currentSize.fontSize,
              },
            ]}
          >
            {label}
          </Text>

          {icon && iconPosition === "right" && (
            <Ionicons
              name={icon}
              size={currentSize.iconSize}
              color={currentVariant.textColor}
            />
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 0,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },

  label: {
    fontWeight: "700",
    textAlign: "center",
  },

  pressed: {
    opacity: 0.75,
  },

  disabled: {
    opacity: 0.55,
  },
});
