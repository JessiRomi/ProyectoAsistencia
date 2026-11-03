
import { useCallback, useState } from "react";

import { getMyStudentProfile } from "./student-profile.service";
import type { StudentProfile } from "./student-profile.types";

export function useStudentProfile() {
    const [profile, setProfile] = useState<StudentProfile | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const reload = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await getMyStudentProfile();
            setProfile(data);
        } catch (err) {
            console.error("Error al cargar el perfil del estudiante:", err);
            setError("No se pudo cargar tu perfil. Intentá nuevamente.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        profile,
        isLoading,
        error,
        reload,
    };
}
