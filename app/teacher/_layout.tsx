import { Stack } from "expo-router";

export default function TeacherLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerBackTitle: "Atrás",
        headerStyle: {
          backgroundColor: "#4070B2",
        },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: {
          fontWeight: "700",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Espacio docente",
        }}
      />

      <Stack.Screen
        name="course"
        options={{
          title: "Cursada",
        }}
      />

      <Stack.Screen
        name="course-students"
        options={{
          title: "Estudiantes",
        }}
      />

      <Stack.Screen
        name="attendance"
        options={{
          title: "Tomar asistencia",
        }}
      />

      <Stack.Screen
        name="course-sessions"
        options={{
          title: "Historial de clases",
        }}
      />

      <Stack.Screen
        name="session-attendance"
        options={{
          title: "Detalle de asistencia",
        }}
      />
    </Stack>
  );
}
