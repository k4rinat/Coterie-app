import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { RADIUS, SHADOW } from "@/constants/Colors";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
  padding?: "none" | "sm" | "default" | "lg";
  shadow?: boolean;
}

export default function Card({ children, style, elevated = false, padding = "default", shadow = true }: CardProps) {
  const { theme, isDark } = useTheme();
  const pad = padding === "none" ? 0 : padding === "sm" ? 14 : padding === "lg" ? 24 : 18;
  return (
    <View
      style={[
        {
          backgroundColor: elevated ? theme.elevated : theme.surface,
          borderRadius: RADIUS.lg,
          padding: pad,
        },
        !isDark && shadow ? SHADOW.card : undefined,
        style,
      ]}
    >
      {children}
    </View>
  );
}
