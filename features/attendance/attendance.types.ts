// Estados de asistencia admitidos por el backend
export type AttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "LATE"
  | "JUSTIFIED";

// Datos necesarios para crear una sesión de clase
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

// Estructura de los datos enviados para registrar asistencias en bloque
export type BulkAttendanceItem = {
  studentId: string;
  status: AttendanceStatus;
  observation?: string;
};

export type BulkAttendancePayload = {
  records: BulkAttendanceItem[];
};

//Registro de asistencia devuelto por: GET /class-sessions/{id}/attendance
 
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

/*
 Registro de asistencia del estudiante.
 Devuelto por: GET /students/me/attendance
 */
export type StudentAttendanceRecord = {
  id: string;
  date?: string;
  classSessionId: string;
  studentId: string;
  status: AttendanceStatus;
  observation?: string | null;
  markedAt?: string;
  markedByTeacherId?: string;
  createdAt?: string;
  updatedAt?: string;
  classSession: {
    id: string;
    courseOfferingId: string;
    date: string;
    topic?: string;
    notes?: string | null;
    status: ClassSessionStatus;
    createdByTeacherId?: string;
    createdAt?: string;
    updatedAt?: string;
    courseOffering: {
      id: string;
      commission: string;
      subject: {
        id: string;
        name: string;
        code: string;
        year?: number;
        semester?: number;
      };
    };
  };
};

/**
 * Totales de asistencia del estudiante.
 */
export type StudentAttendanceTotals = {
  PRESENT?: number;
  ABSENT?: number;
  LATE?: number;
  JUSTIFIED?: number;
};

/**
 * Datos de asistencia del estudiante.
 */
export type StudentAttendanceResponse = {
  records: StudentAttendanceRecord[];
  totals: StudentAttendanceTotals;
};

