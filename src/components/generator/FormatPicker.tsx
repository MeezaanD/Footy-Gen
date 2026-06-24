import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { FormatOption } from "../../utils/formatOptions";

type FormatPickerProps = {
  formats: FormatOption[];
  selectedPlayerCount: number;
  onSelect: (playerCount: number) => void;
};

export function FormatPicker({ formats, selectedPlayerCount, onSelect }: FormatPickerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Format</Text>
      <View style={styles.grid}>
        {formats.map((format) => {
          const active = selectedPlayerCount === format.playerCount;
          return (
            <Pressable
              key={format.playerCount}
              onPress={() => onSelect(format.playerCount)}
              style={[styles.option, active && styles.optionActive]}
            >
              <Text style={[styles.optionText, active && styles.optionTextActive]}>{format.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  label: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  option: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.cardSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minWidth: "47%",
    flexGrow: 1,
  },
  optionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  optionText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
  optionTextActive: {
    color: colors.primaryOnDark,
  },
});
