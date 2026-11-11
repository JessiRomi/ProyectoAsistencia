import { useCallback, useEffect, useState } from "react";
import { getMyAttendance } from "./attendance.service";
import type {
  StudentAttendanceRecord,
  StudentAttendanceTotals,
} from "./attendance.types";

// Gestiona el historial y los totales de asistencia del estudiante
export function useStudentAttendance(courseOfferingId?: string) {
  const [records, setRecords] = useState<StudentAttendanceRecord[]>([]);
  const [totals, setTotals] = useState<StudentAttendanceTotals>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Consulta la asistencia y actualiza los registros, totales y estados de carga
  const loadAttendance = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await getMyAttendance(courseOfferingId);

      setRecords(Array.isArray(data?.records) ? data.records : []);
      setTotals(data?.totals ?? {});
    } catch (error) {
      console.error("Error consultando asistencia:", error);

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo consultar la asistencia.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [courseOfferingId]);

  // Carga la asistencia al iniciar el hook o cuando cambia la cursada
  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const data = await getMyAttendance(courseOfferingId);

        if (active) {
          setRecords(Array.isArray(data?.records) ? data.records : []);
          setTotals(data?.totals ?? {});
          setError("");
        }
      } catch (error) {
        console.error("Error consultando asistencia:", error);

        if (active) {
          setError(
            error instanceof Error
              ? error.message
              : "No se pudo consultar la asistencia.",
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
  }, [courseOfferingId]);

  return {
    records,
    totals,
    isLoading,
    error,
    reload: loadAttendance,
  };
}
