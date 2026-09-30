export type AttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "LATE"
  | "JUSTIFIED";

export type CreateClassSessionPayload = {
  date: string;
  topic: string;
  notes?: string;
};

export type ClassSessionStatus = "OPEN" | "CLOSED";

export type ClassSession = {
  id: string;
  courseOfferingId: string;
  date: string;
  topic?: string;
  notes?: string | null;
  status: ClassSessionStatus;
  createdByTeacherId?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type BulkAttendanceItem = {
  studentId: string;
  status: AttendanceStatus;
  observation?: string;
};

export type BulkAttendancePayload = {
  records: BulkAttendanceItem[];
};

/**
 * Registro de asistencia devuelto por:
 * GET /class-sessions/{id}/attendance
 */
export type AttendanceRecord = {
  id: string;
  classSessionId: string;
  studentId: string;
  status: AttendanceStatus;
  observation?: string | null;
  markedAt?: string;
  markedByTeacherId?: string;
  createdAt?: string;
  updatedAt?: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber?: string;
    documentNumber?: string;
  };
};

/**
 * Registro de asistencia del estudiante.
 *
 * Devuelto por:
 * GET /students/me/attendance
 */
export type StudentAttendanceRecord = {
  id?: string;
  date?: string;
  status?: "PRESENT" | "ABSENT";
};

/**
 * Totales de asistencia del estudiante.
 */
export type StudentAttendanceTotals = {
  PRESENT?: number;
  ABSENT?: number;
};

/**
 * Datos de asistencia del estudiante.
 */
export type StudentAttendanceResponse = {
  records: StudentAttendanceRecord[];
  totals: StudentAttendanceTotals;
};
