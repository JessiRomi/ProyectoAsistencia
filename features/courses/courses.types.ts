export type CourseScheduleSlot = {
  id: string;
  courseOfferingId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  classroom: string | null;
};

export type CourseOffering = {
  id: string;

  subjectId: string;

  academicYearId: string;

  teacherId: string;

  commission: string;

  shift:
  | "MORNING"
  | "AFTERNOON"
  | "EVENING"
  | "VIRTUAL"
  | "MIXED";

  dayOfWeek: number;

  startTime: string;

  endTime: string;

  classroom: string | null;

  maxCapacity: number;

  subject: {
    id: string;
    name: string;
    code: string;
  };

  academicYear: {
    id: string;
    year: number;
    name: string;
  };

  scheduleSlots: CourseScheduleSlot[];

  _count?: {
    enrollments: number;
    classSessions: number;
    evaluations: number;
  };
};

export type EnrolledStudent = {
  id: string;

  userId?: string;

  firstName: string;

  lastName: string;

  documentNumber?: string;

  studentNumber?: string;

  phone?: string | null;

  email?: string;

  photoUrl?: string | null;

  birthDate?: string | null;

  isActive?: boolean;

  createdAt?: string;

  updatedAt?: string;

  deletedAt?: string | null;
};

export type StudentEnrollment = {
  id: string;
  courseOfferingId: string;
  studentId: string;
  status: "ACTIVE" | "DROPPED" | "COMPLETED" | string;
  resultStatus?: string | null;
  finalGrade?: number | null;
  enrolledAt?: string;
  courseOffering: {
    id: string;
    commission: string;
    shift: CourseOffering["shift"];
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    classroom: string | null;
    subject: {
      id: string;
      name: string;
      code: string;
      year?: number;
      semester?: number;
    };
    academicYear: {
      id: string;
      year: number;
      name: string;
    };
    teacher?: {
      firstName: string;
      lastName: string;
    } | null;
  };
};
