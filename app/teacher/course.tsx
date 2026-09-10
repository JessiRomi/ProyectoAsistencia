import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function TeacherCourseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  function openAttendance() {
    router.push("/teacher/attendance");
  }

  function openStudents() {
    router.push({
      pathname: "/teacher/course-students",
      params: {
        id: id ?? "temporary-aplicaciones-moviles",
      },
    });
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          style={styles.backRow}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color="#4070B2"
          />

          <Text style={styles.backText}>
            Mis cursadas
          </Text>
        </Pressable>

        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons
              name="book-outline"
              size={32}
              color="#FFFFFF"
            />
          </View>

          <View style={styles.headerContent}>
            <Text style={styles.title}>
              Aplicaciones Móviles
            </Text>

            <Text style={styles.code}>
              AMOV
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Información de la cursada
          </Text>

          <InfoRow
            icon="people-outline"
            label="Comisión"
            value="A"
          />

          <InfoRow
            icon="time-outline"
            label="Turno"
            value="EVENING"
          />

          <InfoRow
            icon="calendar-outline"
            label="Día"
            value="Martes"
          />

          <InfoRow
            icon="time-outline"
            label="Horario"
            value="19:00 - 22:00"
          />

          <InfoRow
            icon="location-outline"
            label="Aula"
            value="Lab 2"
          />

          <InfoRow
            icon="people-circle-outline"
            label="Capacidad"
            value="40 estudiantes"
            last
          />
        </View>

        <Text style={styles.actionsTitle}>
          Gestión de la cursada
        </Text>

        {/* Ver estudiantes */}
        <Pressable
          style={({ pressed }) => [
            styles.actionCard,
            pressed && styles.actionCardPressed,
          ]}
          onPress={openStudents}
        >
          <View style={styles.actionIcon}>
            <Ionicons
              name="people-outline"
              size={27}
              color="#FFFFFF"
            />
          </View>

          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>
              Ver estudiantes
            </Text>

            <Text style={styles.actionDescription}>
              Consultar los alumnos inscriptos en esta cursada.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={22}
            color="#9CA3AF"
          />
        </Pressable>

        {/* Tomar asistencia */}
        <Pressable
          style={({ pressed }) => [
            styles.actionCard,
            pressed && styles.actionCardPressed,
          ]}
          onPress={openAttendance}
        >
          <View style={styles.actionIcon}>
            <Ionicons
              name="checkmark-done-outline"
              size={27}
              color="#FFFFFF"
            />
          </View>

          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>
              Tomar asistencia
            </Text>

            <Text style={styles.actionDescription}>
              Ver alumnos y registrar presente o ausente.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={22}
            color="#9CA3AF"
          />
        </Pressable>
      </ScrollView>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
  last = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View
      style={[
        styles.infoRow,
        !last && styles.infoRowBorder,
      ]}
    >
      <Ionicons
        name={icon}
        size={21}
        color="#4070B2"
      />

      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>
          {label}
        </Text>

        <Text style={styles.infoValue}>
          {value}
        </Text>
      </View>
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
    paddingTop: 25,
    paddingBottom: 35,
  },

  backRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 22,
  },

  backText: {
    color: "#4070B2",
    fontSize: 14,
    fontWeight: "700",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },

  headerIcon: {
    width: 62,
    height: 62,
    borderRadius: 18,
    backgroundColor: "#4070B2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },

  headerContent: {
    flex: 1,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1F2937",
  },

  code: {
    marginTop: 4,
    fontSize: 13,
    color: "#6B7280",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingTop: 18,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 4,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },

  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#EEF1F5",
  },

  infoContent: {
    flex: 1,
    marginLeft: 13,
  },

  infoLabel: {
    fontSize: 12,
    color: "#9CA3AF",
  },

  infoValue: {
    marginTop: 2,
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
  },

  actionsTitle: {
    marginTop: 28,
    marginBottom: 14,
    fontSize: 19,
    fontWeight: "800",
    color: "#1F2937",
  },

  actionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 7,
  },

  actionCardPressed: {
    opacity: 0.8,
  },

  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#4070B2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  actionContent: {
    flex: 1,
  },

  actionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },

  actionDescription: {
    marginTop: 3,
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 17,
  },
});
