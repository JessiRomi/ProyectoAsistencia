import { apiClient } from "@/lib/api/api.client";

import type {
  AttendanceRecord,
  BulkAttendancePayload,
  ClassSession,
  CreateClassSessionPayload,
} from "./attendance.types";

export async function createClassSession(
  courseOfferingId: string,
  payload: CreateClassSessionPayload,
): Promise<ClassSession> {
  const response = await apiClient<{
    success: boolean;
    data: ClassSession;
    timestamp: string;
  }>(`/course-offerings/${courseOfferingId}/class-sessions`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function getCourseSessions(
  courseOfferingId: string,
): Promise<ClassSession[]> {
  const response = await apiClient<{
    success: boolean;
    data: ClassSession[];
    timestamp: string;
  }>(`/course-offerings/${courseOfferingId}/class-sessions`, {
    method: "GET",
  });

  return response.data;
}

export async function getSessionAttendance(
  sessionId: string,
): Promise<AttendanceRecord[]> {
  const response = await apiClient<{
    success: boolean;
    data: AttendanceRecord[];
    timestamp: string;
  }>(`/class-sessions/${sessionId}/attendance`, {
    method: "GET",
  });

  return response.data;
}

export async function saveBulkAttendance(
  sessionId: string,
  payload: BulkAttendancePayload,
): Promise<void> {
  await apiClient<{
    success: boolean;
    data: unknown;
    timestamp: string;
  }>(`/class-sessions/${sessionId}/attendance/bulk`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function closeClassSession(
  sessionId: string,
): Promise<void> {
  await apiClient<{
    success: boolean;
    data: unknown;
    timestamp: string;
  }>(`/class-sessions/${sessionId}/close`, {
    method: "PATCH",
  });
}