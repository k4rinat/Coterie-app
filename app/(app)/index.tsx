import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl, Animated, FlatList,
} from "react-native";
import AppModal from "@/components/AppModal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { FONT, RADIUS, SHADOW } from "@/constants/Colors";
import Card from "@/components/Card";
import Label from "@/components/Label";
import Divider from "@/components/Divider";
import Button from "@/components/Button";

// ── Daily Quotes ──────────────────────────────────────────────────────────────

const QUOTES = [
  { text: "Fashion is not something that exists in dresses only. Fashion is in the sky, in the street.", author: "Coco Chanel" },
  { text: "Elegance is not about being noticed, it's about being remembered.", author: "Giorgio Armani" },
  { text: "Over the years I have learned that what is important in a dress is the woman who is wearing it.", author: "Yves Saint Laurent" },
  { text: "I don't do fashion, I am fashion.", author: "Coco Chanel" },
  { text: "Clothing is ultimately the suit of armour in which we do battle with the world.", author: "Donatella Versace" },
  { text: "Fashion is the armour to survive the reality of everyday life.", author: "Bill Blass" },
  { text: "Style is wearing an evening gown to McDonald's, looking terrific and being perfectly at ease.", author: "Karl Lagerfeld" },
  { text: "The secret of great style is to feel good in what you wear.", author: "Inès de la Fressange" },
  { text: "What you wear is how you present yourself to the world, especially today, when human contacts are so quick.", author: "Miuccia Prada" },
  { text: "Luxury must be comfortable, otherwise it is not luxury.", author: "Coco Chanel" },
  { text: "Fashion is what you're offered four times a year by designers. And style is what you choose.", author: "Lauren Hutton" },
  { text: "Create your own style. Let it be unique for yourself and yet identifiable for others.", author: "Anna Wintour" },
  { text: "Fashion is about dressing according to what is fashionable. Style is more about being yourself.", author: "Oscar de la Renta" },
  { text: "People will stare. Make it worth their while.", author: "Harry Winston" },
  { text: "Fashion should be a form of escapism, and not a form of imprisonment.", author: "Alexander McQueen" },
  { text: "You can have anything you want in life if you dress for it.", author: "Edith Head" },
  { text: "Trendy is the last stage before tacky.", author: "Karl Lagerfeld" },
  { text: "Clothes mean nothing until someone lives in them.", author: "Marc Jacobs" },
  { text: "I want people to be afraid of the women I dress.", author: "Alexander McQueen" },
  { text: "Dressing is a way of life.", author: "Yves Saint Laurent" },
  { text: "In difficult times, fashion is always outrageous.", author: "Elsa Schiaparelli" },
  { text: "Fashion is the most powerful art there is. It's movement, design and architecture all in one.", author: "Alexander McQueen" },
];

function getDailyQuote() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return QUOTES[dayOfYear % QUOTES.length];
}


// ── Data ──────────────────────────────────────────────────────────────────────

const FEED = [
  { id: "feed-1", icon: "users",        text: "Marcus Webb wants to introduce you to Head of Talent at Loewe.", time: "2m ago",    unread: true,  route: "/(app)/introductions" },
  { id: "feed-2", icon: "briefcase",    text: "New role: Senior Stylist, London — matches your profile.",         time: "1h ago",   unread: true,  route: "/(app)/opportunities" },
  { id: "feed-3", icon: "calendar",     text: "Private dinner with Hermès creative leadership — 14 spots remaining.", time: "3h ago", unread: false, route: "/(app)/events"        },
  { id: "feed-4", icon: "check-circle", text: "Your Elite verification badge has been approved.",                  time: "Yesterday", unread: false, route: "/(app)/profile"       },
  { id: "feed-5", icon: "users",        text: "Introduction accepted by Casting Director at Valentino.",           time: "2 days ago", unread: false, route: "/(app)/introductions" },
];
// Map feed item id → translation index (stable, items never reordered)
const FEED_IDX: Record<string, number> = Object.fromEntries(FEED.map((f, i) => [f.id, i]));

