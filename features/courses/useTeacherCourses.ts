import { useCallback, useEffect, useState } from "react";

import { getMyCourseOfferings } from "./courses.service";
import type { CourseOffering } from "./courses.types";

export function useTeacherCourses() {
  const [courses, setCourses] = useState<CourseOffering[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCourses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

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
    loadCourses();
  }, [loadCourses]);

  return {
    courses,
    isLoading,
    error,
    reload: loadCourses,
  };
}
