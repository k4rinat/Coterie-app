import React, { useState, useRef, useCallback } from "react";
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, Animated, PanResponder, RefreshControl, Dimensions,
} from "react-native";
import AppModal from "@/components/AppModal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { FONT, RADIUS, SHADOW } from "@/constants/Colors";
import Card from "@/components/Card";
import Label from "@/components/Label";
import Divider from "@/components/Divider";
import Button from "@/components/Button";

const { width: W } = Dimensions.get("window");
const THRESHOLD = W * 0.30;

// ── Data ──────────────────────────────────────────────────────────────────────

interface Introduction {
  id: string;
  direction: "incoming" | "outgoing";
  person: string;
  title: string;
  brand: string;
  tier: string;
  via?: string;
  message?: string;
  msgIndex?: number;
  status: "pending" | "accepted" | "declined";
  date: string;
}

const PENDING_SEED: Introduction[] = [
  {
    id: "p1", direction: "incoming", person: "Sofia Andreou",
    title: "Head of Talent", brand: "Loewe", tier: "Elite", via: "Marcus Webb",
    msgIndex: 0, status: "pending", date: "2m ago",
  },
  {
    id: "p2", direction: "incoming", person: "James Harrington",
    title: "Creative Director", brand: "Burberry", tier: "Professional",
    msgIndex: 1, status: "pending", date: "5h ago",
  },
  {
    id: "p3", direction: "incoming", person: "Claire Beaumont",
    title: "Casting Director", brand: "Valentino", tier: "Elite", via: "Isabelle Laurent",
    msgIndex: 2, status: "pending", date: "1d ago",
  },
];

const HISTORY_SEED: Introduction[] = [
  { id: "h1", direction: "outgoing", person: "Clara Fontaine",   title: "Casting Director", brand: "Valentino",    tier: "Elite",        status: "accepted", date: "3 days ago" },
  { id: "h2", direction: "incoming", person: "Laurent Dubois",   title: "Fashion Director", brand: "L'Officiel",  tier: "Professional", status: "declined", date: "1 week ago" },
  { id: "h3", direction: "outgoing", person: "Mia Nakamura",     title: "Art Director",     brand: "Dazed",       tier: "Elite",        status: "accepted", date: "2 weeks ago" },
  { id: "h4", direction: "outgoing", person: "Thomas Bauer",     title: "Brand Consultant", brand: "Acne Studios", tier: "Professional", status: "pending", date: "3 weeks ago" },
];

// ── Swipe Card ────────────────────────────────────────────────────────────────

