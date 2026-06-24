import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";

type PlayerInputProps = {
  value: string;
  onChange: (value: string) => void;
  onAdd: () => void;
};

export function PlayerInput({ value, onChange, onAdd }: PlayerInputProps) {
  return (
    <View style={styles.row}>
      <TextInput
        value={value}
        onChangeText={onChange}
        maxLength={30}
        placeholder="Enter player name..."
        placeholderTextColor={colors.muted}
        returnKeyType="done"
        onSubmitEditing={onAdd}
        style={styles.input}
      />
      <Pressable onPress={onAdd} style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
        <Text style={styles.addText}>Add</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.sm,
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: colors.cardSoft,
    color: colors.white,
    fontSize: 16,
    paddingHorizontal: spacing.lg,
  },
  addButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: colors.primary,
    minHeight: 52,
  },
  addText: {
    color: colors.primaryOnDark,
    fontSize: 16,
    fontWeight: "800",
  },
  pressed: {
    opacity: 0.85,
  },
});
