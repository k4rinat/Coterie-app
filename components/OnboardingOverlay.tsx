import React, { useEffect, useRef } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView,
} from "react-native";
import AppModal from "@/components/AppModal";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { FONT, RADIUS } from "@/constants/Colors";

// ── Tour step data ─────────────────────────────────────────────────────────────

const STEPS = [
  {
    tabName: null, tabRoute: null, tabIcon: null,
    title: "Welcome to\nCoterie.",
    subtitle: "I\u2019m \u00c9loi, your private concierge.",
    body: "I\u2019ll take you through the app in under a minute. You can skip this tour anytime, or replay it later from Settings.",
  },
  {
    tabName: "Home", tabRoute: "/(app)", tabIcon: "home",
    title: "Home",
    subtitle: "Your personalised dashboard.",
    body: "Your Home screen shows daily activity \u2014 role matches, pending introductions, upcoming events, and the latest updates from your network.",
  },
  {
    tabName: "Roles", tabRoute: "/(app)/opportunities", tabIcon: "briefcase",
    title: "Roles",
    subtitle: "Curated opportunities, matched to you.",
    body: "Exclusive positions matched to your profile. New roles are added weekly and you\u2019ll be notified whenever a role fits your specialisms.",
  },
  {
    tabName: "Introductions", tabRoute: "/(app)/introductions", tabIcon: "users",
    title: "Introductions",
    subtitle: "Curated connections, personally facilitated.",
    body: "Accept or decline introductions, or request a new one. Provide a name, brand, and brief context \u2014 our team handles everything.",
  },
  {
    tabName: "Events", tabRoute: "/(app)/events", tabIcon: "calendar",
    title: "Events",
    subtitle: "Private gatherings for Coterie members.",
    body: "Coterie dinners, studio visits, brand presentations, and off-record conversations with creative leadership. Spots are strictly limited.",
  },
  {
    tabName: "Me", tabRoute: "/(app)/profile", tabIcon: "user",
    title: "Your Profile",
    subtitle: "Your Coterie identity.",
    body: "Your portfolio, credits, membership status, and settings. Manage language, notifications, and privacy under the Settings tab.",
  },
];

// ── Progress dots ──────────────────────────────────────────────────────────────

function Dots({ total, current, theme }: { total: number; current: number; theme: any }) {
  return (
    <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={{
            width: i === current ? 20 : 6,
            height: 5,
            borderRadius: 2.5,
            backgroundColor: i === current ? theme.text : theme.border,
          }}
        />
      ))}
    </View>
  );
}

// ── Overlay ────────────────────────────────────────────────────────────────────

