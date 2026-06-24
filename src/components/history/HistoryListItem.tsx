import { Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronRight, Trash2 } from "lucide-react-native";

import { GlassCard } from "../ui/GlassCard";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { GeneratedSession } from "../../types/session";
import { getSessionDisplayName } from "../../utils/generateTeams";

type HistoryListItemProps = {
  session: GeneratedSession;
  onView: () => void;
  onDelete: () => void;
};

function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function HistoryListItem({ session, onView, onDelete }: HistoryListItemProps) {
  const sportLabel = session.sport === "soccer" ? "⚽" : "🎾";

  return (
    <GlassCard style={styles.card}>
      <View style={styles.inner}>
        <Pressable onPress={onView} style={styles.main}>
          <View style={styles.topRow}>
            <Text style={styles.sport}>{sportLabel}</Text>
            <Text style={styles.date}>{formatDate(session.createdAt)}</Text>
          </View>
          <Text style={styles.title}>{getSessionDisplayName(session)}</Text>
          <Text style={styles.meta}>
            {session.formatLabel} · {session.playerCount} players
          </Text>
          <View style={styles.viewRow}>
            <Text style={styles.viewText}>View details</Text>
            <ChevronRight size={16} color={colors.primary} />
          </View>
        </Pressable>
        <Pressable onPress={onDelete} style={styles.deleteButton} accessibilityLabel="Delete session">
          <Trash2 size={18} color="#FF8888" />
        </Pressable>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  inner: {
    position: "relative",
  },
  main: {
    flex: 1,
    gap: spacing.xs,
    paddingRight: spacing.xxxl,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sport: {
    fontSize: 18,
  },
  date: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "600",
  },
  title: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "800",
    marginTop: spacing.xs,
  },
  meta: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "600",
  },
  viewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  viewText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  deleteButton: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: spacing.sm,
    borderRadius: 12,
    backgroundColor: colors.dangerSoft,
  },
});
