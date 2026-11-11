import { useCallback, useEffect, useState } from "react";
import { getSessionAttendance } from "./attendance.service";
import type { AttendanceRecord } from "./attendance.types";

// Gestiona la carga y consulta de los registros de asistencia de una sesión
export function useSessionAttendance(sessionId?: string) {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Permite actualizar manualmente los registros de asistencia
  const loadAttendance = useCallback(async () => {
    if (!sessionId) {
      setAttendance([]);
      setIsLoading(false);
      setError("");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const data = await getSessionAttendance(sessionId);
      setAttendance(data);
    } catch (error) {
      console.error("Error cargando la asistencia de la sesión:", error);

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo cargar la asistencia.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  // Carga la asistencia cuando cambia el identificador de sesión y evita actualizar el estado si el efecto ya se limpio
  useEffect(() => {
    let active = true;

    async function load() {
      if (!sessionId) {
        setAttendance([]);
        setIsLoading(false);
        setError("");
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const data = await getSessionAttendance(sessionId);

        if (active) {
          setAttendance(data);
        }
      } catch (error) {
        console.error("Error cargando la asistencia de la sesión:", error);

        if (active) {
          setError(
            error instanceof Error
              ? error.message
              : "No se pudo cargar la asistencia.",
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
  }, [sessionId]);

  return {
    attendance,
    isLoading,
    error,
    reload: loadAttendance,
  };
}
