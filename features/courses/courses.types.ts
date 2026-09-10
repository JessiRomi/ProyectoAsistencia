export type CourseOffering = {
  id: string;

  commission: string;

  shift:
    | "MORNING"
    | "AFTERNOON"
    | "EVENING"
    | "VIRTUAL"
    | "MIXED";

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
};

export type EnrolledStudent = {
  id: string;
  firstName: string;
  lastName: string;
};
