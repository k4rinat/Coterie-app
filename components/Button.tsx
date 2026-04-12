import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/contexts/ThemeContext";
import { FONT, RADIUS } from "@/constants/Colors";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "ghost";
  size?: "sm" | "default";
  fullWidth?: boolean;
  style?: ViewStyle;
  disabled?: boolean;
}

export default function Button({ label, onPress, variant = "primary", size = "default", fullWidth = false, style, disabled = false }: ButtonProps) {
  const { theme } = useTheme();
  const isPrimary = variant === "primary";

  return (
    <TouchableOpacity
      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress(); }}
      activeOpacity={0.78}
      disabled={disabled}
      style={[
        styles.base,
        size === "sm" && styles.sm,
        {
          backgroundColor: isPrimary ? theme.invertBg : theme.fill,
          borderRadius: RADIUS.md,
          width: fullWidth ? "100%" : undefined,
          opacity: disabled ? 0.4 : 1,
        },
        style,
      ]}
    >
      <Text style={[styles.label, size === "sm" && styles.labelSm, { color: isPrimary ? theme.invertText : theme.muted }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: { paddingVertical: 15, paddingHorizontal: 24, alignItems: "center", justifyContent: "center" },
  sm:   { paddingVertical: 9,  paddingHorizontal: 16 },
  label:   { fontFamily: FONT.sansMedium, fontSize: 14, letterSpacing: 0.2 },
  labelSm: { fontSize: 12 },
});
