import { useCallback, useEffect, useState } from "react";

import { getCourseStudents } from "./courses.service";
import type { EnrolledStudent } from "./courses.types";

const TEMPORARY_COURSE_ID =
  "temporary-aplicaciones-moviles";

const temporaryStudents: EnrolledStudent[] = [
  {
    id: "1",
    firstName: "Sofía",
    lastName: "Gómez",
  },
  {
    id: "2",
    firstName: "Martín",
    lastName: "Rodríguez",
  },
  {
    id: "3",
    firstName: "Lucía",
    lastName: "Fernández",
  },
  {
    id: "4",
    firstName: "Tomás",
    lastName: "Pérez",
  },
  {
    id: "5",
    firstName: "Valentina",
    lastName: "López",
  },
  {
    id: "6",
    firstName: "Nicolás",
    lastName: "García",
  },
  {
    id: "7",
    firstName: "Camila",
    lastName: "Martínez",
  },
  {
    id: "8",
    firstName: "Juan",
    lastName: "Sánchez",
  },
];

export function useCourseStudents(
  courseOfferingId: string | string[] | undefined,
) {
  const [students, setStudents] = useState<
    EnrolledStudent[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  const loadStudents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const courseId = Array.isArray(courseOfferingId)
        ? courseOfferingId[0]
        : courseOfferingId;

      console.log(
        "ID DE CURSADA:",
        courseId,
      );

      // Cursada temporal:
      // NO hacemos ninguna petición a la API.
      if (courseId === TEMPORARY_COURSE_ID) {
        console.log(
          "Usando estudiantes ficticios",
        );

        setStudents(temporaryStudents);
        return;
      }

      // Si no tenemos un ID válido, no consultamos la API.
      if (!courseId) {
        setStudents([]);
        setError(
          "No se encontró la cursada.",
        );
        return;
      }

      // Cursada real:
      // usamos la API.
      const data = await getCourseStudents(
        courseId,
      );

      setStudents(data);
    } catch (error) {
      console.error(
        "Error cargando los estudiantes:",
        error,
      );

      setError(
        "No se pudieron cargar los estudiantes.",
      );
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
