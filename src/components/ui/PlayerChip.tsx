import { Pressable, StyleSheet, Text, View } from "react-native";
import { X } from "lucide-react-native";

import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";

type PlayerChipProps = {
  name: string;
  onRemove: () => void;
};

export function PlayerChip({ name, onRemove }: PlayerChipProps) {
  return (
    <View style={styles.chip}>
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>
      <Pressable
        onPress={onRemove}
        hitSlop={8}
        style={({ pressed }) => [styles.remove, pressed && styles.pressed]}
        accessibilityLabel={`Remove ${name}`}
      >
        <X size={14} color={colors.muted} strokeWidth={2.5} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.borderYellow,
    backgroundColor: colors.cardSoft,
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
    paddingVertical: spacing.sm,
    maxWidth: "100%",
  },
  name: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
    flexShrink: 1,
  },
  remove: {
    alignItems: "center",
    justifyContent: "center",
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  pressed: {
    opacity: 0.7,
  },
});
