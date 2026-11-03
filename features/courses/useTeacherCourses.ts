
import { useCallback, useEffect, useState } from "react";

import { getMyCourseOfferings } from "./courses.service";
import type { CourseOffering } from "./courses.types";

export function useTeacherCourses() {
  const [courses, setCourses] = useState<CourseOffering[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCourses = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await getMyCourseOfferings();
      setCourses(data);
    } catch (error) {
      console.error("Error cargando las cursadas:", error);
      setError("No se pudieron cargar las cursadas.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function load() {
      setIsLoading(true);
      setError("");

      try {
        const data = await getMyCourseOfferings();

        if (active) {
          setCourses(data);
        }
      } catch (error) {
        console.error("Error cargando las cursadas:", error);

        if (active) {
          setError("No se pudieron cargar las cursadas.");
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
    courses,
    isLoading,
    error,
    reload: loadCourses,
  };
}
