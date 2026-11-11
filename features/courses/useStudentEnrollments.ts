import { useCallback, useEffect, useState } from "react";
import { getMyEnrollments } from "./courses.service";
import type { StudentEnrollment } from "./courses.types";

// Gestiona la consulta de las inscripciones del estudiante autenticado
export function useStudentEnrollments() {
    const [enrollments, setEnrollments] = useState<StudentEnrollment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    // Permite actualizar manualmente la lista de inscripciones
    const loadEnrollments = useCallback(async () => {
        setIsLoading(true);
        setError("");

        try {
            const data = await getMyEnrollments();
            setEnrollments(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error consultando las inscripciones:", error);

            setError(
                error instanceof Error
                    ? error.message
                    : "No se pudieron consultar las materias.",
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Carga las inscripciones al iniciar el hook y evita actualizar el estado si el efecto ya se limpió
    useEffect(() => {
        let active = true;

        async function load() {
            try {
                const data = await getMyEnrollments();

                if (active) {
                    setEnrollments(Array.isArray(data) ? data : []);
                    setError("");
                }
            } catch (error) {
                console.error("Error consultando las inscripciones:", error);

                if (active) {
                    setError(
                        error instanceof Error
                            ? error.message
                            : "No se pudieron consultar las materias.",
                    );
                }
            } finally {
                if (active) {
                    setIsLoading(false);
                }
            }
        }

        void load();

        return () => {
            active = false;
        };
    }, []);

    return {
        enrollments,
        isLoading,
        error,
        reload: loadEnrollments,
    };
}
