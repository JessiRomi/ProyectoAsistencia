import { router } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { CourseOfferingCard } from "@/components/courses/CourseOfferingCard";
import { useTeacherCourses } from "@/features/courses/useTeacherCourses";
import { useSession } from "@/features/auth/useSession";

export default function TeacherHomeScreen() {
  const {
    courses,
    isLoading,
    error,
    reload,
  } = useTeacherCourses();

  const { logout } = useSession();

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  function handleProfile() {
    router.push("/teacher/profile");
  }

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator
          size="large"
          color="#4070B2"
        />

        <Text style={styles.loadingText}>
          Cargando tus cursadas...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>
          No se pudieron cargar las cursadas
        </Text>

        <Text style={styles.errorText}>
          {error}
        </Text>

        <Pressable
          style={styles.retryButton}
          onPress={reload}
        >
          <Text style={styles.retryButtonText}>
            Reintentar
          </Text>
        </Pressable>

        <Pressable
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>
            Cerrar sesión
          </Text>
        </Pressable>
      </View>
    );
  }

  if (courses.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyTitle}>
          No tenés cursadas asignadas
        </Text>

        <Text style={styles.emptyText}>
          No se encontraron cursadas para este profesor.
        </Text>

        <Pressable
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>
            Cerrar sesión
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={reload}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.headerText}>
                <Text style={styles.title}>
                  Mis cursadas
                </Text>

                <Text style={styles.subtitle}>
                  Seleccioná una cursada para continuar
                </Text>
              </View>

              <View style={styles.headerActions}>
                <Pressable
                  style={styles.profileButton}
                  onPress={handleProfile}
                >
                  <Text style={styles.profileButtonText}>
                    Perfil
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.logoutButton}
                  onPress={handleLogout}
                >
                  <Text style={styles.logoutButtonText}>
                    Salir
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <CourseOfferingCard
            course={item}
            onPress={() =>
              router.push({
                pathname: "/teacher/course",
                params: {
                  id: item.id,
                },
              })
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },

  listContent: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 35,
  },

  header: {
    marginBottom: 20,
  },

  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerText: {
    flex: 1,
    paddingRight: 12,
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1F2937",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#6B7280",
  },

  centerContainer: {
    flex: 1,
    backgroundColor: "#F4F7FB",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: "#6B7280",
  },

  errorTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#1F2937",
    textAlign: "center",
  },

  errorText: {
    marginTop: 8,
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },

  retryButton: {
    marginTop: 20,
    backgroundColor: "#4070B2",
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },

  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  emptyTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#1F2937",
    textAlign: "center",
  },

  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },

  profileButton: {
    backgroundColor: "#E8F0FA",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },

  profileButtonText: {
    color: "#4070B2",
    fontSize: 13,
    fontWeight: "700",
  },

  logoutButton: {
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },

  logoutButtonText: {
    color: "#374151",
    fontSize: 13,
    fontWeight: "700",
  },
});
