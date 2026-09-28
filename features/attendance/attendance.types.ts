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
