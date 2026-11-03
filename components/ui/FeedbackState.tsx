import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { AppButton } from "@/components/ui/AppButton";
import { useAppTheme } from "@/features/theme/theme.provider";

type Props = {
  type: "loading" | "error" | "empty";
  message: string;
  onRetry?: () => void;
};

export function FeedbackState({ type, message, onRetry }: Props) {
  const { colors } = useAppTheme();

  if (type === "loading") {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.message, { color: colors.textSecondary }]}>
          {message}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.message, { color: colors.textSecondary }]}>
        {message}
      </Text>

      {type === "error" && onRetry && (
        <View style={styles.retryButton}>
          <AppButton
            label="Reintentar"
            onPress={onRetry}
            variant="secondary"
            size="medium"
          />
        </View>
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
  },
  retryButton: {
    marginTop: 16,
  },
});