function SwipeCard({ intro, isTop, stackIndex, onAccept, onDecline }: {
  intro: Introduction;
  isTop: boolean;
  stackIndex: number;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}) {
  const { theme, isDark } = useTheme();
  const { t } = useLanguage();
  const pos = useRef(new Animated.ValueXY()).current;

  // Ref mirror so PanResponder closure always reads latest isTop
  const isTopRef = useRef(isTop);
  React.useEffect(() => { isTopRef.current = isTop; }, [isTop]);

  const rotate   = pos.x.interpolate({ inputRange: [-W, 0, W], outputRange: ["-12deg", "0deg", "12deg"], extrapolate: "clamp" });
  const acceptOp = pos.x.interpolate({ inputRange: [0, THRESHOLD * 0.5], outputRange: [0, 1], extrapolate: "clamp" });
  const declineOp = pos.x.interpolate({ inputRange: [-THRESHOLD * 0.5, 0], outputRange: [1, 0], extrapolate: "clamp" });

  // Stack visual offset for cards behind the top
  const behindY     = stackIndex * 10;
  const behindScale = 1 - stackIndex * 0.04;

  const pan = useRef(PanResponder.create({
    // Immediately claim touch so no parent can steal it
    onStartShouldSetPanResponder: () => isTopRef.current,
    onStartShouldSetPanResponderCapture: () => isTopRef.current,
    onMoveShouldSetPanResponder: (_, g) => isTopRef.current && Math.abs(g.dx) > 3,
    onMoveShouldSetPanResponderCapture: (_, g) =>
      isTopRef.current && Math.abs(g.dx) > Math.abs(g.dy) * 0.8,
    // Never relinquish the gesture once claimed
    onPanResponderTerminationRequest: () => false,
    onPanResponderMove: (_, g) => {
      if (isTopRef.current) {
        pos.setValue({ x: g.dx, y: g.dy * 0.08 });
      }
    },
    onPanResponderRelease: (_, g) => {
      if (!isTopRef.current) return;
      const swipedRight = g.dx > THRESHOLD || (g.vx > 0.7 && g.dx > 30);
      const swipedLeft  = g.dx < -THRESHOLD || (g.vx < -0.7 && g.dx < -30);
      if (swipedRight) {
        Animated.spring(pos, { toValue: { x: W * 1.5, y: 0 }, useNativeDriver: true, tension: 50, friction: 8 }).start(() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          onAccept(intro.id);
        });
      } else if (swipedLeft) {
        Animated.spring(pos, { toValue: { x: -W * 1.5, y: 0 }, useNativeDriver: true, tension: 50, friction: 8 }).start(() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          onDecline(intro.id);
        });
      } else {
        Animated.spring(pos, { toValue: { x: 0, y: 0 }, useNativeDriver: true, tension: 70, friction: 10 }).start();
      }
    },
    onPanResponderTerminate: () => {
      // Snap back if somehow stolen
      Animated.spring(pos, { toValue: { x: 0, y: 0 }, useNativeDriver: true, tension: 70, friction: 10 }).start();
    },
  })).current;

  if (!isTop) {
    // Background card — show stacked visual only
    return (
      <Animated.View
        style={[
          sw.card,
          { backgroundColor: theme.surface, borderRadius: RADIUS.xl },
          !isDark && SHADOW.card,
          { transform: [{ translateY: behindY }, { scale: behindScale }], opacity: 0.7 },
        ]}
        pointerEvents="none"
      />
    );
  }

  return (
    <Animated.View
      style={[
        sw.card,
        { backgroundColor: theme.surface, borderRadius: RADIUS.xl },
        !isDark && SHADOW.card,
        { transform: [{ translateX: pos.x }, { translateY: pos.y }, { rotate }] },
      ]}
      {...pan.panHandlers}
    >
      {/* Accept hint */}
      <Animated.View style={[sw.hint, { opacity: acceptOp }]}>
        <Text style={[sw.hintText, { color: theme.text }]}>{t.accept}</Text>
        <Feather name="check" size={18} color={theme.text} />
      </Animated.View>

      {/* Decline hint */}
      <Animated.View style={[sw.hint, sw.hintLeft, { opacity: declineOp }]}>
        <Feather name="x" size={18} color={theme.text} />
        <Text style={[sw.hintText, { color: theme.text }]}>{t.decline}</Text>
      </Animated.View>

      {/* Content */}
      <View style={sw.content}>
        <View style={[sw.tierPill, { backgroundColor: theme.fill, borderRadius: RADIUS.pill }]}>
          <Text style={[sw.tierText, { color: theme.muted }]}>{intro.tier} {t.memberLabel}</Text>
        </View>
        <Text style={[sw.name, { color: theme.text }]}>{intro.person}</Text>
        <Text style={[sw.role, { color: theme.muted }]}>{intro.title}, {intro.brand}</Text>
        {intro.via && <Text style={[sw.via, { color: theme.dim }]}>{t.viaLabel} {intro.via}</Text>}
        {intro.msgIndex !== undefined && t.introMessages[intro.msgIndex] && (
          <>
            <Divider style={{ marginVertical: 16 }} />
            <Text style={[sw.message, { color: theme.muted }]}>{t.introMessages[intro.msgIndex]}</Text>
          </>
        )}
      </View>

      {/* Action buttons */}
      <View style={[sw.buttons, { borderTopColor: theme.border }]}>
        <TouchableOpacity
          onPress={() => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); onDecline(intro.id); }}
          style={sw.declineBtn} activeOpacity={0.7}
        >
          <Feather name="x" size={15} color={theme.muted} />
          <Text style={[sw.declineText, { color: theme.muted }]}>{t.decline}</Text>
        </TouchableOpacity>
        <View style={[sw.btnDivider, { backgroundColor: theme.border }]} />
        <TouchableOpacity
          onPress={() => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); onAccept(intro.id); }}
          style={[sw.acceptBtn, { backgroundColor: theme.invertBg }]} activeOpacity={0.7}
        >
          <Feather name="check" size={15} color={theme.invertText} />
          <Text style={[sw.acceptText, { color: theme.invertText }]}>{t.accept}</Text>
        </TouchableOpacity>
      </View>

      <Text style={[sw.cardDate, { color: theme.dim }]}>{intro.date}</Text>
    </Animated.View>
  );
}

