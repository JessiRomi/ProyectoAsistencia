
import * as Location from "expo-location";

export interface UserLocation {
    latitude: number;
    longitude: number;
    accuracyMeters?: number;
}

export async function getCurrentLocation(): Promise<UserLocation> {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
        throw new Error(
            "Necesitamos permiso de ubicación para registrar la asistencia.",
        );
    }

    const servicesEnabled = await Location.hasServicesEnabledAsync();

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
