import * as Location from "expo-location";

// Estructura de las coordenadas obtenidas del dispositivo
export interface UserLocation {
    latitude: number;
    longitude: number;
    accuracyMeters?: number;
}

// Solicita permisos y obtiene la ubicación actual con alta precisión
export async function getCurrentLocation(): Promise<UserLocation> {
    const { status } = await Location.requestForegroundPermissionsAsync();

    // Verifica que el usuario haya concedido el permiso de ubicación
    if (status !== "granted") {
        throw new Error(
            "Necesitamos permiso de ubicación para registrar la asistencia.",
        );
    }

    const servicesEnabled = await Location.hasServicesEnabledAsync();

    // Comprueba que los servicios de ubicación del dispositivo estén activos
    if (!servicesEnabled) {
        throw new Error(
            "La ubicación del dispositivo está desactivada. Activá el GPS para continuar.",
        );
    }

    const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
    });

    return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        ...(location.coords.accuracy !== null && {
            accuracyMeters: location.coords.accuracy,
        }),
    };
}