const INVITATIONS = [
  { id: "inv-1", name: "Sofia Andreou",    role: "Head of Talent",    brand: "Loewe",    tier: "Elite",        via: "Marcus Webb" },
  { id: "inv-2", name: "James Harrington", role: "Creative Director", brand: "Burberry", tier: "Professional", via: undefined    },
];

interface MatchedRole {
  id: string; title: string; brand: string; location: string; type: string;
  bookmarked: boolean; description: string; fee?: string; deadline?: string;
  requirements: string[]; category: string; discipline: string; posted: string; applicants: number;
}

const MATCHED_ROLES: MatchedRole[] = [
  {
    id: "mr-1", title: "Senior Stylist", brand: "Burberry", location: "London, UK", type: "Freelance",
    bookmarked: false, category: "Brand", discipline: "Styling", posted: "5d ago", applicants: 17,
    description: "Collaborate directly with the creative director on campaign and digital content for the Burberry mainline and Brit collections.",
    requirements: ["Established portfolio across luxury brand and campaign styling", "Experience with UK and international market shoots", "Availability for London and New York seasons"],
    fee: "£800 – £1,100/day",
  },
  {
    id: "mr-2", title: "Fashion Director", brand: "Vogue UK", location: "London, UK", type: "Full-Time",
    bookmarked: true, category: "Editorial", discipline: "Styling", posted: "2d ago", applicants: 14,
    description: "Lead the visual narrative for one of fashion's most iconic publications. Oversee a team of stylists, photographers, and art directors to shape seasonal editorial content that defines culture.",
    requirements: ["10+ years editorial experience at a major publication", "Strong network within the UK and European fashion circuit", "Experience directing shoots with budgets exceeding £200k"],
    fee: "£120,000 – £160,000 p.a.", deadline: "30 April 2026",
  },
  {
    id: "mr-3", title: "Art Director", brand: "Another Magazine", location: "London, UK", type: "Full-Time",
    bookmarked: false, category: "Editorial", discipline: "Art Direction", posted: "1w ago", applicants: 18,
    description: "Shape the visual language of a landmark independent fashion publication.",
    requirements: ["Strong portfolio across editorial and luxury brand work", "Experience with print and digital publication design", "Background in photography direction strongly preferred"],
    fee: "£70,000 – £90,000 p.a.", deadline: "1 May 2026",
  },
];

// ── Role Detail Modal ─────────────────────────────────────────────────────────

