import { Stack } from "expo-router";

export default function TeacherLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
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
    </Stack>
  );
}