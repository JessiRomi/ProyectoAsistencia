import { createContext, useEffect, useState, type ReactNode } from "react";
import { authService } from "./auth.service";
import type { User } from "./auth.types";

// Verifica si el rol del usuario está habilitado para esta aplicación
function isSupportedRole(role: string): role is "STUDENT" | "TEACHER" {
  return role === "STUDENT" || role === "TEACHER";
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

// Contexto que comparte el estado y las operaciones de autenticación
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

// Proveedor global que administra la sesión del usuario
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = user !== null;

 // Comprueba si existe una sesión guardada y recupera los datos del usuario al iniciar la aplicación 
  useEffect(() => {
    let active = true;

    async function initializeSession() {
      try {
        const token = await authService.getToken();

        if (!token) {
          if (active) {
            setUser(null);
          }
          return;
        }

        const authenticatedUser = await authService.getMe();

        if (!isSupportedRole(authenticatedUser.role)) {
          await authService.logout();

          if (active) {
            setUser(null);
          }

          return;
        }

        if (active) {
          setUser(authenticatedUser);
        }
      } catch (error) {
        console.error("Error comprobando la sesión:", error);

        try {
          await authService.logout();
        } catch (logoutError) {
          console.error("Error limpiando la sesión:", logoutError);
        }

        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void initializeSession();

    return () => {
      active = false;
    };
  }, []);

  async function login(email: string, password: string): Promise<User> {
    const response = await authService.login({
      email,
      password,
    });

    const authenticatedUser = response.data.user;

    if (!isSupportedRole(authenticatedUser.role)) {
      await authService.logout();
      setUser(null);
      throw new Error("Tu perfil no tiene acceso a esta aplicación.");
    }

    setUser(authenticatedUser);

    return authenticatedUser;
  }

  // Cierra la sesión y limpia el usuario del estado global
  async function logout(): Promise<void> {
    await authService.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
