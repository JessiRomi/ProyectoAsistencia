import type {
  LoginCredentials,
  LoginResponse,
  User,
} from "./auth.types";

import { apiClient } from "../../lib/api/api.client";
import {
  getToken,
  removeToken,
  setToken,
} from "../../lib/storage/secure-storage";

// Estructura de la respuesta del backend al consultar el usuario autenticado
interface AuthMeResponse {
  success: boolean;
  data: User;
  timestamp: string;
}

// Centraliza las operaciones de autenticación y gestión del token
export const authService = {
  // Autentica al usuario y almacena el token de acceso de forma segura
  async login(
    credentials: LoginCredentials,
  ): Promise<LoginResponse> {
    const response =
      await apiClient<LoginResponse>(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify(credentials),
        },
      );

    await setToken(response.data.accessToken);

    return response;
  },
  // Obtiene los datos del usuario asociado al token vigente
  async getMe(): Promise<User> {
    const response =
      await apiClient<AuthMeResponse>(
        "/auth/me",
        {
          method: "GET",
        },
      );

    return response.data;
  },

  async getToken(): Promise<string | null> {
    return getToken();
  },

  async logout(): Promise<void> {
    await removeToken();
  },
};