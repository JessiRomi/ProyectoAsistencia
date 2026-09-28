import { useContext } from "react";

import {
  AuthContext,
  type AuthContextType,
} from "./session.provider";

export function useSession(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useSession debe utilizarse dentro de un AuthProvider",
    );
  }

  return context;
}