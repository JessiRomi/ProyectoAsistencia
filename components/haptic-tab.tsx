import { PlatformPressable } from "expo-router/react-navigation";
import * as Haptics from "expo-haptics";

// Componente de navegación que incorpora respuesta háptica al presionar una pestaña
export function HapticTab(props: any) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        // Ejecuta una vibración ligera únicamente en dispositivos iOS
        if (process.env.EXPO_OS === "ios") {
          Haptics.impactAsync(
            Haptics.ImpactFeedbackStyle.Light
          );
        }

        props.onPressIn?.(ev);
      }}
    />
  );
}
