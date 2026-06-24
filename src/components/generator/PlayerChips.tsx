import { Pressable, StyleSheet, Text, View } from "react-native";

import { PlayerChip } from "../ui/PlayerChip";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";

type PlayerChipsProps = {
  players: string[];
  onRemove: (index: number) => void;
  onClearAll: () => void;
};

export function PlayerChips({ players, onRemove, onClearAll }: PlayerChipsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Players ({players.length})</Text>
        {players.length > 0 && (
          <Pressable onPress={onClearAll} hitSlop={8}>
            <Text style={styles.clear}>Clear all</Text>
          </Pressable>
        )}
      </View>

      {players.length === 0 ? (
        <Text style={styles.empty}>No players added yet.</Text>
      ) : (
        <View style={styles.chips}>
          {players.map((player, index) => (
            <PlayerChip key={`${player}-${index}`} name={player} onRemove={() => onRemove(index)} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "800",
  },
  clear: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  empty: {
    color: colors.muted,
    fontSize: 14,
    textAlign: "center",
    paddingVertical: spacing.xl,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
});
