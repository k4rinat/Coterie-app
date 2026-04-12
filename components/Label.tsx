import React from "react";
import { Text, StyleSheet, TextStyle } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { FONT } from "@/constants/Colors";

export default function Label({ children, bright = false, style }: { children: React.ReactNode; bright?: boolean; style?: TextStyle }) {
  const { theme } = useTheme();
  return <Text style={[styles.label, { color: bright ? theme.text : theme.muted }, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  label: { fontFamily: FONT.sansMedium, fontSize: 11, letterSpacing: 0.5, textTransform: "uppercase" },
});
