import type { ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { useAppTheme } from "@/features/theme/theme.provider";

// Define el contenido y los estilos configurables de la tarjeta
type AppCardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  padding?: number;
};

// Renderiza una tarjeta reutilizable adaptada al tema de la aplicación
export function AppCard({ children, style, padding = 16 }: AppCardProps) {
  const { colors } = useAppTheme();

  // Combina los estilos base, los colores del tema y las personalizaciones recibidas
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          padding,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 0,
    borderWidth: 1,
  },
});
