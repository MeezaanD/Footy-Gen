import { StyleSheet, Text, View } from "react-native";

import { GlassCard } from "../ui/GlassCard";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";

type TeamResultCardProps = {
  name: string;
  players: string[];
};

export function TeamResultCard({ name, players }: TeamResultCardProps) {
  return (
    <GlassCard style={styles.card}>
      <Text style={styles.title}>{name}</Text>
      <View style={styles.players}>
        {players.map((player, index) => (
          <View key={`${name}-${player}-${index}`} style={styles.playerRow}>
            <Text style={styles.playerName}>{player}</Text>
          </View>
        ))}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  title: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "900",
    textTransform: "uppercase",
    marginBottom: spacing.md,
    letterSpacing: 0.5,
  },
  players: {
    gap: spacing.sm,
  },
  playerRow: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.cardSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  playerName: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "700",
  },
});
