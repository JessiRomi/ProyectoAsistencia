
import { apiClient } from "../../lib/api/api.client";

/**
 * Estructura de una ventana de check-in abierta para el estudiante.
 */
export interface OpenCheckInWindow {
    id: string;
    classSessionId: string;
    mode: "QR" | "GEO" | "QR_GEO";
    rotationSeconds: number;
    radiusMeters: number | null;
    lateAfterMinutes: number;
    opensAt: string;
    closesAt: string;
    closedAt: string | null;
    openedById: string;
    classSession: {
        id: string;
        date: string;
        topic: string;
        courseOffering: {
            id: string;
            commission: string;
            subject: {
                id: string;
                name: string;
                code: string;
            };
        };
    };
}

/**
 * Respuesta estándar de la API.
 */
interface ApiResponse<T> {
    success: boolean;
    data: T;
    timestamp: string;
}

/**
 * Datos necesarios para registrar asistencia mediante QR.
 * Las coordenadas son opcionales para conservar el modo QR tradicional.
 */
export interface StudentCheckInPayload {
    token: string;
    classSessionId: string;
    latitude?: number;
    longitude?: number;
    accuracyMeters?: number;
}

/* Obtiene las ventanas de check-in abiertas para el estudiante autenticado*/
export async function getOpenCheckInWindows(): Promise<
    OpenCheckInWindow[]
> {
    const response = await apiClient<ApiResponse<OpenCheckInWindow[]>>(
        "/students/me/check-in/open",
        {
            method: "GET",
        },
    );

    return response.data;
}

/**
 * Registra la asistencia del estudiante mediante QR.
 */
export async function registerStudentCheckIn(
    payload: StudentCheckInPayload,
): Promise<unknown> {
    return apiClient(
        "/students/me/check-in",
        {
            method: "POST",
            body: JSON.stringify(payload),
        },
    );
}
