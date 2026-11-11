import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

// Clave utilizada para identificar el token en el almacenamiento local
const TOKEN_KEY = "accessToken";

//Obtiene el token de autenticación. Android utiliza SecureStore.
//Web utiliza localStorage.
export async function getToken(): Promise<string | null> {
  if (Platform.OS === "web") {
    if (typeof window === "undefined") {
      return null;
    }

    return window.localStorage.getItem(TOKEN_KEY);
  }

  return SecureStore.getItemAsync(TOKEN_KEY);
}

//Guarda el token de autenticación.
export async function setToken(token: string): Promise<void> {
  if (Platform.OS === "web") {
    if (typeof window === "undefined") {
      throw new Error("El almacenamiento web no está disponible.");
    }

    window.localStorage.setItem(TOKEN_KEY, token);
    return;
  }

  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

//Elimina el token de autenticación.
export async function removeToken(): Promise<void> {
  if (Platform.OS === "web") {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.removeItem(TOKEN_KEY);
    return;
  }

  await SecureStore.deleteItemAsync(TOKEN_KEY);
}