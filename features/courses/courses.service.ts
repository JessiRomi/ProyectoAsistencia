import { apiClient } from "@/lib/api/api.client";

import type {
  CourseOffering,
  EnrolledStudent,
} from "./courses.types";

export async function getMyCourseOfferings(): Promise<CourseOffering[]> {
  const response = await apiClient<{
    success: boolean;
    data: CourseOffering[];
    timestamp: string;
  }>("/teachers/me/course-offerings", {
    method: "GET",
  });

  return response.data;
}

export async function getCourseStudents(
  courseOfferingId: string,
): Promise<EnrolledStudent[]> {
  const response = await apiClient<{
    success: boolean;
    data: EnrolledStudent[];
    timestamp: string;
  }>(`/course-offerings/${courseOfferingId}/students`, {
    method: "GET",
  });

  return response.data;
}
