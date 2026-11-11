import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
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

import { AppButton } from "@/components/ui/AppButton";
import { AppCard } from "@/components/ui/AppCard";
import { useAppTheme } from "@/features/theme/theme.provider";
import { useAttendance } from "@/features/attendance/useAttendance";

export default function NewClassScreen() {
  const { colors } = useAppTheme();
  const params = useLocalSearchParams<{ id?: string | string[] }>();

  //Recupera el ID de la cursada recibida
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { createSession, isSaving, error, clearError } = useAttendance();

  //Inicializa los campos del formulario y establece la fecha actual por defecto
  const [date, setDate] = useState(getTodayDate());
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");

  //Valida los datos ingresados y solicitados al backend la creacion de una nueva clase
  async function handleCreateClass() {
    if (!id) {
      Alert.alert("Error", "No se recibió la cursada seleccionada.");
      return;
    }

    if (!date.trim()) {
      Alert.alert("Fecha requerida", "Ingresá la fecha de la clase.");
      return;
    }

    if (!topic.trim()) {
      Alert.alert("Tema requerido", "Ingresá el tema de la clase.");
      return;
    }

    try {
      clearError();
      //Envia la fecha, el tema y las observaciones para registar la nueva sesion
      const session = await createSession(id, {
        date: date.trim(),
        topic: topic.trim(),
        ...(notes.trim()
          ? {
              notes: notes.trim(),
            }
          : {}),
      });
      //Permite continuar generando un QR o resgistando la asistencia manual
      Alert.alert(
        "Clase creada",
        "La clase se creó correctamente. ¿Cómo querés continuar?",
        [
          {
            text: "Generar QR",
            onPress: () => {
              router.replace({
                pathname: "/teacher/session-qr",
                params: {
                  id: session.id,
                  courseOfferingId: id,
                },
              });
            },
          },
          {
            text: "Tomar asistencia manual",
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
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Volver"
            onPress={() => router.back()}
            disabled={isSaving}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.backButtonPressed,
            ]}
          >
            <Ionicons name="arrow-back" size={26} color={colors.text} />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={[styles.title, { color: colors.text }]}>
              Nueva clase
            </Text>

            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Registrá una nueva sesión para esta cursada.
            </Text>
          </View>
        </View>
        {/* FORMULARIO PARA REGISTRAR UNA NUEVA CLASE */}
        <AppCard style={styles.formCard}>
          <View style={styles.fieldHeader}>
            <View
              style={[
                styles.fieldIcon,
                { backgroundColor: `${colors.secondary}20` },
              ]}
            >
              <Ionicons
                name="calendar-outline"
                size={22}
                color={colors.secondary}
              />
            </View>

            <View style={styles.fieldTitleContainer}>
              <Text style={[styles.label, { color: colors.text }]}>
                Fecha de la clase
              </Text>
              <Text style={[styles.fieldHint, { color: colors.textSecondary }]}>
                Fecha en la que se realizará la sesión.
              </Text>
            </View>
          </View>

          <TextInput
            value={date}
            onChangeText={(value) => {
              clearError();
              setDate(value);
            }}
            placeholder="AAAA-MM-DD"
            placeholderTextColor={colors.textSecondary}
            style={[
              styles.input,
              {
                color: colors.text,
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
            editable={!isSaving}
            autoCapitalize="none"
            keyboardType="numbers-and-punctuation"
          />

          <Text style={[styles.helperText, { color: colors.textSecondary }]}>
            Formato: AAAA-MM-DD
          </Text>

          <View style={styles.fieldHeader}>
            <View
              style={[
                styles.fieldIcon,
                { backgroundColor: `${colors.accent}20` },
              ]}
            >
              <Ionicons name="book-outline" size={22} color={colors.accent} />
            </View>

            <View style={styles.fieldTitleContainer}>
              <Text style={[styles.label, { color: colors.text }]}>
                Tema de la clase
              </Text>
              <Text style={[styles.fieldHint, { color: colors.textSecondary }]}>
                Indicá el contenido que se desarrollará.
              </Text>
            </View>
          </View>

          <TextInput
            value={topic}
            onChangeText={(value) => {
              clearError();
              setTopic(value);
            }}
            placeholder="Ej. Introducción a React Native"
            placeholderTextColor={colors.textSecondary}
            style={[
              styles.input,
              {
                color: colors.text,
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
            editable={!isSaving}
            maxLength={120}
          />

          <View style={styles.fieldHeader}>
            <View
              style={[
                styles.fieldIcon,
                { backgroundColor: `${colors.success}20` },
              ]}
            >
              <Ionicons
                name="document-text-outline"
                size={22}
                color={colors.success}
              />
            </View>

            <View style={styles.fieldTitleContainer}>
              <Text style={[styles.label, { color: colors.text }]}>
                Observaciones
              </Text>
              <Text style={[styles.fieldHint, { color: colors.textSecondary }]}>
                Información adicional sobre la sesión.
              </Text>
            </View>

            <Text style={[styles.optional, { color: colors.textSecondary }]}>
              Opcional
            </Text>
          </View>

          <TextInput
            value={notes}
            onChangeText={(value) => {
              clearError();
              setNotes(value);
            }}
            placeholder="Observaciones de la clase..."
            placeholderTextColor={colors.textSecondary}
            style={[
              styles.input,
              styles.textArea,
              {
                color: colors.text,
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
            editable={!isSaving}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={300}
          />

          {error ? (
            <View
              style={[
                styles.errorContainer,
                {
                  backgroundColor: `${colors.error}15`,
                  borderColor: colors.error,
                },
              ]}
            >
              <Ionicons
                name="alert-circle-outline"
                size={21}
                color={colors.error}
              />

              <Text style={[styles.errorText, { color: colors.error }]}>
                {error}
              </Text>
            </View>
          ) : null}

          <View style={styles.buttonContainer}>
            <AppButton
              label="Crear clase"
              icon="add"
              onPress={handleCreateClass}
              variant="danger"
              size="large"
              fullWidth
              loading={isSaving}
              disabled={isSaving}
            />
          </View>
        </AppCard>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Obtiene la fecha actual en formato AAAA-MM-DD.
function getTodayDate(): string {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 28,
    gap: 16,
  },

  backButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  backButtonPressed: {
    opacity: 0.6,
  },

  headerText: {
    gap: 7,
  },

  title: {
    fontSize: 29,
    fontWeight: "900",
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "500",
  },

  formCard: {
    padding: 20,
  },

  fieldHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 13,
  },

  fieldIcon: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  fieldTitleContainer: {
    flex: 1,
    gap: 3,
  },

  label: {
    fontSize: 15,
    fontWeight: "800",
  },

  fieldHint: {
    fontSize: 12,
    lineHeight: 17,
  },

  optional: {
    fontSize: 11,
    fontWeight: "700",
  },

  input: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 0,
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 7,
  },

  helperText: {
    marginBottom: 27,
    fontSize: 12,
  },

  textArea: {
    minHeight: 115,
    paddingTop: 14,
    marginBottom: 20,
  },

  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderRadius: 0,
  },

  errorText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 19,
  },

  buttonContainer: {
    marginTop: 5,
  },
});
