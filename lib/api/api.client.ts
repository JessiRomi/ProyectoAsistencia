import { getToken } from "../storage/secure-storage";

const API_URL = "https://api-gits.innovaweb.com.ar";

export const apiClient = async <T = unknown>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const token = await getToken();

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
        ...options.headers,
      },
    },
  );

  const text = await response.text();

  console.log(
    "API:",
    endpoint,
    "STATUS:",
    response.status,
    "RESPUESTA:",
    text,
  );

  let data: T;

  try {
    data = JSON.parse(text) as T;
  } catch {
    throw new Error(
      `La API respondió ${response.status}: ${text}`,
    );
  }

  if (!response.ok) {
    const errorData = data as {
      message?: string;
    };

    throw new Error(
      errorData?.message ||
        "Error en la solicitud",
    );
  }

  return data;
};