export default function OnboardingOverlay() {
  const { isActive, step, totalSteps, nextStep, prevStep, endTour } = useOnboarding();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { completeOnboarding } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const fadeAnim  = useRef(new Animated.Value(1)).current;
  const cardSlide = useRef(new Animated.Value(400)).current;

  const isWelcome = step === 0;
  const isLast    = step === totalSteps - 1;
  const current   = STEPS[step];

  // Slide card in on first tab step, keep visible for subsequent steps
  useEffect(() => {
    if (!isActive) return;

    const route = STEPS[step].tabRoute;
    if (route) router.replace(route as any);

    if (step === 1) {
      // First tab step — animate card up from bottom
      cardSlide.setValue(400);
      Animated.spring(cardSlide, {
        toValue: 0,
        useNativeDriver: true,
        tension: 70,
        friction: 12,
      }).start();
    } else if (step > 1) {
      // Subsequent steps — card already visible, just fade content
      cardSlide.setValue(0);
    }

    // Fade in content on each step
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }).start();
  }, [step, isActive]);

  const animateThen = (callback: () => void) => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 130, useNativeDriver: true }).start(() => callback());
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isLast) handleFinish();
    else animateThen(() => nextStep());
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    animateThen(() => prevStep());
  };

  const handleFinish = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await completeOnboarding();
    endTour();
    router.replace("/(app)");
  };

  const handleSkip = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await completeOnboarding();
    endTour();
    router.replace("/(app)");
  };

  if (!isActive) return null;

  return (
    <AppModal
      visible={isActive}
      transparent={true}
      animationType="fade"
    >
      {isWelcome ? (

        // ── Full-screen welcome ────────────────────────────────────────────────
        <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.bg }]}>

          {/* Top bar: ÉLOI label + skip */}
          <View style={[s.topBar, { paddingTop: insets.top + 22 }]}>
            <View style={[s.eloiIdent, { flex: 1 }]}>
              <Text style={[s.eloiLabel, { color: theme.dim }]}>ÉLOI</Text>
              <View style={[s.eloiLine, { backgroundColor: theme.border }]} />
            </View>
            <TouchableOpacity
              onPress={handleSkip}
              activeOpacity={0.6}
              style={[s.skipPill, { backgroundColor: theme.fill, borderRadius: RADIUS.pill }]}
            >
              <Text style={[s.skipText, { color: theme.muted }]}>{t.skipTour}</Text>
            </TouchableOpacity>
          </View>

          {/* Welcome content */}
          <Animated.View style={[s.welcomeContent, { opacity: fadeAnim }]}>
            <Text style={[s.welcomeTitle, { color: theme.text }]}>{current.title}</Text>
            <Text style={[s.welcomeSub,   { color: theme.text }]}>{current.subtitle}</Text>
            <Text style={[s.welcomeBody,  { color: theme.muted }]}>{current.body}</Text>
          </Animated.View>

          {/* Bottom */}
          <View style={[s.welcomeBottom, { paddingBottom: insets.bottom + 40 }]}>
            <Dots total={totalSteps} current={step} theme={theme} />
            <TouchableOpacity
              onPress={handleNext}
              activeOpacity={0.8}
              style={[s.beginBtn, { backgroundColor: theme.invertBg, borderRadius: RADIUS.md }]}
            >
              <Text style={[s.beginText, { color: theme.invertText }]}>{t.beginTour}</Text>
              <Feather name="arrow-right" size={15} color={theme.invertText} />
            </TouchableOpacity>
          </View>
        </View>

      ) : (

        // ── Tab tour overlay + floating card ──────────────────────────────────
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">

          {/* Scrim — dims the tab behind */}
          <View
            style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0,0,0,0.38)" }]}
            pointerEvents="none"
          />

          {/* Floating card — max height so Next button always stays visible */}
          <Animated.View
            style={[
              s.card,
              {
                backgroundColor: theme.bg,
                paddingBottom: insets.bottom + 20,
                borderTopLeftRadius:  RADIUS.xl + 6,
                borderTopRightRadius: RADIUS.xl + 6,
                transform: [{ translateY: cardSlide }],
              },
            ]}
          >
            {/* Drag handle */}
            <View style={[s.handle, { backgroundColor: theme.border }]} />

            {/* Scrollable content area — prevents overflow cutting off Next btn */}
            <ScrollView
              style={{ maxHeight: 340 }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={s.cardInnerPad}
              scrollEnabled={false}
            >
              <Animated.View style={{ opacity: fadeAnim }}>

                {/* Tab label + skip */}
                <View style={s.cardTopRow}>
                  <View style={[s.tabPill, { backgroundColor: theme.fill, borderRadius: RADIUS.pill }]}>
                    <Feather name={current.tabIcon as any} size={11} color={theme.muted} />
                    <Text style={[s.tabPillText, { color: theme.muted }]}>{current.tabName}</Text>
                  </View>
                  <TouchableOpacity onPress={handleSkip} activeOpacity={0.6}>
                    <Text style={[s.skipLink, { color: theme.dim }]}>{t.skip}</Text>
                  </TouchableOpacity>
                </View>

                {/* Text */}
                <Text style={[s.cardTitle, { color: theme.text }]}>{current.title}</Text>
                <Text style={[s.cardSub,   { color: theme.muted }]}>{current.subtitle}</Text>
                <Text style={[s.cardBody,  { color: theme.muted }]}>{current.body}</Text>

                {/* Éloi sign-off on last step */}
                {isLast && (
                  <View style={[s.eloiSign, { backgroundColor: theme.surface, borderRadius: RADIUS.md }]}>
                    <Text style={[s.eloiSignText, { color: theme.muted }]}>
                      "You are all set. Ask me anything, I am always here."
                    </Text>
                    <Text style={[s.eloiSignName, { color: theme.dim }]}>{"\u2014 \u00c9loi"}</Text>
                  </View>
                )}
              </Animated.View>
            </ScrollView>

            {/* Nav row — always at the bottom of the card: [← back] [dots] [next →] */}
            <View style={s.cardNav}>
              {/* Back button or invisible placeholder to keep dots centred */}
              {step > 1 ? (
                <TouchableOpacity
                  onPress={handleBack}
                  activeOpacity={0.6}
                  style={[s.backBtn, { backgroundColor: theme.fill, borderRadius: RADIUS.md }]}
                >
                  <Feather name="arrow-left" size={15} color={theme.muted} />
                </TouchableOpacity>
              ) : (
                <View style={s.backBtnPlaceholder} />
              )}

              <Dots total={totalSteps} current={step} theme={theme} />

              <TouchableOpacity
                onPress={handleNext}
                activeOpacity={0.8}
                style={[s.nextBtn, { backgroundColor: theme.invertBg, borderRadius: RADIUS.md }]}
              >
                <Text style={[s.nextText, { color: theme.invertText }]}>
                  {isLast ? "Let\u2019s go" : "Next"}
                </Text>
                {!isLast && <Feather name="arrow-right" size={14} color={theme.invertText} />}
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}
    </AppModal>
  );
}

