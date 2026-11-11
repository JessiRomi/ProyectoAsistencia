import { useCallback, useRef, useState } from "react";
import { getCurrentLocation } from "../location/location.service";
import {
    getOpenCheckInWindows,
    registerStudentCheckIn,
} from "./student-check-in.service";

// Estados que representan las distintas etapas del registro de asistencia
type CheckInStatus =
    | "idle"
    | "validating"
    | "success"
    | "error";

// Gestiona el escaneo QR, la validación y el registro de asistencia del estudiante  
export function useQrScanner() {
    const [value, setValue] = useState<string | null>(null);
    const [enabled, setEnabled] = useState(true);
    const [status, setStatus] = useState<CheckInStatus>("idle");
    const [error, setError] = useState<string | null>(null);

    // Evita procesar varias lecturas QR simultáneamente
    const scanLock = useRef(false);

    // Valida el QR, identifica la ventana de asistencia y registra al estudiante
    const onScanned = useCallback(async (data: string) => {
        if (scanLock.current || !data.trim()) {
            return;
        }

        scanLock.current = true;

        setValue(data);
        setEnabled(false);
        setStatus("validating");
        setError(null);

        try {
            const token = data.trim();
            const tokenParts = token.split(".");

            if (tokenParts.length !== 4 || tokenParts[0] !== "GITS1") {
                throw new Error("El código QR no tiene un formato válido.");
            }

            const windowId = tokenParts[1];

            if (!windowId) {
                throw new Error("No se pudo identificar la ventana QR.");
            }

            const windows = await getOpenCheckInWindows();

            const matchingWindow = windows.find(
                (window) => window.id === windowId,
            );

            if (!matchingWindow) {
                throw new Error(
                    "El código QR no corresponde a una clase con registro abierto para tu usuario.",
                );
            }

            if (
                matchingWindow.mode !== "QR" &&
                matchingWindow.mode !== "QR_GEO"
            ) {
                throw new Error(
                    "La ventana de asistencia no está configurada para registro QR.",
                );
            }
            // Si la ventana requiere geolocalización, obtiene las coordenadas antes del registro
            if (matchingWindow.mode === "QR_GEO") {
                const location = await getCurrentLocation();

                await registerStudentCheckIn({
                    token,
                    classSessionId: matchingWindow.classSessionId,
                    latitude: location.latitude,
                    longitude: location.longitude,
                    accuracyMeters: location.accuracyMeters,
                });
            } else {
                await registerStudentCheckIn({
                    token,
                    classSessionId: matchingWindow.classSessionId,
                });
            }

            setStatus("success");
        } catch (err) {
            setStatus("error");

            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudo registrar la asistencia.",
            );
        }
    }, []);

    // Restablece el escáner para permitir una nueva lectura  
    const reset = useCallback(() => {
        scanLock.current = false;
        setValue(null);
        setEnabled(true);
        setStatus("idle");
        setError(null);
    }, []);

    return {
        value,
        enabled,
        status,
        error,
        onScanned,
        reset,
    };
}
