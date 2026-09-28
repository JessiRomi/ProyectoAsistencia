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

export interface User {
  id: string;
  email: string;
  role: UserRole;
  profile?: UserProfile;
}

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
