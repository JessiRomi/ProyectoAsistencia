// Roles disponibles en el sistema según el backend
export type UserRole =
  | "ADMIN"
  | "ACADEMIC"
  | "TEACHER"
  | "STUDENT";

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
}

// Datos principales del usuario autenticado
export interface User {
  id: string;
  email: string;
  role: UserRole;
  profile?: UserProfile;
}

// Estructura de la respuesta recibida al iniciar sesión
export interface LoginResponse {
  success: boolean;
  data: {
    accessToken: string;
    user: User;
  };
  timestamp: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
