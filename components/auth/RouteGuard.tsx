import { Redirect, type Href } from "expo-router";
import type { ReactNode } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { useSession } from "@/features/auth/useSession";
import type { UserRole } from "@/features/auth/auth.types";

interface RouteGuardProps {
  children: ReactNode;
  allowedRoles: readonly UserRole[];
}

export function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
  const { user, loading } = useSession();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4070B2" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href={"/login" as Href} />;
  }

  if (!allowedRoles.includes(user.role)) {
    const destination: Href = user.role === "TEACHER" ? "/teacher" : "/(tabs)";

    return <Redirect href={destination} />;
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F4F7FB",
  },
});