const sw = StyleSheet.create({
  card: { position: "absolute", width: "100%", overflow: "hidden" },
  content: { padding: 24, gap: 6 },
  tierPill: { paddingHorizontal: 12, paddingVertical: 6, alignSelf: "flex-start", marginBottom: 10 },
  tierText: { fontFamily: FONT.sansMedium, fontSize: 8, letterSpacing: 1.5, textTransform: "uppercase" },
  name: { fontFamily: FONT.serifLight, fontSize: 40, letterSpacing: 0.3, lineHeight: 44 },
  role: { fontFamily: FONT.sansRegular, fontSize: 13, lineHeight: 19 },
  via: { fontFamily: FONT.sansRegular, fontSize: 10, letterSpacing: 0.3, marginTop: 2 },
  message: { fontFamily: FONT.sansRegular, fontSize: 12, lineHeight: 20 },
  buttons: { flexDirection: "row", borderTopWidth: StyleSheet.hairlineWidth },
  declineBtn: { flex: 1, flexDirection: "row", gap: 6, justifyContent: "center", alignItems: "center", paddingVertical: 16 },
  declineText: { fontFamily: FONT.sansMedium, fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase" },
  btnDivider: { width: StyleSheet.hairlineWidth },
  acceptBtn: { flex: 1, flexDirection: "row", gap: 6, justifyContent: "center", alignItems: "center", paddingVertical: 16 },
  acceptText: { fontFamily: FONT.sansMedium, fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase" },
  cardDate: { fontFamily: FONT.sansRegular, fontSize: 9, textAlign: "center", paddingVertical: 10 },
  hint: {
    position: "absolute", top: 0, bottom: 0, right: 0, left: 0,
    justifyContent: "center", alignItems: "flex-end", flexDirection: "row",
    gap: 8, paddingRight: 28, paddingBottom: 80, zIndex: 10,
  },
  hintLeft: { alignItems: "flex-start", paddingLeft: 28, paddingRight: 0 },
  hintText: { fontFamily: FONT.sansMedium, fontSize: 11, letterSpacing: 2, textTransform: "uppercase" },
});

// ── Request Modal ─────────────────────────────────────────────────────────────

function RequestModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleClose = () => { setName(""); setBrand(""); setMessage(""); setSent(false); onClose(); };

  return (
    <AppModal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <View style={[rm.root, { backgroundColor: theme.bg }]}>
        <View style={rm.header}>
          <View style={[rm.handle, { backgroundColor: theme.border }]} />
          <TouchableOpacity onPress={handleClose} style={rm.closeBtn} activeOpacity={0.6}>
            <View style={[rm.closeCircle, { backgroundColor: theme.fill }]}>
              <Feather name="x" size={14} color={theme.muted} />
            </View>
          </TouchableOpacity>
        </View>
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={rm.content}>
            {sent ? (
              <View style={rm.sentBlock}>
                <Text style={[rm.sentIcon, { color: theme.text }]}>✦</Text>
                <Text style={[rm.sentHeading, { color: theme.text }]}>{t.requestSent}</Text>
                <Text style={[rm.sentSub, { color: theme.muted }]}>
                  {t.introSentDesc}
                </Text>
                <Button label={t.done} onPress={handleClose} fullWidth style={{ marginTop: 16 }} />
              </View>
            ) : (
              <>
                <Label>{t.requestAnIntro}</Label>
                <Text style={[rm.heading, { color: theme.text }]}>{"Who would you\nlike to meet?"}</Text>
                <View style={rm.fields}>
                  {[
                    { label: t.theirName,           value: name,  set: setName,  placeholder: t.fullNamePlaceholder },
                    { label: t.brandOrOrganisation, value: brand, set: setBrand, placeholder: "e.g. Bottega Veneta" },
                  ].map((f) => (
                    <View key={f.label} style={rm.field}>
                      <Label>{f.label}</Label>
                      <TextInput
                        style={[rm.input, { color: theme.text, backgroundColor: theme.surface, borderRadius: RADIUS.md }]}
                        value={f.value} onChangeText={f.set}
                        placeholder={f.placeholder} placeholderTextColor={theme.dim}
                        selectionColor={theme.text}
                      />
                    </View>
                  ))}
                  <View style={rm.field}>
                    <Label>{t.contextOrPurpose}</Label>
                    <TextInput
                      style={[rm.input, rm.textarea, { color: theme.text, backgroundColor: theme.surface, borderRadius: RADIUS.md }]}
                      value={message} onChangeText={setMessage}
                      placeholder={t.brieflyExplain}
                      placeholderTextColor={theme.dim}
                      multiline selectionColor={theme.text} textAlignVertical="top"
                    />
                  </View>
                </View>
                <Text style={[rm.disclaimer, { color: theme.dim }]}>
                  {t.introFacilitatedDesc}
                </Text>
                <View style={rm.actions}>
                  <Button label={t.cancel} variant="ghost" onPress={handleClose} style={{ flex: 1 }} />
                  <Button label={t.send} onPress={() => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); setSent(true); }} style={{ flex: 1 }} />
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </View>
    </AppModal>
  );
}

const rm = StyleSheet.create({
  root: { flex: 1 },
  header: { alignItems: "center", paddingTop: 14, paddingBottom: 12, paddingHorizontal: 20, position: "relative" },
  handle: { width: 36, height: 4, borderRadius: 2 },
  closeBtn: { position: "absolute", right: 20, top: 10, padding: 4 },
  closeCircle: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  content: { padding: 28, gap: 20 },
  heading: { fontFamily: FONT.serifLight, fontSize: 38, lineHeight: 44, letterSpacing: 0.3 },
  fields: { gap: 18 },
  field: { gap: 8 },
  input: { fontFamily: FONT.sansRegular, fontSize: 13, paddingHorizontal: 14, paddingVertical: 14 },
  textarea: { minHeight: 90, paddingTop: 14 },
  disclaimer: { fontFamily: FONT.sansRegular, fontSize: 10, lineHeight: 16, letterSpacing: 0.2 },
  actions: { flexDirection: "row", gap: 10 },
  sentBlock: { alignItems: "center", gap: 14, paddingVertical: 40 },
  sentIcon: { fontSize: 30 },
  sentHeading: { fontFamily: FONT.serifLight, fontSize: 32, letterSpacing: 0.3 },
  sentSub: { fontFamily: FONT.sansRegular, fontSize: 13, lineHeight: 20, textAlign: "center", maxWidth: 280 },
});

// ── Main Screen ───────────────────────────────────────────────────────────────

export default function IntroductionsScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t, fc } = useLanguage();

  const [pending, setPending]         = useState(PENDING_SEED);
  const [history, setHistory]         = useState(HISTORY_SEED);
  const [showRequest, setShowRequest] = useState(false);
  const [refreshing, setRefreshing]   = useState(false);
  const [allSwiped, setAllSwiped]     = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleAccept = (id: string) => {
    const item = pending.find((p) => p.id === id);
    if (item) {
      const next = pending.filter((x) => x.id !== id);
      setPending(next);
      setHistory((h) => [{ ...item, id: `done-${id}-${Date.now()}`, status: "accepted", date: "Just now" }, ...h]);
      if (next.length === 0) setAllSwiped(true);
    }
  };

  const handleDecline = (id: string) => {
    const item = pending.find((p) => p.id === id);
    if (item) {
      const next = pending.filter((x) => x.id !== id);
      setPending(next);
      setHistory((h) => [{ ...item, id: `done-${id}-${Date.now()}`, status: "declined", date: "Just now" }, ...h]);
      if (next.length === 0) setAllSwiped(true);
    }
  };

  const statusLabel = (s: string) => s === "accepted" ? t.statusAccepted : s === "declined" ? t.statusDeclined : t.statusPending;

  const reversedPending = [...pending].reverse();

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      {/*
        Single ScrollView wraps everything so the whole page scrolls.
        The swipe card stack uses a fixed height View — PanResponder captures
        horizontal swipes while the ScrollView handles vertical scrolling.
      */}
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.muted} />}
        contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}
      >
        {/* ── Header ── */}
        <View style={[styles.topHeader, { paddingTop: insets.top + 20 }]}>
          <View style={styles.headerRow}>
            <View>
              <Label>{t.yourNetwork}</Label>
              <Text style={[styles.heading, { color: theme.text, fontFamily: fc.serifFamily, fontSize: fc.hs(48), lineHeight: fc.hl(fc.hs(48)) }]}>{t.introductions}</Text>
            </View>
            <TouchableOpacity
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setShowRequest(true); }}
              style={[styles.requestBtn, { backgroundColor: theme.fill, borderRadius: RADIUS.pill }]}
              activeOpacity={0.7}
            >
              <Feather name="plus" size={12} color={theme.muted} />
              <Text style={[styles.requestBtnText, { color: theme.muted }]}>{t.requestIntro}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Swipe section ── */}
        {pending.length > 0 ? (
          <View style={styles.swipeSection}>
            <View style={styles.sectionHead}>
              <Label bright>{t.pending}</Label>
              <View style={[styles.badge, { backgroundColor: theme.fill, borderRadius: RADIUS.pill }]}>
                <Text style={[styles.badgeText, { color: theme.muted }]}>{pending.length}</Text>
              </View>
            </View>
            <Text style={[styles.swipeHint, { color: theme.dim }]}>
              {t.swipeHint}
            </Text>
            {/* Fixed-height container — absolute children stack inside */}
            <View style={styles.cardStack}>
              {reversedPending.map((intro, idx, arr) => (
                <SwipeCard
                  key={intro.id}
                  intro={intro}
                  isTop={idx === arr.length - 1}
                  stackIndex={arr.length - 1 - idx}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                />
              ))}
            </View>
          </View>
        ) : allSwiped ? (
          <View style={[styles.endOfStack, { backgroundColor: theme.surface, borderRadius: RADIUS.lg, marginHorizontal: 20, marginTop: 16 }]}>
            <Text style={[styles.endIcon, { color: theme.muted }]}>✦</Text>
            <Text style={[styles.endHeading, { color: theme.text }]}>{t.thatAllForNow}</Text>
            <Text style={[styles.endBody, { color: theme.muted }]}>
              {t.reviewedAllDesc}
            </Text>
            <TouchableOpacity
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setShowRequest(true); }}
              style={[styles.requestBtnAlt, { backgroundColor: theme.fill, borderRadius: RADIUS.md }]}
              activeOpacity={0.7}
            >
              <Text style={[styles.requestBtnAltText, { color: theme.muted }]}>{t.requestAnIntro}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.emptyPending, { marginHorizontal: 20, marginTop: 16 }]}>
            <Text style={[styles.emptyIcon, { color: theme.muted }]}>◯</Text>
            <Text style={[styles.emptyHeading, { color: theme.muted }]}>{t.allCaughtUp}</Text>
            <Text style={[styles.emptyBody, { color: theme.dim }]}>
              {t.noPendingDesc}
            </Text>
          </View>
        )}

        <Divider style={{ marginTop: 16, marginBottom: 4 }} />

        {/* ── History — plain View inside the page ScrollView, no nesting ── */}
        <View style={styles.historyContainer}>
          <Label bright>{t.history}</Label>
          <Card>
            {history.map((item, idx) => (
              <View key={item.id}>
                {idx > 0 && <Divider />}
                <View style={styles.historyItem}>
                  <View style={{ flex: 1, gap: 3 }}>
                    <View style={styles.historyDir}>
                      <Feather
                        name={item.direction === "incoming" ? "arrow-down-left" : "arrow-up-right"}
                        size={10} color={theme.muted} style={{ opacity: 0.4 }}
                      />
                      <Text style={[styles.historyDirText, { color: theme.dim }]}>
                        {item.direction === "incoming" ? t.received : t.sent}
                      </Text>
                    </View>
                    <Text style={[styles.historyName, { color: theme.text }]}>{item.person}</Text>
                    <Text style={[styles.historyRole, { color: theme.muted }]}>{item.title}, {item.brand}</Text>
                  </View>
                  <View style={styles.historyRight}>
                    <View style={[styles.statusPill, {
                      backgroundColor: theme.fill,
                      borderRadius: RADIUS.pill,
                      opacity: item.status === "pending" ? 0.5 : 1,
                    }]}>
                      <Text style={[styles.statusText, { color: theme.muted }]}>{statusLabel(item.status)}</Text>
                    </View>
                    <Text style={[styles.historyDate, { color: theme.dim }]}>{item.date}</Text>
                  </View>
                </View>
              </View>
            ))}
          </Card>
        </View>
      </ScrollView>

      <RequestModal visible={showRequest} onClose={() => setShowRequest(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topHeader: { paddingHorizontal: 20, paddingBottom: 16 },
  headerRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  heading: { lineHeight: 56, letterSpacing: 0.5, marginTop: 8 },
  requestBtn: { flexDirection: "row", gap: 6, alignItems: "center", paddingHorizontal: 16, paddingVertical: 10, marginTop: 14 },
  requestBtnText: { fontFamily: FONT.sansMedium, fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase" },
  swipeSection: { paddingHorizontal: 20, gap: 14, paddingBottom: 8 },
  sectionHead: { flexDirection: "row", alignItems: "center", gap: 10 },
  badge: { paddingHorizontal: 9, paddingVertical: 4 },
  badgeText: { fontFamily: FONT.sansMedium, fontSize: 9, letterSpacing: 1 },
  swipeHint: { fontFamily: FONT.sansRegular, fontSize: 10, letterSpacing: 0.5, textAlign: "center" },
  // Fixed height so absolute-positioned cards don't affect page flow
  cardStack: { position: "relative", height: 380 },
  endOfStack: { padding: 28, alignItems: "center", gap: 12 },
  endIcon: { fontSize: 28, opacity: 0.4 },
  endHeading: { fontFamily: FONT.serifLight, fontSize: 26, letterSpacing: 0.3 },
  endBody: { fontFamily: FONT.sansRegular, fontSize: 13, lineHeight: 20, textAlign: "center", maxWidth: 280 },
  requestBtnAlt: { paddingHorizontal: 20, paddingVertical: 13, marginTop: 8 },
  requestBtnAltText: { fontFamily: FONT.sansMedium, fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase" },
  emptyPending: { alignItems: "center", paddingVertical: 32, gap: 10 },
  emptyIcon: { fontSize: 28, opacity: 0.3 },
  emptyHeading: { fontFamily: FONT.serifLight, fontSize: 26, letterSpacing: 0.3 },
  emptyBody: { fontFamily: FONT.sansRegular, fontSize: 12, lineHeight: 19, textAlign: "center", maxWidth: 280 },
  historyContainer: { paddingHorizontal: 20, paddingTop: 20, gap: 14 },
  historyItem: { flexDirection: "row", alignItems: "flex-start", paddingVertical: 14, gap: 12 },
  historyDir: { flexDirection: "row", alignItems: "center", gap: 5 },
  historyDirText: { fontFamily: FONT.sansMedium, fontSize: 8, letterSpacing: 1.5, textTransform: "uppercase" },
  historyName: { fontFamily: FONT.serifLight, fontSize: 20, letterSpacing: 0.2 },
  historyRole: { fontFamily: FONT.sansRegular, fontSize: 11, lineHeight: 16, marginTop: 2 },
  historyRight: { alignItems: "flex-end", gap: 6 },
  statusPill: { paddingHorizontal: 10, paddingVertical: 5 },
  statusText: { fontFamily: FONT.sansMedium, fontSize: 8, letterSpacing: 1.5, textTransform: "uppercase" },
  historyDate: { fontFamily: FONT.sansRegular, fontSize: 9, letterSpacing: 0.3 },
});