function RoleDetailModal({ role, onClose, onBookmark }: {
  role: MatchedRole | null; onClose: () => void; onBookmark: (id: string) => void;
}) {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const [expressed, setExpressed] = useState(false);
  React.useEffect(() => { if (role) setExpressed(false); }, [role?.id]);

  return (
    <AppModal visible={!!role} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      {role && (
        <View style={[rd.root, { backgroundColor: theme.bg }]}>
          <View style={rd.header}>
            <View style={[rd.handle, { backgroundColor: theme.border }]} />
            <TouchableOpacity onPress={onClose} style={rd.closeBtn} activeOpacity={0.6}>
              <View style={[rd.closeCircle, { backgroundColor: theme.fill }]}>
                <Feather name="x" size={14} color={theme.muted} />
              </View>
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[rd.content, { paddingBottom: insets.bottom + 32 }]}>
            <View style={rd.titleRow}>
              <View style={{ flex: 1 }}>
                <Label>{role.category} · {role.type}</Label>
                <Text style={[rd.title, { color: theme.text }]}>{role.title}</Text>
                <Text style={[rd.brand, { color: theme.muted }]}>{role.brand}</Text>
              </View>
              <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onBookmark(role.id); }} activeOpacity={0.6} style={rd.bookmarkBtn}>
                <Feather name="bookmark" size={18} color={role.bookmarked ? theme.text : theme.muted} style={{ opacity: role.bookmarked ? 1 : 0.35 }} />
              </TouchableOpacity>
            </View>
            <View style={rd.pills}>
              {[role.location, role.discipline, `${role.applicants} applicants`].map((p, i) => (
                <View key={i} style={[rd.pill, { backgroundColor: theme.fill, borderRadius: RADIUS.pill }]}>
                  <Text style={[rd.pillText, { color: theme.muted }]}>{p}</Text>
                </View>
              ))}
            </View>
            {(role.fee || role.deadline) && (
              <View style={[rd.infoBox, { backgroundColor: theme.fill, borderRadius: RADIUS.md }]}>
                {role.fee && <View style={rd.infoCell}><Label>{t.compensation}</Label><Text style={[rd.infoVal, { color: theme.text }]}>{role.fee}</Text></View>}
                {role.deadline && <>{role.fee && <View style={[rd.infoDivider, { backgroundColor: theme.border }]} />}<View style={rd.infoCell}><Label>{t.deadline}</Label><Text style={[rd.infoVal, { color: theme.text }]}>{role.deadline}</Text></View></>}
              </View>
            )}
            <Divider style={{ marginVertical: 24 }} />
            <Text style={[rd.body, { color: theme.muted }]}>{role.description}</Text>
            <View style={rd.reqBlock}>
              <Label bright style={{ marginBottom: 14 }}>{t.requirements}</Label>
              {role.requirements.map((r, i) => (
                <View key={i} style={rd.req}>
                  <Text style={[rd.reqDash, { color: theme.muted }]}>—</Text>
                  <Text style={[rd.reqText, { color: theme.muted }]}>{r}</Text>
                </View>
              ))}
            </View>
            <Text style={[rd.posted, { color: theme.dim }]}>Posted {role.posted}</Text>
            <Divider style={{ marginVertical: 24 }} />
            {expressed ? (
              <View style={[rd.expressedBlock, { backgroundColor: theme.fill, borderRadius: RADIUS.md }]}>
                <Text style={[rd.expressedTitle, { color: theme.text }]}>{t.interestExpressed}</Text>
                <Text style={[rd.expressedSub, { color: theme.muted }]}>{t.brandWillBeInTouch}</Text>
              </View>
            ) : (
              <Button label={t.expressInterest} onPress={() => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); setExpressed(true); }} fullWidth />
            )}
          </ScrollView>
        </View>
      )}
    </AppModal>
  );
}

const rd = StyleSheet.create({
  root: { flex: 1 }, header: { alignItems: "center", paddingTop: 14, paddingBottom: 12, paddingHorizontal: 20, position: "relative" },
  handle: { width: 36, height: 4, borderRadius: 2 }, closeBtn: { position: "absolute", right: 20, top: 10, padding: 4 },
  closeCircle: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  content: { padding: 24 }, titleRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 18, gap: 14 },
  title: { fontFamily: FONT.serifLight, fontSize: 40, lineHeight: 44, letterSpacing: 0.3, marginTop: 8 },
  brand: { fontFamily: FONT.sansRegular, fontSize: 13, marginTop: 6 }, bookmarkBtn: { padding: 6, marginTop: 8 },
  pills: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 20 },
  pill: { paddingHorizontal: 12, paddingVertical: 7 }, pillText: { fontFamily: FONT.sansRegular, fontSize: 10, letterSpacing: 0.3 },
  infoBox: { flexDirection: "row", gap: 24, padding: 16, marginBottom: 4 }, infoCell: { gap: 6 },
  infoDivider: { width: StyleSheet.hairlineWidth, alignSelf: "stretch" },
  infoVal: { fontFamily: FONT.serifLight, fontSize: 18, letterSpacing: 0.2 },
  body: { fontFamily: FONT.sansRegular, fontSize: 13, lineHeight: 22, marginBottom: 24 },
  reqBlock: { marginBottom: 24 }, req: { flexDirection: "row", gap: 10, marginBottom: 10 },
  reqDash: { fontFamily: FONT.sansRegular, fontSize: 12, marginTop: 1 },
  reqText: { flex: 1, fontFamily: FONT.sansRegular, fontSize: 12, lineHeight: 19 },
  posted: { fontFamily: FONT.sansRegular, fontSize: 10, letterSpacing: 0.3, marginBottom: 4 },
  expressedBlock: { alignItems: "center", gap: 8, paddingVertical: 20, paddingHorizontal: 16 },
  expressedTitle: { fontFamily: FONT.sansMedium, fontSize: 10, letterSpacing: 2, textTransform: "uppercase" },
  expressedSub: { fontFamily: FONT.sansRegular, fontSize: 12, textAlign: "center" },
});

