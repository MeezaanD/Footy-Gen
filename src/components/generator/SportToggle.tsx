import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { Sport } from "../../types/session";

type SportToggleProps = {
  sport: Sport;
  onChange: (sport: Sport) => void;
};

const OPTIONS: { value: Sport; label: string }[] = [
  { value: "soccer", label: "Soccer" },
  { value: "padel", label: "Padel" },
];

export function SportToggle({ sport, onChange }: SportToggleProps) {
  return (
    <View style={styles.container}>
      {OPTIONS.map((option) => {
        const active = sport === option.value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[styles.option, active && styles.optionActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.xs,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  option: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingVertical: spacing.md,
  },
  optionActive: {
    backgroundColor: colors.primary,
  },
  label: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: "800",
  },
  labelActive: {
    color: colors.primaryOnDark,
  },
});
