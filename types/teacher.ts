export interface TeacherSubject {
  id: string;
  careerId: string;
  name: string;
  code: string;
  year: number;
  semester: number;
  weeklyHours: number;
  totalHours: number;
  isActive: boolean;
}

export interface TeacherCourseOffering {
  id: string;
  subjectId: string;
  academicYearId: string;
  teacherId: string;
  commission: string;
  shift: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  classroom: string;
  maxCapacity: number;
  isActive: boolean;
  subject: TeacherSubject;
}

export interface TeacherCourseOfferingsResponse {
  success: boolean;
  data: TeacherCourseOffering[];
  timestamp: string;
}

export interface TeacherCourseOfferingResponse {
  success: boolean;
  data: TeacherCourseOffering;
  timestamp: string;
}
export interface TeacherStudent {
  id: string;
  userId: string | null;
  firstName: string;
  lastName: string;
  documentNumber: string;
  studentNumber: string;
  phone: string | null;
  email: string | null;
  birthDate: string | null;
  isActive: boolean;
}

export interface TeacherStudentsResponse {
  success: boolean;
  data: TeacherStudent[];
  timestamp: string;
}
export interface CreateClassSessionRequest {
  date: string;
  topic: string;
  notes?: string;
}

export interface ClassSession {
  id: string;
  courseOfferingId: string;
  date: string;
  topic: string;
  notes: Record<string, unknown>;
  status: string;
}

export interface ClassSessionResponse {
  success: boolean;
  data: ClassSession;
  timestamp: string;
}

export interface AttendanceRecord {
  studentId: string;
  status: string;
  observation?: string;
}

export interface BulkAttendanceRequest {
  records: AttendanceRecord[];
}

export interface AttendanceRecordsResponse {
  success: boolean;
  data: AttendanceRecord[];
  timestamp: string;
}