import { useCallback, useEffect, useState } from "react";
import { getCourseSessions } from "./attendance.service";
import type { ClassSession } from "./attendance.types";

export function useCourseSessions(courseOfferingId: string) {
  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSessions = useCallback(async () => {
    if (!courseOfferingId) {
      setSessions([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const data = await getCourseSessions(courseOfferingId);

      setSessions(data);
    } catch (error) {
      console.error("Error cargando las sesiones:", error);
      setError("No se pudieron cargar las clases.");
    } finally {
      setIsLoading(false);
    }
  }, [courseOfferingId]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  return {
    sessions,
    isLoading,
    error,
    reload: loadSessions,
  };
}
