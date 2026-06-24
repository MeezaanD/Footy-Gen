import { TextStyle } from "react-native";

import { colors } from "./colors";

export const typography = {
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: colors.white,
    letterSpacing: -0.5,
  } satisfies TextStyle,
  heading: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.white,
  } satisfies TextStyle,
  subheading: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.white,
  } satisfies TextStyle,
  body: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.muted,
    lineHeight: 22,
  } satisfies TextStyle,
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  } satisfies TextStyle,
  caption: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.muted,
  } satisfies TextStyle,
} as const;
