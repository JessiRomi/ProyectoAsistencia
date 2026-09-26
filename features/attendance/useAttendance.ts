import { useState } from "react";

import {
  closeClassSession,
  createClassSession,
  getCourseSessions,
  saveBulkAttendance,
} from "./attendance.service";

import type {
  BulkAttendanceItem,
  ClassSession,
} from "./attendance.types";

function getTodayDate(): string {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function useAttendance() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  async function saveAttendance(
    courseOfferingId: string,
    students: BulkAttendanceItem[],
  ) {
    try {
      setIsSaving(true);
      setError("");

      const today = getTodayDate();

      /*
       * Primero consultamos si ya existe una sesión
       * para la cursada en la fecha de hoy.
       */
      const sessions = await getCourseSessions(
        courseOfferingId,
      );

      const todaySession = sessions.find(
        (session) => session.date.startsWith(today),
      );

      let session: ClassSession;

      if (todaySession) {
        /*
         * Si ya existe una sesión para hoy,
         * no intentamos crear otra.
         */
        if (todaySession.status === "CLOSED") {
          throw new Error(
            "Ya existe una sesión cerrada para hoy. No se puede registrar otra asistencia para esta fecha.",
          );
        }

        session = todaySession;
      } else {
        /*
         * Si no existe una sesión para hoy,
         * creamos una nueva.
         */
        session = await createClassSession(
          courseOfferingId,
          {
            date: today,
            topic: "Clase",
          },
        );
      }

      /*
       * Guardamos la asistencia utilizando
       * la sesión existente o recién creada.
       */
      await saveBulkAttendance(session.id, {
        records: students,
      });

      /*
       * Cerramos la sesión después de guardar
       * correctamente la asistencia.
       */
      await closeClassSession(session.id);

      return session;
    } catch (error) {
      console.error(
        "Error guardando asistencia:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo guardar la asistencia.",
      );

      throw error;
    } finally {
      setIsSaving(false);
    }
  }

  function clearError() {
    setError("");
  }

  return {
    saveAttendance,
    isSaving,
    error,
    clearError,
  };
}

