
import { apiClient } from "../../lib/api/api.client";

const CHECK_IN_CONFIG = {
    durationMinutes: 15,
    rotationSeconds: 30,
    lateAfterMinutes: 10,
};

export interface CheckInQrResponse {
    windowId: string;
    token: string;
    expiresAt: string;
    rotationSeconds: number;
    closesAt: string;
}

export interface OpenCheckInWindowPayload {
    mode: "QR" | "QR_GEO";
    durationMinutes: number;
    rotationSeconds: number;
    lateAfterMinutes: number;
    latitude?: number;
    longitude?: number;
    radiusMeters?: number;
}

export type OpenCheckInWindowOptions =
    | {
        mode?: "QR";
    }
    | {
        mode: "QR_GEO";
        latitude: number;
        longitude: number;
        radiusMeters?: number;
    };

interface ApiResponse<T> {
    success: boolean;
    data: T;
    timestamp: string;
}

/* Abre la ventana de autoregistro QR o QR con geolocalización. */
export async function openCheckInWindow(
    sessionId: string,
    options: OpenCheckInWindowOptions = { mode: "QR" },
): Promise<unknown> {
    const payload: OpenCheckInWindowPayload = {
        ...CHECK_IN_CONFIG,
        mode: options.mode ?? "QR",
    };

    if (options.mode === "QR_GEO") {
        payload.latitude = options.latitude;
        payload.longitude = options.longitude;
        payload.radiusMeters = options.radiusMeters ?? 60;
    }

    return apiClient(
        `/class-sessions/${sessionId}/check-in-window`,
        {
            method: "POST",
            body: JSON.stringify(payload),
        },
    );
}

/* Obtiene el token QR vigente de una clase. */
export async function getCheckInQr(
    sessionId: string,
): Promise<CheckInQrResponse> {
    const response = await apiClient<ApiResponse<CheckInQrResponse>>(
        `/class-sessions/${sessionId}/check-in-window/qr`,
        {
            method: "GET",
        },
    );

    return response.data;
}