// ── Main Screen ───────────────────────────────────────────────────────────────

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const { t, fc } = useLanguage();
  const router = useRouter();

  const [refreshing, setRefreshing]   = useState(false);
  const [available, setAvailable]     = useState(true);
  const [invitations, setInvitations] = useState(INVITATIONS);
  const [roles, setRoles]             = useState(MATCHED_ROLES);
  const [feed, setFeed]               = useState(FEED);
  const [selectedRole, setSelectedRole] = useState<MatchedRole | null>(null);
  const [notifModal, setNotifModal]   = useState(false);
  const availAnim = useRef(new Animated.Value(1)).current;
  const quote = useMemo(() => getDailyQuote(), []);

  // ── Éloi subtitle rotation ──
  const [eloiSubIdx, setEloiSubIdx] = useState(0);
  const eloiSubOp = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const id = setInterval(() => {
      Animated.timing(eloiSubOp, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
        setEloiSubIdx((i) => (i + 1) % t.eloiSubtitles.length);
        Animated.timing(eloiSubOp, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      });
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => { setFeed((p) => p.map((f) => ({ ...f, unread: false }))); setRefreshing(false); }, 1200);
  }, []);

  const toggleAvailable = () => {
    const next = !available;
    setAvailable(next);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.timing(availAnim, { toValue: next ? 1 : 0, duration: 250, useNativeDriver: false }).start();
  };

  const handleInvite = (id: string, accept: boolean) => {
    Haptics.notificationAsync(accept ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning);
    setInvitations((p) => p.filter((i) => i.id !== id));
  };

  const toggleBookmark = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRoles((p) => p.map((r) => r.id === id ? { ...r, bookmarked: !r.bookmarked } : r));
  };

  const handleFeedTap = (item: typeof FEED[0]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFeed((p) => p.map((f) => f.id === item.id ? { ...f, unread: false } : f));
    router.push(item.route as any);
  };

  const unread = feed.filter((f) => f.unread).length;

  return (
    <>
      <ScrollView
        style={[styles.root, { backgroundColor: theme.bg }]}
        contentContainerStyle={[styles.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.muted} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Label>{(() => { const h = new Date().getHours(); return h < 12 ? t.goodMorning : h < 18 ? t.goodAfternoon : t.goodEvening; })()}</Label>
            <Text style={[styles.heading, { color: theme.text, fontFamily: fc.serifFamily, fontSize: fc.hs(48), lineHeight: fc.hl(fc.hs(48)) }]}>{t.dashboard}</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setNotifModal(true);
                setTimeout(() => setFeed(p => p.map(f => ({ ...f, unread: false }))), 600);
              }}
              activeOpacity={0.6}
              style={styles.iconBtn}
            >
              <View>
                <Feather name="bell" size={17} color={unread > 0 ? theme.text : theme.muted} />
                {unread > 0 && (
                  <View style={[styles.bellBadge, { backgroundColor: theme.text }]}>
                    <Text style={[styles.bellBadgeText, { color: theme.bg }]}>{unread}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleAvailable} activeOpacity={0.8}
              style={[styles.availBtn, { backgroundColor: theme.surface, borderRadius: RADIUS.pill }]}
            >
              <Animated.View style={[styles.availDot, { backgroundColor: availAnim.interpolate({ inputRange: [0,1], outputRange: [theme.muted, theme.text] }) }]} />
              <Text
                style={[styles.availText, { color: available ? theme.text : theme.muted }]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.8}
              >
                {available ? t.available : t.away}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Daily Quote — premium widget */}
        <View style={[styles.quoteCard, { backgroundColor: theme.surface, borderRadius: RADIUS.xl }, !isDark && SHADOW.card]}>
          <Text style={[styles.quoteBgMark, { color: theme.text }]}>{"\u201C"}</Text>
          <View style={styles.quoteTopRow}>
            <Label>{t.thoughtOfTheDay}</Label>
            <Text style={[styles.quoteOrnament, { color: theme.dim }]}>✦</Text>
          </View>
          <Text style={[styles.quoteText, { color: theme.text }]}>{quote.text}</Text>
          <View style={styles.quoteAttrib}>
            <View style={[styles.quoteDash, { backgroundColor: theme.muted }]} />
            <Text style={[styles.quoteAuthor, { color: theme.muted }]}>{quote.author.toUpperCase()}</Text>
          </View>
        </View>

        {/* ── Éloi Widget ─────────────────────────────────────────── */}
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push("/(app)/chat" as any);
          }}
          activeOpacity={0.78}
          style={[styles.eloiCard, { backgroundColor: theme.surface, borderRadius: RADIUS.xl }, !isDark && SHADOW.card]}
        >
          {/* Minimal luxury background pattern — subtle diamond grid */}
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {Array.from({ length: 6 }).map((_, row) =>
              Array.from({ length: 9 }).map((_, col) => (
                <View
                  key={`${row}-${col}`}
                  style={{
                    position: "absolute",
                    width: 4,
                    height: 4,
                    borderRadius: 0.5,
                    backgroundColor: theme.text,
                    opacity: 0.04,
                    top: 14 + row * 20,
                    left: 14 + col * 28,
                    transform: [{ rotate: "45deg" }],
                  }}
                />
              ))
            )}
            {/* Subtle corner accent */}
            <View style={{
              position: "absolute", top: 0, right: 0, width: 60, height: 60,
              borderTopRightRadius: RADIUS.xl,
              borderTopWidth: StyleSheet.hairlineWidth,
              borderRightWidth: StyleSheet.hairlineWidth,
              borderColor: theme.text,
              opacity: 0.07,
            }} />
          </View>

          <View style={styles.eloiRow}>
            <View style={{ flex: 1 }}>
              <Label>{t.yourConcierge}</Label>
              <Text style={[styles.eloiName, { color: theme.text }]}>Éloi</Text>
              <View style={[styles.eloiDivider, { backgroundColor: theme.border }]} />
              <Animated.Text style={[styles.eloiSub, { color: theme.muted, opacity: eloiSubOp }]}>
                {t.eloiSubtitles[eloiSubIdx]}
              </Animated.Text>
            </View>
            <View style={[styles.eloiArrow, { borderColor: theme.border }]}>
              <Feather name="arrow-right" size={15} color={theme.muted} />
            </View>
          </View>
        </TouchableOpacity>

        {/* Status card */}
        <Card elevated>
          <View style={styles.statusRow}>
            <View>
              <Label>{t.membership}</Label>
              <Text style={[styles.statusTier, { color: theme.text }]}>{t.eliteMembers}</Text>
            </View>
            <View style={[styles.verifiedPill, { backgroundColor: theme.fill, borderRadius: RADIUS.pill }]}>
              <Text style={[styles.verifiedText, { color: theme.muted }]}>{t.verified}</Text>
            </View>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.statsRow}>
            {[["2.4k", t.profileViews], ["12", t.introsSent], ["8", t.savedRoles]].map(([val, lbl], i) => (
              <View key={i} style={styles.statItem}>
                <Text style={[styles.statVal, { color: theme.text }]}>{val}</Text>
                <Label>{lbl}</Label>
              </View>
            ))}
          </View>
        </Card>

        {/* Pending introductions */}
        {invitations.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHead}>
              <Label bright>{t.pendingIntroductions}</Label>
              <View style={[styles.badge, { backgroundColor: theme.fill, borderRadius: RADIUS.pill }]}>
                <Text style={[styles.badgeText, { color: theme.muted }]}>{invitations.length}</Text>
              </View>
            </View>
            <Card>
              {invitations.map((inv, idx) => (
                <View key={inv.id}>
                  {idx > 0 && <Divider style={styles.itemDivider} />}
                  <View style={styles.invCard}>
                    <Text style={[styles.invName, { color: theme.text }]}>{inv.name}</Text>
                    <Text style={[styles.invRole, { color: theme.muted }]}>{inv.role}, {inv.brand}</Text>
                    {inv.via && <Text style={[styles.invVia, { color: theme.dim }]}>via {inv.via}</Text>}
                    <View style={styles.invActions}>
                      <TouchableOpacity onPress={() => handleInvite(inv.id, false)}
                        style={[styles.declineBtn, { backgroundColor: theme.fill, borderRadius: RADIUS.md }]} activeOpacity={0.7}>
                        <Text style={[styles.declineText, { color: theme.muted }]}>{t.decline}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleInvite(inv.id, true)}
                        style={[styles.acceptBtn, { backgroundColor: theme.invertBg, borderRadius: RADIUS.md }]} activeOpacity={0.7}>
                        <Text style={[styles.acceptText, { color: theme.invertText }]}>{t.accept}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </Card>
          </View>
        )}

        {/* Activity feed */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Label bright>{t.activity}</Label>
            {unread > 0 && (
              <View style={[styles.badge, { backgroundColor: theme.invertBg, borderRadius: RADIUS.pill }]}>
                <Text style={[styles.badgeText, { color: theme.invertText }]}>{unread}</Text>
              </View>
            )}
          </View>
          <Card>
            {feed.map((item, idx) => (
              <View key={item.id}>
                {idx > 0 && <Divider style={styles.itemDivider} />}
                <TouchableOpacity onPress={() => handleFeedTap(item)} activeOpacity={0.72} style={styles.feedItem}>
                  <View style={[styles.feedIconWrap, { backgroundColor: theme.fill, borderRadius: RADIUS.sm }]}>
                    <Feather name={item.icon as any} size={14} color={item.unread ? theme.text : theme.muted} />
                  </View>
                  <View style={{ flex: 1, gap: 3 }}>
                    <Text style={[styles.feedText, { color: item.unread ? theme.text : theme.muted }]}>{t.feedTexts[FEED_IDX[item.id]] ?? item.text}</Text>
                    <Text style={[styles.feedTime, { color: theme.dim }]}>{t.feedTimes[FEED_IDX[item.id]] ?? item.time}</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    {item.unread && <View style={[styles.unreadDot, { backgroundColor: theme.text }]} />}
                    <Feather name="chevron-right" size={13} color={theme.dim} />
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </Card>
        </View>

        {/* Matched roles */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Label bright>{t.matchedRoles}</Label>
            <TouchableOpacity onPress={() => router.push("/(app)/opportunities" as any)} activeOpacity={0.6}>
              <Text style={[styles.seeAll, { color: theme.muted }]}>{t.seeAll}</Text>
            </TouchableOpacity>
          </View>
          <Card>
            {roles.map((role, idx) => (
              <View key={role.id}>
                {idx > 0 && <Divider style={styles.itemDivider} />}
                <TouchableOpacity
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setSelectedRole(role); }}
                  activeOpacity={0.72} style={styles.roleRow}
                >
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={[styles.roleTitle, { color: theme.text }]}>{role.title}</Text>
                    <Text style={[styles.roleMeta, { color: theme.muted }]}>{role.brand} · {role.location}</Text>
                  </View>
                  <View style={styles.roleRight}>
                    <View style={[styles.typePill, { backgroundColor: theme.fill, borderRadius: RADIUS.pill }]}>
                      <Text style={[styles.typeText, { color: theme.muted }]}>{role.type}</Text>
                    </View>
                    <TouchableOpacity onPress={(e) => { e.stopPropagation(); toggleBookmark(role.id); }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} activeOpacity={0.6}>
                      <Feather name="bookmark" size={16} color={theme.muted} style={{ opacity: role.bookmarked ? 1 : 0.3 }} />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </Card>
        </View>
      </ScrollView>

      <RoleDetailModal
        role={selectedRole}
        onClose={() => setSelectedRole(null)}
        onBookmark={(id) => { toggleBookmark(id); setSelectedRole((r) => r?.id === id ? { ...r, bookmarked: !r.bookmarked } : r); }}
      />

      {/* Notifications modal */}
      <AppModal visible={notifModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setNotifModal(false)}>
        <View style={[nm.root, { backgroundColor: theme.bg }]}>
          <View style={nm.header}>
            <View style={[nm.handle, { backgroundColor: theme.border }]} />
            <TouchableOpacity onPress={() => setNotifModal(false)} style={nm.closeBtn} activeOpacity={0.6}>
              <View style={[nm.closeCircle, { backgroundColor: theme.fill }]}>
                <Feather name="x" size={14} color={theme.muted} />
              </View>
            </TouchableOpacity>
          </View>
          <View style={nm.titleRow}>
            <Label>{t.recent}</Label>
            <Text style={[nm.title, { color: theme.text }]}>{t.notifications}</Text>
          </View>
          <FlatList
            data={feed}
            keyExtractor={i => i.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: insets.bottom + 32, paddingHorizontal: 20 }}
            ItemSeparatorComponent={() => <View style={[nm.sep, { backgroundColor: theme.border }]} />}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => { setNotifModal(false); router.push(item.route as any); }}
                activeOpacity={0.72}
                style={nm.item}
              >
                <View style={[nm.iconWrap, { backgroundColor: theme.fill, borderRadius: RADIUS.sm }]}>
                  <Feather name={item.icon as any} size={14} color={theme.muted} />
                </View>
                <View style={{ flex: 1, gap: 3 }}>
                  <Text style={[nm.itemText, { color: theme.text }]}>{t.feedTexts[FEED_IDX[item.id]] ?? item.text}</Text>
                  <Text style={[nm.itemTime, { color: theme.dim }]}>{t.feedTimes[FEED_IDX[item.id]] ?? item.time}</Text>
                </View>
                <Feather name="chevron-right" size={13} color={theme.dim} />
              </TouchableOpacity>
            )}
          />
        </View>
      </AppModal>
    </>
  );
}

