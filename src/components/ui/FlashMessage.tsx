import { useEffect } from "react";
import { StyleSheet, Text } from "react-native";

import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";

type FlashMessageProps = {
  message: string;
  onClear: () => void;
  durationMs?: number;
};

export function FlashMessage({ message, onClear, durationMs = 2200 }: FlashMessageProps) {
  useEffect(() => {
    if (!message) {
      return;
    }

    const timeout = setTimeout(onClear, durationMs);
    return () => clearTimeout(timeout);
  }, [message, onClear, durationMs]);

  if (!message) {
    return <Text accessibilityLiveRegion="polite" style={styles.placeholder} />;
  }

  return (
    <Text accessibilityLiveRegion="polite" style={styles.message}>
      {message}
    </Text>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    minHeight: 20,
    marginTop: spacing.md,
  },
  message: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
    minHeight: 20,
    marginTop: spacing.md,
  },
});
