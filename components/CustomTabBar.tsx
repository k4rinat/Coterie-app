import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { FONT } from "@/constants/Colors";

const TAB_META: { name: string; icon: keyof typeof Feather.glyphMap; key: "home" | "roles" | "introductions" | "events" | "profile" }[] = [
  { name: "index",         icon: "home",       key: "home"          },
  { name: "opportunities", icon: "briefcase",  key: "roles"         },
  { name: "introductions", icon: "users",      key: "introductions" },
  { name: "events",        icon: "calendar",   key: "events"        },
  { name: "profile",       icon: "user",       key: "profile"       },
];

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const { t } = useLanguage();

  const content = (
    <View style={[styles.inner, { paddingBottom: insets.bottom || 10, borderTopColor: theme.border }]}>
      {TAB_META.map((tab, index) => {
        const focused = state.index === index;
        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => {
              if (!focused) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.navigate(tab.name);
              }
            }}
            activeOpacity={0.6}
            style={styles.tab}
          >
            <Feather name={tab.icon} size={22} color={focused ? theme.iconActive : theme.icon} />
            <Text style={[styles.label, { color: focused ? theme.iconActive : theme.icon }]}>
              {t[tab.key]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  if (Platform.OS === "ios") {
    return (
      <BlurView
        intensity={90}
        tint={isDark ? "dark" : "light"}
        style={styles.blur}
      >
        {content}
      </BlurView>
    );
  }

  // Android fallback
  return (
    <View style={[styles.blur, { backgroundColor: theme.surface }]}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  blur: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  inner: {
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  label: {
    fontFamily: FONT.sansRegular,
    fontSize: 10,
    letterSpacing: 0.1,
  },
});
