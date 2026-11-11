import { useContext } from "react";
import {
  AuthContext,
  type AuthContextType,
} from "./session.provider";

// Hook personalizado para acceder al contexto de autenticación
export function useSession(): AuthContextType {
  const context = useContext(AuthContext);

  // Evita utilizar el hook fuera del proveedor de autenticación
  if (!context) {
    throw new Error(
      "useSession debe utilizarse dentro de un AuthProvider",
    );
  }

  return context;
}