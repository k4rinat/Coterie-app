import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { FONT } from "@/constants/Colors";

const WORDMARK_BLACK = require("@/assets/logo-wordmark.png");
const WORDMARK_WHITE = require("@/assets/logo-wordmark-white.png");

export default function SplashScreen() {
  const router   = useRouter();
  const { isLoggedIn, isLoading, isFirstLogin } = useAuth();
  const { theme, isDark } = useTheme();
  const wordmarkOp = useRef(new Animated.Value(0)).current;
  const taglineOp  = useRef(new Animated.Value(0)).current;
  const taglineY   = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(wordmarkOp, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(taglineOp, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(taglineY,  { toValue: 0, duration: 1000, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const t = setTimeout(() => {
      if (!isLoggedIn) {
        router.replace("/(auth)/sign-in");
      } else if (isFirstLogin) {
        router.replace("/(app)/onboarding");
      } else {
        router.replace("/(app)");
      }
    }, 3000);
    return () => clearTimeout(t);
  }, [isLoading, isLoggedIn, isFirstLogin]);

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      <View style={styles.center}>
        <Animated.Image
          source={isDark ? WORDMARK_WHITE : WORDMARK_BLACK}
          style={[styles.wordmark, { opacity: wordmarkOp }]}
          resizeMode="contain"
        />
        <Animated.Text
          style={[
            styles.tagline,
            { color: theme.muted, opacity: taglineOp, transform: [{ translateY: taglineY }] },
          ]}
        >
          Where Fashion Trusts Talent.
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, justifyContent: "center", alignItems: "center" },
  center:  { alignItems: "center" },
  wordmark: {
    width: 600,
    height: 168,
  },
  tagline: {
    fontFamily: FONT.sansRegular,
    fontSize: 13,
    letterSpacing: 0.3,
    textAlign: "center",
    marginTop: -50,
  },
});
