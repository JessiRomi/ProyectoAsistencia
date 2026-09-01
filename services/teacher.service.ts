import { apiClient } from "./api-client";

import type {
  TeacherCourseOffering,
  TeacherCourseOfferingsResponse,
  TeacherCourseOfferingResponse,
  TeacherStudent,
  TeacherStudentsResponse,
  CreateClassSessionRequest,
  ClassSessionResponse,
  BulkAttendanceRequest,
  AttendanceRecordsResponse,
} from "../types/teacher";

export const teacherService = {
  async getCourseOfferings(): Promise<TeacherCourseOffering[]> {
    const response =
      await apiClient<TeacherCourseOfferingsResponse>(
        "/teachers/me/course-offerings",
        {
          method: "GET",
        }
      );

    console.log(
      "RESPUESTA CURSADAS DEL PROFESOR:",
      response
    );

    return response.data;
  },

  async getCourseOffering(
    offeringId: string
  ): Promise<TeacherCourseOffering> {
    const response =
      await apiClient<TeacherCourseOfferingResponse>(
        `/teachers/me/course-offerings/${offeringId}`,
        {
          method: "GET",
        }
      );

    return response.data;
  },

  async getStudents(
    offeringId: string
  ): Promise<TeacherStudent[]> {
    const response =
      await apiClient<TeacherStudentsResponse>(
        `/course-offerings/${offeringId}/students`,
        {
          method: "GET",
        }
      );

    return response.data;
  },

  async createClassSession(
    offeringId: string,
    data: CreateClassSessionRequest
  ) {
    const response =
      await apiClient<ClassSessionResponse>(
        `/course-offerings/${offeringId}/class-sessions`,
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      );

    return response.data;
  },

  async markAttendanceBulk(
    sessionId: string,
    data: BulkAttendanceRequest
  ) {
    const response =
      await apiClient<AttendanceRecordsResponse>(
        `/class-sessions/${sessionId}/attendance/bulk`,
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      );

    return response.data;
  },
};
