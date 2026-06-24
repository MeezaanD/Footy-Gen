import { Alert, StyleSheet, Text, View } from "react-native";

import { GlassCard } from "../components/ui/GlassCard";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { ScreenContainer } from "../components/ui/ScreenContainer";
import { clearAllSessions } from "../storage/sessions";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";

const APP_VERSION = "2.0.0";

export function SettingsScreen() {
  const confirmClearHistory = () => {
    Alert.alert("Clear all history?", "This will permanently delete all saved sessions.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear all",
        style: "destructive",
        onPress: () => {
          void clearAllSessions();
        },
      },
    ]);
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={typography.title}>Settings</Text>
      </View>

      <GlassCard>
        <Text style={styles.appName}>NextUp</Text>
        <Text style={styles.version}>Version {APP_VERSION}</Text>
        <Text style={styles.about}>
          A simple team generator for soccer and padel. Everything stays on your device — no
          accounts, no cloud sync.
        </Text>
      </GlassCard>

      <GlassCard>
        <Text style={styles.sectionTitle}>Visual identity</Text>
        <View style={styles.swatchRow}>
          <View style={[styles.swatch, { backgroundColor: colors.background }]} />
          <View style={[styles.swatch, { backgroundColor: colors.primary }]} />
          <View style={[styles.swatch, { backgroundColor: colors.white }]} />
        </View>
        <Text style={styles.themeText}>
          Black backgrounds, neon yellow accents, and glass-style cards for a sporty premium feel.
        </Text>
      </GlassCard>

      <GlassCard>
        <Text style={styles.sectionTitle}>Data</Text>
        <Text style={styles.about}>
          Team generations are saved locally on your device using AsyncStorage.
        </Text>
        <View style={styles.button}>
          <PrimaryButton label="Clear All History" variant="danger" onPress={confirmClearHistory} />
        </View>
      </GlassCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.sm,
  },
  appName: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: "900",
    marginBottom: spacing.xs,
  },
  version: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: spacing.md,
  },
  about: {
    ...typography.body,
  },
  sectionTitle: {
    ...typography.subheading,
    marginBottom: spacing.md,
  },
  swatchRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  themeText: {
    ...typography.body,
  },
  button: {
    marginTop: spacing.lg,
  },
});
