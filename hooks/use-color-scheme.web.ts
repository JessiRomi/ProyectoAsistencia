import { useSyncExternalStore } from "react";
import { useColorScheme as useRNColorScheme } from "react-native";

// Suscripción necesaria para detectar el estado de hidratación
function subscribeToHydration() {
  return () => { };
}

// Indica que la aplicación ya se hidrató en el cliente
function getHydrationSnapshot() {
  return true;
}

// Devuelve el estado inicial utilizado durante el renderizado del servidor
function getServerHydrationSnapshot() {
  return false;
}

//Mantiene el tema claro durante el renderizado inicial web para evitar inconsistencias durante la hidratación.
export function useColorScheme() {
  const hasHydrated = useSyncExternalStore(
    subscribeToHydration,
    getHydrationSnapshot,
    getServerHydrationSnapshot,
  );

  const colorScheme = useRNColorScheme();

  if (hasHydrated) {
    return colorScheme;
  }

  return "light";
}
