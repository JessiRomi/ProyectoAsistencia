import { Stack } from "expo-router";

import { RouteGuard } from "@/components/auth/RouteGuard";

export default function TeacherLayout() {
  return (
    <RouteGuard allowedRoles={["TEACHER"]}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />

        <Stack.Screen name="course" />

        <Stack.Screen name="course-students" />

        <Stack.Screen name="attendance" />

        <Stack.Screen name="course-sessions" />

        <Stack.Screen name="session-attendance" />
      </Stack>
    </RouteGuard>
  );
}