const s = StyleSheet.create({
  topBar:         { flexDirection: "row", alignItems: "center", paddingHorizontal: 28, gap: 16 },
  eloiIdent:      { flexDirection: "row", alignItems: "center", gap: 12 },
  eloiLabel:      { fontFamily: FONT.sansMedium, fontSize: 9, letterSpacing: 3 },
  eloiLine:       { flex: 1, height: StyleSheet.hairlineWidth },
  skipPill:       { paddingHorizontal: 14, paddingVertical: 8 },
  skipText:       { fontFamily: FONT.sansMedium, fontSize: 11, letterSpacing: 0.5 },
  welcomeContent: { flex: 1, paddingHorizontal: 36, justifyContent: "center", gap: 22 },
  welcomeTitle:   { fontFamily: FONT.serifLight, fontSize: 52, lineHeight: 56, letterSpacing: 0.2 },
  welcomeSub:     { fontFamily: FONT.serifLightItalic, fontSize: 18, lineHeight: 28, letterSpacing: 0.1 },
  welcomeBody:    { fontFamily: FONT.sansRegular, fontSize: 14, lineHeight: 24 },
  welcomeBottom:  { paddingHorizontal: 36, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  beginBtn:       { flexDirection: "row", gap: 8, paddingVertical: 16, paddingHorizontal: 28, alignItems: "center" },
  beginText:      { fontFamily: FONT.sansMedium, fontSize: 15 },
  // Floating card
  card:           { position: "absolute", left: 0, right: 0, bottom: 0, paddingHorizontal: 26 },
  handle:         { width: 36, height: 4, borderRadius: 2, alignSelf: "center", marginTop: 14, marginBottom: 18 },
  cardInnerPad:   { paddingBottom: 4 },
  cardTopRow:     { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  tabPill:        { flexDirection: "row", gap: 6, alignItems: "center", paddingHorizontal: 12, paddingVertical: 7 },
  tabPillText:    { fontFamily: FONT.sansMedium, fontSize: 10, letterSpacing: 1, textTransform: "uppercase" },
  skipLink:       { fontFamily: FONT.sansRegular, fontSize: 13 },
  cardTitle:      { fontFamily: FONT.serifLight, fontSize: 38, lineHeight: 42, letterSpacing: 0.2, marginBottom: 8 },
  cardSub:        { fontFamily: FONT.serifLightItalic, fontSize: 15, lineHeight: 22, letterSpacing: 0.1, marginBottom: 8 },
  cardBody:       { fontFamily: FONT.sansRegular, fontSize: 13, lineHeight: 21 },
  eloiSign:       { padding: 16, gap: 8, marginTop: 12 },
  eloiSignText:   { fontFamily: FONT.serifLight, fontSize: 15, lineHeight: 24, fontStyle: "italic", letterSpacing: 0.1 },
  eloiSignName:   { fontFamily: FONT.sansMedium, fontSize: 9, letterSpacing: 2, textTransform: "uppercase" },
  // Nav — three-column layout: [back] [dots] [next]
  cardNav:            { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 20, paddingTop: 4 },
  backBtn:            { width: 46, height: 46, alignItems: "center", justifyContent: "center" },
  backBtnPlaceholder: { width: 46, height: 46 },
  nextBtn:            { flexDirection: "row", gap: 8, paddingVertical: 13, paddingHorizontal: 22, alignItems: "center", justifyContent: "center" },
  nextText:           { fontFamily: FONT.sansMedium, fontSize: 14 },
});