const styles = StyleSheet.create({
  root:         { flex: 1 },
  container:    { paddingHorizontal: 20, gap: 24 },
  header:       { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  heading:      { fontFamily: FONT.serifLight, fontSize: 48, lineHeight: 52, letterSpacing: 0.2, marginTop: 6 },
  headerRight:  { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 10 },
  iconBtn:      { padding: 4 },
  availBtn:     { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 8 },
  availDot:     { width: 6, height: 6, borderRadius: 3 },
  availText:    { fontFamily: FONT.sansMedium, fontSize: 12 },
  // Quote widget
  quoteCard:    { padding: 24, overflow: "hidden" },
  quoteBgMark:  { position: "absolute", top: -10, left: 14, fontFamily: FONT.serifLight, fontSize: 180, lineHeight: 160, opacity: 0.04 },
  quoteTopRow:  { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  quoteOrnament:{ fontSize: 13, opacity: 0.35 },
  quoteText:    { fontFamily: FONT.serifLight, fontSize: 18, lineHeight: 28, letterSpacing: 0.2, marginBottom: 20 },
  quoteAttrib:  { flexDirection: "row", alignItems: "center", gap: 10 },
  quoteDash:    { width: 18, height: StyleSheet.hairlineWidth, opacity: 0.4 },
  quoteAuthor:  { fontFamily: FONT.sansMedium, fontSize: 8, letterSpacing: 2, opacity: 0.55 },
  // Éloi widget
  eloiCard:     { padding: 22 },
  eloiRow:      { flexDirection: "row", alignItems: "center", gap: 16 },
  eloiName:     { fontFamily: FONT.serifLight, fontSize: 36, lineHeight: 40, letterSpacing: 0.3, marginTop: 6, marginBottom: 14 },
  eloiDivider:  { height: StyleSheet.hairlineWidth, marginBottom: 12, opacity: 0.45 },
  eloiSub:      { fontFamily: FONT.sansRegular, fontSize: 12, lineHeight: 18 },
  eloiArrow:    { width: 36, height: 36, borderRadius: 18, borderWidth: StyleSheet.hairlineWidth, alignItems: "center", justifyContent: "center" },
  // Bell badge
  bellBadge:    { position: "absolute", top: -6, right: -6, minWidth: 14, height: 14, borderRadius: 99, alignItems: "center", justifyContent: "center", paddingHorizontal: 2 },
  bellBadgeText:{ fontFamily: FONT.sansMedium, fontSize: 8 },
  // Other cards
  statusRow:    { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  statusTier:   { fontFamily: FONT.serifLight, fontSize: 28, letterSpacing: 0.2, marginTop: 6 },
  verifiedPill: { paddingHorizontal: 12, paddingVertical: 6 },
  verifiedText: { fontFamily: FONT.sansMedium, fontSize: 11 },
  divider:      { marginVertical: 16 },
  itemDivider:  { marginVertical: 0 },
  statsRow:     { flexDirection: "row" },
  statItem:     { flex: 1 },
  statVal:      { fontFamily: FONT.serifLight, fontSize: 32, lineHeight: 36 },
  section:      { gap: 12 },
  sectionHead:  { flexDirection: "row", alignItems: "center", gap: 8 },
  badge:        { paddingHorizontal: 8, paddingVertical: 3 },
  badgeText:    { fontFamily: FONT.sansMedium, fontSize: 11 },
  invCard:      { paddingVertical: 14, gap: 5 },
  invName:      { fontFamily: FONT.serifLight, fontSize: 22, letterSpacing: 0.2 },
  invRole:      { fontFamily: FONT.sansRegular, fontSize: 13, lineHeight: 19 },
  invVia:       { fontFamily: FONT.sansRegular, fontSize: 11 },
  invActions:   { flexDirection: "row", gap: 10, marginTop: 10 },
  declineBtn:   { flex: 1, paddingVertical: 11, alignItems: "center" },
  declineText:  { fontFamily: FONT.sansMedium, fontSize: 13 },
  acceptBtn:    { flex: 1, paddingVertical: 11, alignItems: "center" },
  acceptText:   { fontFamily: FONT.sansMedium, fontSize: 13 },
  feedItem:     { flexDirection: "row", gap: 12, paddingVertical: 12, alignItems: "flex-start" },
  feedIconWrap: { width: 32, height: 32, alignItems: "center", justifyContent: "center" },
  feedText:     { fontFamily: FONT.sansRegular, fontSize: 13, lineHeight: 19 },
  feedTime:     { fontFamily: FONT.sansRegular, fontSize: 11 },
  unreadDot:    { width: 6, height: 6, borderRadius: 3, marginTop: 2 },
  roleRow:      { flexDirection: "row", alignItems: "center", paddingVertical: 14, gap: 12 },
  roleTitle:    { fontFamily: FONT.serifLight, fontSize: 20, letterSpacing: 0.2 },
  roleMeta:     { fontFamily: FONT.sansRegular, fontSize: 12, lineHeight: 17 },
  roleRight:    { flexDirection: "row", alignItems: "center", gap: 10 },
  typePill:     { paddingHorizontal: 10, paddingVertical: 5 },
  typeText:     { fontFamily: FONT.sansMedium, fontSize: 11 },
  seeAll:       { fontFamily: FONT.sansRegular, fontSize: 13 },
});

const nm = StyleSheet.create({
  root:      { flex: 1 },
  header:    { alignItems: "center", paddingTop: 14, paddingBottom: 12, paddingHorizontal: 20, position: "relative" },
  handle:    { width: 36, height: 4, borderRadius: 2 },
  closeBtn:  { position: "absolute", right: 20, top: 10, padding: 4 },
  closeCircle:{ width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  titleRow:  { paddingHorizontal: 20, paddingBottom: 16, gap: 4 },
  title:     { fontFamily: FONT.serifLight, fontSize: 36, lineHeight: 40, letterSpacing: 0.2 },
  sep:       { height: StyleSheet.hairlineWidth },
  item:      { flexDirection: "row", gap: 12, paddingVertical: 14, alignItems: "flex-start" },
  iconWrap:  { width: 32, height: 32, alignItems: "center", justifyContent: "center" },
  itemText:  { fontFamily: FONT.sansRegular, fontSize: 13, lineHeight: 19 },
  itemTime:  { fontFamily: FONT.sansRegular, fontSize: 11 },
});
