import { useCallback, useEffect, useRef, useState } from "react";
import { getCourseSessions } from "./attendance.service";
import type { ClassSession } from "./attendance.types";

// Gestiona la carga y actualización de las sesiones de una cursada
export function useCourseSessions(courseOfferingId: string) {
  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Identifica cada solicitud para evitar actualizar el estado con respuestas anteriores
  const requestId = useRef(0);

  // Permite volver a cargar las sesiones cuando se necesita actualizar la información
  const loadSessions = useCallback(async () => {
    const currentRequestId = ++requestId.current;

    if (!courseOfferingId) {
      setSessions([]);
      setIsLoading(false);
      setError("");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const data = await getCourseSessions(courseOfferingId);

      if (currentRequestId === requestId.current) {
        setSessions(data);
      }
    } catch (error) {
      console.error("Error cargando las sesiones:", error);

      if (currentRequestId === requestId.current) {
        setError("No se pudieron cargar las clases.");
      }
    } finally {
      if (currentRequestId === requestId.current) {
        setIsLoading(false);
      }
    }
  }, [courseOfferingId]);

  // Carga las sesiones iniciales cuando cambia la cursada y evita actualizar el estado si el efecto ya se limpio
  useEffect(() => {
    let active = true;
    const currentRequestId = ++requestId.current;

    async function loadInitialSessions() {
      if (!courseOfferingId) {
        return;
      }

      try {
        const data = await getCourseSessions(courseOfferingId);

        if (active && currentRequestId === requestId.current) {
          setSessions(data);
          setError("");
        }
      } catch (error) {
        console.error("Error cargando las sesiones:", error);

        if (active && currentRequestId === requestId.current) {
          setError("No se pudieron cargar las clases.");
        }
      } finally {
        if (active && currentRequestId === requestId.current) {
          setIsLoading(false);
        }
      }
    }

    void loadInitialSessions();

    return () => {
      active = false;
    };
  }, [courseOfferingId]);

  return {
    sessions,
    isLoading,
    error,
    reload: loadSessions,
  };
}
