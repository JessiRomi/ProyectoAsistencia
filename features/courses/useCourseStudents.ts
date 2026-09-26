import { useCallback, useEffect, useState } from "react";

import { getCourseStudents } from "./courses.service";
import type { EnrolledStudent } from "./courses.types";

export function useCourseStudents(
  courseOfferingId: string | string[] | undefined,
) {
  const [students, setStudents] = useState<EnrolledStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStudents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const courseId = Array.isArray(courseOfferingId)
        ? courseOfferingId[0]
        : courseOfferingId;

      if (!courseId) {
        setStudents([]);
        setError("No se encontró la cursada.");
        return;
      }

      console.log("Cargando estudiantes de la cursada:", courseId);

      const data = await getCourseStudents(courseId);

      console.log("Estudiantes recibidos:", data);

      setStudents(data);
    } catch (error) {
      console.error("Error cargando los estudiantes:", error);
      setError("No se pudieron cargar los estudiantes.");
    } finally {
      setIsLoading(false);
    }
  }, [courseOfferingId]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  return {
    students,
    isLoading,
    error,
    reload: loadStudents,
  };
} 
