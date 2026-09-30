import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useAttendance } from "@/features/attendance/useAttendance";

export default function NewClassScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    createSession,
    isSaving,
    error,
    clearError,
  } = useAttendance();

  const [date, setDate] = useState(
    getTodayDate(),
  );

  const [topic, setTopic] = useState("");

  const [notes, setNotes] = useState("");

  async function handleCreateClass() {
    if (!id) {
      Alert.alert(
        "Error",
        "No se recibió la cursada seleccionada.",
      );
      return;
    }

    if (!date.trim()) {
      Alert.alert(
        "Fecha requerida",
        "Ingresá la fecha de la clase.",
      );
      return;
    }

    if (!topic.trim()) {
      Alert.alert(
        "Tema requerido",
        "Ingresá el tema de la clase.",
      );
      return;
    }

    try {
      clearError();

      const session = await createSession(
        id,
        {
          date: date.trim(),
          topic: topic.trim(),
          ...(notes.trim()
            ? {
                notes: notes.trim(),
              }
            : {}),
        },
      );

      Alert.alert(
        "Clase creada",
        "La clase se creó correctamente.",
        [
          {
            text: "Tomar asistencia",
            onPress: () => {
              router.replace({
                pathname: "/teacher/attendance",
                params: {
                  id,
                  sessionId: session.id,
                },
              });
            },
          },
        ],
      );
    } catch {
      // El error ya es gestionado por useAttendance.
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={
          styles.scrollContent
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Encabezado */}
        <View style={styles.header}>
          <Pressable
            style={styles.backRow}
            onPress={() => router.back()}
            disabled={isSaving}
          >
            <Text style={styles.backIcon}>
              ‹
            </Text>

            <Text style={styles.backText}>
              Volver
            </Text>
          </Pressable>

          <Text style={styles.title}>
            Nueva clase
          </Text>

          <Text style={styles.subtitle}>
            Registrá una nueva sesión para esta
            cursada.
          </Text>
        </View>

        {/* Formulario */}
        <View style={styles.card}>
          <Text style={styles.label}>
            Fecha
          </Text>

          <TextInput
            value={date}
            onChangeText={(value) => {
              clearError();
              setDate(value);
            }}
            placeholder="AAAA-MM-DD"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            editable={!isSaving}
            autoCapitalize="none"
            keyboardType="numbers-and-punctuation"
          />

          <Text style={styles.helperText}>
            Formato: AAAA-MM-DD
          </Text>

          <Text style={styles.label}>
            Tema de la clase
          </Text>

          <TextInput
            value={topic}
            onChangeText={(value) => {
              clearError();
              setTopic(value);
            }}
            placeholder="Ej. Introducción a React Native"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            editable={!isSaving}
            maxLength={120}
          />

          <Text style={styles.label}>
            Observaciones
            <Text style={styles.optional}>
              {" "}
              (opcional)
            </Text>
          </Text>

          <TextInput
            value={notes}
            onChangeText={(value) => {
              clearError();
              setNotes(value);
            }}
            placeholder="Observaciones de la clase..."
            placeholderTextColor="#9CA3AF"
            style={[
              styles.input,
              styles.textArea,
            ]}
            editable={!isSaving}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={300}
          />

          {/* Error */}
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                {error}
              </Text>
            </View>
          ) : null}

          {/* Crear */}
          <Pressable
            style={[
              styles.createButton,
              isSaving &&
                styles.createButtonDisabled,
            ]}
            onPress={handleCreateClass}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator
                color="#FFFFFF"
              />
            ) : (
              <Text
                style={styles.createButtonText}
              >
                Crear clase
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function getTodayDate(): string {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(
    today.getMonth() + 1,
  ).padStart(2, "0");
  const day = String(
    today.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 25,
  },

  backRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  backIcon: {
    fontSize: 35,
    lineHeight: 30,
    color: "#4070B2",
    marginRight: 8,
  },

  backText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4070B2",
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1F2937",
  },

  subtitle: {
    marginTop: 7,
    fontSize: 14,
    lineHeight: 20,
    color: "#6B7280",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
  },

  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
  },

  optional: {
    fontWeight: "400",
    color: "#9CA3AF",
  },

  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: "#D9E0E8",
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#1F2937",
    backgroundColor: "#FAFBFC",
    marginBottom: 6,
  },

  helperText: {
    marginBottom: 22,
    fontSize: 12,
    color: "#9CA3AF",
  },

  textArea: {
    minHeight: 105,
    paddingTop: 13,
    marginBottom: 18,
  },

  errorContainer: {
    marginBottom: 15,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#FEE2E2",
  },

  errorText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#991B1B",
    textAlign: "center",
  },

  createButton: {
    minHeight: 52,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4070B2",
  },

  createButtonDisabled: {
    opacity: 0.7,
  },

  createButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});