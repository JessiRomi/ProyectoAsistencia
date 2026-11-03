import { Tabs } from "expo-router";

import { RouteGuard } from "@/components/auth/RouteGuard";

export default function TabLayout() {
  return (
    <RouteGuard allowedRoles={["STUDENT"]}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            display: "none",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Inicio",
          }}
        />
      </Tabs>
    </RouteGuard>
  );
}
