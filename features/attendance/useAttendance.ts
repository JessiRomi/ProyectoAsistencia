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
  CreateClassSessionPayload,
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

  async function createSession(
    courseOfferingId: string,
    payload: CreateClassSessionPayload,
  ): Promise<ClassSession> {
    try {
      setIsSaving(true);
      setError("");

      const session = await createClassSession(
        courseOfferingId,
        payload,
      );

      return session;
    } catch (error) {
      console.error(
        "Error creando la clase:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo crear la clase.",
      );

      throw error;
    } finally {
      setIsSaving(false);
    }
  }

  /**
   * Guarda la asistencia de una sesión que ya existe.
   *
   * Se utiliza cuando el profesor creó previamente
   * una clase y luego entra a tomar asistencia.
   */
  async function saveAttendanceForSession(
    sessionId: string,
    students: BulkAttendanceItem[],
  ) {
    try {
      setIsSaving(true);
      setError("");

      await saveBulkAttendance(sessionId, {
        records: students,
      });

      await closeClassSession(sessionId);
    } catch (error) {
      console.error(
        "Error guardando asistencia de la sesión:",
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

  /**
   * Flujo anterior de asistencia.
   *
   * Se mantiene para no romper el funcionamiento existente:
   * busca la sesión del día y, si no existe, la crea.
   */
  async function saveAttendance(
    courseOfferingId: string,
    students: BulkAttendanceItem[],
  ) {
    try {
      setIsSaving(true);
      setError("");

      const today = getTodayDate();

      const sessions = await getCourseSessions(
        courseOfferingId,
      );

      const todaySession = sessions.find(
        (session) => session.date.startsWith(today),
      );

      let session: ClassSession;

      if (todaySession) {
        if (todaySession.status === "CLOSED") {
          throw new Error(
            "Ya existe una sesión cerrada para hoy. No se puede registrar otra asistencia para esta fecha.",
          );
        }

        session = todaySession;
      } else {
        session = await createClassSession(
          courseOfferingId,
          {
            date: today,
            topic: "Clase",
          },
        );
      }

      await saveBulkAttendance(session.id, {
        records: students,
      });

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
    createSession,
    saveAttendance,
    saveAttendanceForSession,
    isSaving,
    error,
    clearError,
  };
}
