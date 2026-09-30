import { useCallback, useEffect, useState } from "react";

import { getMyAttendance } from "./attendance.service";

import type {
  StudentAttendanceRecord,
  StudentAttendanceTotals,
} from "./attendance.types";

export function useStudentAttendance() {
  const [records, setRecords] = useState<StudentAttendanceRecord[]>([]);
  const [totals, setTotals] = useState<StudentAttendanceTotals>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAttendance = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getMyAttendance();

      setRecords(
        Array.isArray(data?.records)
          ? data.records
          : [],
      );

      setTotals(data?.totals ?? {});
    } catch (error) {
      console.error(
        "Error consultando asistencia:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo consultar la asistencia.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);

  return {
    records,
    totals,
    isLoading,
    error,
    reload: loadAttendance,
  };
}
