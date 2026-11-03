import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";

import { COLORS, DARK_COLORS } from "@/constants/theme";

const THEME_STORAGE_KEY = "its-asistencia-theme";

type ThemeMode = "light" | "dark";

type ThemeColors = typeof COLORS;

interface ThemeContextValue {
  mode: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => Promise<void>;
  isThemeLoaded: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function AppThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useSystemColorScheme();
  const [mode, setMode] = useState<ThemeMode>(
    systemColorScheme === "dark" ? "dark" : "light",
  );
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadTheme() {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);

        if (active && (savedTheme === "light" || savedTheme === "dark")) {
          setMode(savedTheme);
        }
      } catch (error) {
        console.error("No se pudo cargar el tema:", error);
      } finally {
        if (active) {
          setIsThemeLoaded(true);
        }
      }
    }

    void loadTheme();

    return () => {
      active = false;
    };
  }, []);

  const setTheme = useCallback(async (nextMode: ThemeMode) => {
    setMode(nextMode);

    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, nextMode);
    } catch (error) {
      console.error("No se pudo guardar el tema:", error);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    void setTheme(mode === "light" ? "dark" : "light");
  }, [mode, setTheme]);

  const colors = mode === "dark" ? DARK_COLORS : COLORS;

  const value = useMemo(
    () => ({
      mode,
      colors,
      toggleTheme,
      setTheme,
      isThemeLoaded,
    }),
    [mode, colors, toggleTheme, setTheme, isThemeLoaded],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useAppTheme debe utilizarse dentro de AppThemeProvider.");
  }

  return context;
}
