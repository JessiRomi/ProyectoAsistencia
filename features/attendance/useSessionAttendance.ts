import { useCallback, useEffect, useState } from "react";

import { getSessionAttendance } from "./attendance.service";
import type { AttendanceRecord } from "./attendance.types";

export function useSessionAttendance(sessionId?: string) {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAttendance = useCallback(async () => {
    if (!sessionId) {
      setAttendance([]);
      setIsLoading(false);
      setError("");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const data = await getSessionAttendance(sessionId);

      setAttendance(data);
    } catch (error) {
      console.error(
        "Error cargando la asistencia de la sesión:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo cargar la asistencia.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);

  return {
    attendance,
    isLoading,
    error,
    reload: loadAttendance,
  };
}