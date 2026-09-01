import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { authService } from "../services/auth.service";
import type { User } from "../types/auth";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;

  login: (
    email: string,
    password: string,
  ) => Promise<User>;

  logout: () => Promise<void>;
}

export const AuthContext = createContext<
  AuthContextType | undefined
>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = user !== null;

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      const token = await authService.getToken();

      if (!token) {
        setUser(null);
        return;
      }

      const authenticatedUser =
        await authService.getMe();

      setUser(authenticatedUser);
    } catch (error) {
      console.error(
        "Error comprobando la sesión:",
        error,
      );

      await authService.logout();

      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(
    email: string,
    password: string,
  ): Promise<User> {
    const response = await authService.login({
      email,
      password,
    });

    const authenticatedUser = response.data.user;

    setUser(authenticatedUser);

    return authenticatedUser;
  }

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
