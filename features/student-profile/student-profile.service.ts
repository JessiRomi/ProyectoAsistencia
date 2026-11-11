import { apiClient } from "@/lib/api/api.client";
import type {
    StudentProfile,
    StudentProfileResponse,
} from "./student-profile.types";

// Obtiene los datos del perfil del estudiante autenticado
export async function getMyStudentProfile(): Promise<StudentProfile> {
    const response = await apiClient<StudentProfileResponse>(
        "/students/me",
        {
            method: "GET",
        },
    );

    return response.data;
}
