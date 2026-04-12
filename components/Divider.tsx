import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

export default function Divider({ style, vertical = false }: { style?: ViewStyle; vertical?: boolean }) {
  const { theme } = useTheme();
  return <View style={[vertical ? styles.v : styles.h, { backgroundColor: theme.border }, style]} />;
}

const styles = StyleSheet.create({
  h: { width: "100%", height: StyleSheet.hairlineWidth },
  v: { height: "100%", width: StyleSheet.hairlineWidth },
});
