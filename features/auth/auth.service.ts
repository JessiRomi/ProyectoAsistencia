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

interface AuthMeResponse {
  success: boolean;
  data: User;
  timestamp: string;
}

export const authService = {
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