import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  type: "loading" | "error" | "empty";
  message: string;
  onRetry?: () => void;
};

export function FeedbackState({
  type,
  message,
  onRetry,
}: Props) {
  if (type === "loading") {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.message}>{message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>

      {type === "error" && onRetry && (
        <Pressable
          style={styles.retryButton}
          onPress={onRetry}
        >
          <Text style={styles.retryText}>
            Reintentar
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  message: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 15,
    color: "#6B7280",
  },

  retryButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#E8F0FB",
  },

  retryText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4070B2",
  },
});
