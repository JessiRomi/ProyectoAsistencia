import * as SecureStore from "expo-secure-store";

import type {
  LoginCredentials,
  LoginResponse,
  User,
} from "../types/auth";

import { apiClient } from "./api-client";

const TOKEN_KEY = "accessToken";

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

    await SecureStore.setItemAsync(
      TOKEN_KEY,
      response.data.accessToken,
    );

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
    return SecureStore.getItemAsync(
      TOKEN_KEY,
    );
  },

  async logout(): Promise<void> {
    await SecureStore.deleteItemAsync(
      TOKEN_KEY,
    );
  },
};