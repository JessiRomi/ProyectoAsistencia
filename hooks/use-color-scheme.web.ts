
import { useSyncExternalStore } from "react";
import { useColorScheme as useRNColorScheme } from "react-native";

function subscribeToHydration() {
  return () => { };
}

function getHydrationSnapshot() {
  return true;
}

function getServerHydrationSnapshot() {
  return false;
}

/**
 * Keeps the initial web render on light mode to support hydration.
 */
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
