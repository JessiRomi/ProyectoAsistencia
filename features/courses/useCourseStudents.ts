import { useCallback, useEffect, useState } from "react";
import { getCourseStudents } from "./courses.service";
import type { EnrolledStudent } from "./courses.types";

// Gestiona la carga de estudiantes inscriptos en una cursada
export function useCourseStudents(
  courseOfferingId: string | string[] | undefined,
) {
  const [students, setStudents] = useState<EnrolledStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Normaliza el identificador por si Expo Router lo recibe como un arreglo
  const courseId = Array.isArray(courseOfferingId)
    ? courseOfferingId[0]
    : courseOfferingId;

  // Permite actualizar manualmente la lista de estudiantes
  const loadStudents = useCallback(async () => {
    if (!courseId) {
      setStudents([]);
      setIsLoading(false);
      setError("No se encontró la cursada.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const data = await getCourseStudents(courseId);
      setStudents(data);
    } catch (error) {
      console.error("Error cargando los estudiantes:", error);
      setError("No se pudieron cargar los estudiantes.");
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  // Carga los estudiantes al iniciar el hook o cuando cambia la cursada
  useEffect(() => {
    let active = true;

    async function load() {
      if (!courseId) {
        setStudents([]);
        setIsLoading(false);
        setError("No se encontró la cursada.");
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const data = await getCourseStudents(courseId);

        if (active) {
          setStudents(data);
        }
      } catch (error) {
        console.error("Error cargando los estudiantes:", error);

        if (active) {
          setError("No se pudieron cargar los estudiantes.");
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
  }, [courseId]);

  return {
    students,
    isLoading,
    error,
    reload: loadStudents,
  };
}
