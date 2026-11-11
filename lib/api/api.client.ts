import { getToken } from "../storage/secure-storage";

// URL base de la API utilizada por la aplicación
const API_URL = "https://api-gits.innovaweb.com.ar";

// Cliente HTTP genérico para realizar solicitudes al backend
export const apiClient = async <T = unknown>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  // Recupera el token almacenado para autenticar las solicitudes
  const token = await getToken();
  // Ejecuta la solicitud agregando los encabezados y el token de autenticación
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
  // Convierte la respuesta del backend a un objeto JSON.
  let data: T;

  try {
    data = JSON.parse(text) as T;
  } catch {
    throw new Error(
      `La API respondió ${response.status}: ${text}`,
    );
  }
  
  // Detecta errores HTTP y utiliza el mensaje devuelto por el backend
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
