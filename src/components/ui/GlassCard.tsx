import { BlurView } from "expo-blur";
import { ReactNode } from "react";
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";

type GlassCardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
};

export function GlassCard({ children, style, intensity = 30 }: GlassCardProps) {
  if (Platform.OS === "ios") {
    return (
      <View style={[styles.wrapper, style]}>
        <BlurView intensity={intensity} tint="dark" style={styles.blur}>
          {children}
        </BlurView>
      </View>
    );
  }

  return <View style={[styles.wrapper, styles.androidFallback, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  blur: {
    padding: spacing.lg,
    backgroundColor: "rgba(17, 17, 17, 0.6)",
  },
  androidFallback: {
    padding: spacing.lg,
    backgroundColor: colors.glass,
  },
});
