import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import LogoutButton from "@/components/logout-button";

export default function TeacherHomeScreen() {
  function openCourse() {
    router.push("/teacher/course");
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>¡Bienvenido!</Text>
            <Text style={styles.subtitle}>Espacio docente</Text>
          </View>

          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>ITS</Text>
          </View>
        </View>

        <LogoutButton />

        <Text style={styles.sectionTitle}>Mis cursadas</Text>

        <Pressable
          style={({ pressed }) => [
            styles.courseCard,
            pressed && styles.courseCardPressed,
          ]}
          onPress={openCourse}
        >
          <View style={styles.courseIcon}>
            <Ionicons
              name="book-outline"
              size={28}
              color="#FFFFFF"
            />
          </View>

          <View style={styles.courseContent}>
            <Text style={styles.courseName}>
              Aplicaciones Móviles
            </Text>

            <Text style={styles.courseCode}>AMOV</Text>

            <View style={styles.courseDetails}>
              <Text style={styles.detailText}>Comisión A</Text>
              <Text style={styles.detailText}>EVENING</Text>
            </View>

            <Text style={styles.scheduleText}>
              Martes · 19:00 - 22:00
            </Text>

            <Text style={styles.classroomText}>
              Aula: Lab 2
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={24}
            color="#9CA3AF"
          />
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 30,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  headerContent: {
    flex: 1,
  },

  greeting: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1F2937",
  },

  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    marginTop: 5,
  },

  logoContainer: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#4070B2",
    alignItems: "center",
    justifyContent: "center",
  },

  logoText: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "900",
    letterSpacing: 1,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#1F2937",
    marginTop: 30,
    marginBottom: 15,
  },

  courseCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  courseCardPressed: {
    opacity: 0.8,
  },

  courseIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: "#4070B2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  courseContent: {
    flex: 1,
  },

  courseName: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1F2937",
  },

  courseCode: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 3,
  },

  courseDetails: {
    flexDirection: "row",
    gap: 12,
    marginTop: 9,
  },

  detailText: {
    fontSize: 13,
    color: "#4070B2",
    fontWeight: "600",
  },

  scheduleText: {
    fontSize: 13,
    color: "#374151",
    marginTop: 6,
  },

  classroomText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 3,
  },
});
