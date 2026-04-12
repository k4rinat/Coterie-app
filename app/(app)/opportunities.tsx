import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  RefreshControl,
  Image,
} from "react-native";
import AppModal from "@/components/AppModal";

const LOGO_BLACK = require("@/assets/logo-mark.png");
const LOGO_WHITE = require("@/assets/logo-mark-white.png");
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { FONT, RADIUS, SHADOW } from "@/constants/Colors";
import Label from "@/components/Label";
import Divider from "@/components/Divider";
import Button from "@/components/Button";

// ── Types & Data ──────────────────────────────────────────────────────────────

interface Opportunity {
  id: string;
  title: string;
  brand: string;
  location: string;
  type: "Full-Time" | "Freelance" | "Project" | "Consultancy";
  category: string;
  discipline: string;
  posted: string;
  description: string;
  requirements: string[];
  fee?: string;
  deadline?: string;
  bookmarked: boolean;
  applicants?: number;
}

const SEED: Opportunity[] = [
  {
    id: "1",
    title: "Fashion Director",
    brand: "Vogue UK",
    location: "London, UK",
    type: "Full-Time",
    category: "Editorial",
    discipline: "Styling",
    posted: "2d ago",
    description:
      "Lead the visual and creative direction of one of fashion's most internationally significant publications. As Fashion Director, you will define the aesthetic vision that shapes cultural conversation across print, digital, and event activations — working in close collaboration with the Editor-in-Chief, photographers of global standing, and the industry's most in-demand talent.\n\nThis role demands both strategic authority and editorial instinct: the ability to commission visionary work while managing a team across multiple editorial cycles simultaneously.",
    requirements: [
      "10+ years of editorial experience at a major fashion publication, with a minimum of 3 years in a senior directorial capacity",
      "A demonstrable point of view — an established aesthetic that has influenced cultural conversation at industry level",
      "Proven experience directing shoots with total project budgets exceeding £200,000",
      "Active relationships with top-tier photographers, stylists, casting directors, and luxury house press offices",
      "Confidence presenting creative concepts at board level to both editorial and commercial leadership",
      "Deep knowledge of the UK and European market landscape, with a clear perspective on the direction of editorial fashion",
    ],
    fee: "£120,000 – £160,000 p.a.",
    deadline: "30 April 2026",
    bookmarked: true,
    applicants: 14,
  },
  {
    id: "2",
    title: "Senior Stylist",
    brand: "Maison Margiela",
    location: "London, UK",
    type: "Freelance",
    category: "Brand",
    discipline: "Styling",
    posted: "5d ago",
    description:
      "Collaborate directly with the Creative Studio on campaign and digital content for the Artisanal and MM6 lines from the London studio. This is not a support role — you will bring an established perspective that contributes meaningfully to the conceptual direction of each project, working in close dialogue with the studio's permanent team and international suppliers.",
    requirements: [
      "An established portfolio spanning luxury runway, campaign, and editorial — with demonstrable experience at the level of a major fashion house",
      "Fluency in English; French strongly preferred given regular collaboration with the Paris and Milan ateliers",
      "Full availability across the Spring/Summer and Autumn/Winter season schedules — Paris, Milan, and New York",
      "A rigorous personal archive and deep knowledge of Maison Margiela's conceptual heritage",
      "Proven ability to work under pressure to exacting creative and logistical standards",
    ],
    fee: "€800 – €1,200/day",
    bookmarked: false,
    applicants: 22,
  },
  {
    id: "3",
    title: "Casting Director",
    brand: "Valentino",
    location: "London, UK",
    type: "Project",
    category: "Production",
    discipline: "Casting",
    posted: "1w ago",
    description:
      "Lead UK casting for the Spring/Summer 2027 runway and campaign simultaneously from London. You will curate a roster that reflects the house's evolving aesthetic — balancing established names with emerging talent in a way that feels genuinely considered, not algorithmic.",
    requirements: [
      "A proven track record directing casting for top-tier fashion houses at both runway and major campaign level",
      "Strong pre-existing relationships with modelling agencies across London, Paris, Milan, New York, and emerging global markets",
      "Demonstrated ability to manage runway and campaign casting simultaneously within shared seasonal timelines",
      "A sophisticated understanding of Valentino's brand identity and a clear perspective on how talent selection serves it",
      "Excellent relationship and negotiation skills with agencies and talent directly",
    ],
    deadline: "15 March 2026",
    bookmarked: false,
    applicants: 8,
  },
  {
    id: "4",
    title: "Head of PR & Communications",
    brand: "Bottega Veneta",
    location: "London, UK",
    type: "Full-Time",
    category: "Communications",
    discipline: "PR",
    posted: "3d ago",
    description:
      "Define and execute communications strategy for one of luxury fashion's most architecturally significant houses, from the London regional office. As Head of PR, you will lead editorial relationships, cultural partnerships, and talent strategy across the UK and EMEA — translating global brand narrative into market-specific momentum.\n\nThis is a role for someone who understands that the best luxury PR is largely invisible: relationships built over years, placements that feel inevitable, and cultural adjacencies that elevate the brand without announcing themselves.",
    requirements: [
      "8+ years in luxury fashion PR, with a minimum of 3 years at head-of-department level",
      "Tier 1 international press relationships across print, digital, and broadcast — current and verifiable",
      "Proven cross-market experience spanning European and Asian press landscapes",
      "Experience managing and developing a PR team of 3 or more direct reports",
      "Existing relationships with cultural institutions, editors-at-large, and stylists operating at the level Bottega Veneta requires",
      "Strategic fluency: the ability to translate commercial objectives into communications that feel culturally authentic",
    ],
    fee: "€95,000 – €130,000 p.a.",
    bookmarked: false,
    applicants: 31,
  },
  {
    id: "5",
    title: "Creative Consultant",
    brand: "Toteme",
    location: "London, UK",
    type: "Consultancy",
    category: "Creative",
    discipline: "Creative Direction",
    posted: "6h ago",
    description:
      "Partner with the Toteme creative leadership team to advise on brand positioning, seasonal concept development, and visual identity strategy for the London market expansion. This engagement is for a consultant with specific depth in Scandinavian fashion positioning and the ability to translate brand philosophy into actionable creative direction for a non-native market.",
    requirements: [
      "Deep expertise in Scandinavian fashion positioning, with direct experience at brands of comparable scale and aesthetic profile",
      "A portfolio demonstrating both brand strategy and visual communication — not one at the expense of the other",
      "A nuanced understanding of how Toteme's aesthetic translates to the UK market, and where the gaps and opportunities lie",
      "Ability to operate independently, present confidently to senior leadership, and distil complex brand thinking into clear recommendations",
    ],
    fee: "To be discussed",
    bookmarked: false,
    applicants: 5,
  },
  {
    id: "6",
    title: "Art Director",
    brand: "Another Magazine",
    location: "London, UK",
    type: "Full-Time",
    category: "Editorial",
    discipline: "Art Direction",
    posted: "1w ago",
    description:
      "Shape the visual language of one of independent fashion publishing's most significant titles. As Art Director, you will oversee photography direction, layout, typographic systems, and the overall issue aesthetic — in direct creative partnership with the Editor-in-Chief across both print and digital.\n\nAnother Magazine requires someone who treats art direction as authorship: a strong personal perspective on how visual decision-making constructs meaning within a fashion context.",
    requirements: [
      "A portfolio spanning editorial and luxury brand art direction, with demonstrable experience at a major independent or commercial fashion publication",
      "Experience directing photographers, retouchers, and production teams across print and digital simultaneously",
      "Fluency in typographic systems, grid-based layout, and image sequencing at publication level",
      "A background in photography direction — an understanding of how images are made, not just selected",
      "Active relationships within the fashion photography and styling community",
      "Comfort working across print deadlines and digital publishing cycles at the same time",
    ],
    fee: "£70,000 – £90,000 p.a.",
    deadline: "1 May 2026",
    bookmarked: true,
    applicants: 18,
  },
  {
    id: "7",
    title: "Forecasting & Insights Manager",
    brand: "Parfums Christian Dior",
    location: "London, UK",
    type: "Full-Time",
    category: "Commercial",
    discipline: "Commercial Analytics",
    posted: "4d ago",
    description:
      "Play a pivotal role in using forecasting data and commercial insights to predict performance, inform brand strategy, and influence decision-making across the Wholesale Division. In close partnership with the Commercial Director and a team of two direct reports, you will translate complex data sets into actionable strategies — bridging the analytical and the operational within one of the most prestigious fragrance houses in the world.\n\nThis role demands the rare combination of technical precision and the ability to influence without authority: making data legible and compelling to commercial stakeholders at every level of the organisation.",
    requirements: [
      "5+ years of experience in Commercial Analytics, Business Analysis, Forecasting, or Sales — ideally within a luxury consumer goods environment",
      "High-level proficiency in SAP, Power BI, and Excel; demonstrated experience building dashboards and reports from complex, large-scale data sets",
      "Proven technical forecasting capability, with experience developing, enhancing, and maintaining internal forecast models",
      "Exceptional communication and presentation skills — the ability to influence senior stakeholders without direct authority is non-negotiable",
      "Experience preparing sell-in and sell-out reports, partnering with Finance on budget alignment, and leading a cross-functional forecast process",
      "Management experience leading a small commercial team; intellectual curiosity and a genuine problem-solving orientation",
    ],
    fee: "£65,000 – £85,000 p.a.",
    deadline: "15 May 2026",
    bookmarked: false,
    applicants: 27,
  },
  {
    id: "8",
    title: "Merchandising Director",
    brand: "Fendi",
    location: "New York, NY",
    type: "Full-Time",
    category: "Commercial",
    discipline: "Merchandising",
    posted: "1w ago",
    description:
      "Since 1925, Fendi has built its vision on the precise tension between tradition and modernity — the desire to preserve what matters and the courage to innovate. As Merchandising Director for Women's RTW, Shoes, Fur & Kids, you will bring that philosophy into market: leading the strategies that ensure the Americas region reflects both the house's creative vision and its commercial ambitions.\n\nReporting to the VP of Merchandising and leading two direct reports, you will work cross-functionally with Omni, CRM, Visual Merchandising, Retail, and Communication teams — partnering closely with HQ in Rome to develop a cohesive local go-to-market plan.",
    requirements: [
      "Bachelor's degree in Business Administration, Fashion Merchandising, or a related field; 8+ years of merchandising experience in a luxury environment with direct experience managing Designer RTW",
      "Proven track record managing and developing high-performing teams, with 2 or more direct reports",
      "Strong analytical skills paired with a creative mindset — the ability to interpret sales data, monitor inventory, and adjust plans with both rigour and taste",
      "In-depth knowledge of luxury fashion market dynamics: customer segmentation, competitive analysis, and pricing strategy",
      "Exceptional communication skills — the ability to present complex commercial concepts clearly to both local leadership and HQ in Rome",
      "Willingness to travel up to 50% domestically and internationally; flexibility to attend industry events outside standard hours as seasonal cycles require",
    ],
    fee: "$180,000 – $220,000 p.a.",
    deadline: "30 April 2026",
    bookmarked: false,
    applicants: 19,
  },
  {
    id: "9",
    title: "Senior Buyer — Ready-to-Wear",
    brand: "Mytheresa",
    location: "Munich, Germany",
    type: "Full-Time",
    category: "Commercial",
    discipline: "Buying",
    posted: "3d ago",
    description:
      "Define the RTW assortment strategy for one of global luxury e-commerce's most curated platforms. As Senior Buyer, you will lead range selection across key brand partnerships — negotiating with and developing relationships at senior level across major European, American, and emerging luxury houses.\n\nMytheresa's buying is not reactive: it is an act of curation. You will be expected to identify opportunities ahead of market and build a perspective on what the Mytheresa customer needs before she knows it herself.",
    requirements: [
      "5+ years of luxury RTW buying experience, with specific depth across established and emerging designer brands",
      "Proven track record in range planning, OTB management, and brand negotiation at senior level",
      "Strong market knowledge — a clear perspective on the global luxury RTW competitive landscape and where Mytheresa sits within it",
      "Analytical capability to manage sell-through analysis and intake plans with precision",
      "Existing relationships at directorial level with brand wholesale and sales teams",
      "Fluency in English; German a plus. Willingness to travel to market weeks in Paris, Milan, New York, and Copenhagen",
    ],
    fee: "€75,000 – €95,000 p.a.",
    deadline: "20 April 2026",
    bookmarked: false,
    applicants: 41,
  },
  {
    id: "10",
    title: "Womenswear Designer",
    brand: "Alexander McQueen",
    location: "London, UK",
    type: "Full-Time",
    category: "Creative",
    discipline: "Design",
    posted: "2w ago",
    description:
      "Contribute to the design and development of the Womenswear collection at one of British fashion's most significant creative institutions. Working within the design team and in close collaboration with the Creative Director, you will develop silhouettes, explore fabrication, and bring seasonal concepts from sketch through to toile — contributing at every stage of the design process.\n\nAlexander McQueen requires designers who think with their hands and lead with an opinion.",
    requirements: [
      "A degree in Fashion Design from a leading institution, with an exceptional graduate portfolio demonstrating a strong personal design language",
      "A minimum of 3 years of womenswear design experience at a comparable luxury house, with demonstrable involvement in the full design cycle",
      "Technical proficiency across pattern-cutting, toile development, and garment construction — you must understand how a garment is made, not just how it looks",
      "Proficiency in CLO3D or equivalent digital design tools, alongside traditional hand-sketching",
      "A working knowledge of weaving, embroidery, leather, and tailoring as they apply to luxury womenswear",
      "The ability to work at pace across seasonal cycles without compromising on quality of thinking or execution",
    ],
    fee: "£55,000 – £75,000 p.a.",
    bookmarked: false,
    applicants: 37,
  },
];

const CATEGORIES = ["All", "Editorial", "Brand", "Production", "Communications", "Creative", "Commercial"];
const TYPES = ["All", "Full-Time", "Freelance", "Project", "Consultancy"];

// ── Detail Sheet ──────────────────────────────────────────────────────────────

function DetailSheet({
  opp,
  onClose,
  onBookmark,
}: {
  opp: Opportunity | null;
  onClose: () => void;
  onBookmark: (id: string) => void;
}) {
  const { theme, isDark } = useTheme();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const [expressed, setExpressed] = useState(false);

  React.useEffect(() => {
    if (opp) setExpressed(false);
  }, [opp?.id]);

  return (
    <AppModal
      visible={!!opp}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      {opp && (
        <View style={[s.sheet, { backgroundColor: theme.bg }]}>
          {/* Drag handle + close */}
          <View style={s.sheetHeader}>
            <View style={[s.handle, { backgroundColor: theme.border }]} />
            <TouchableOpacity onPress={onClose} activeOpacity={0.6} style={s.closeBtn}>
              <View style={[s.closeCircle, { backgroundColor: theme.fill }]}>
                <Feather name="x" size={14} color={theme.muted} />
              </View>
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[s.sheetContent, { paddingBottom: insets.bottom + 32 }]}
          >
            {/* Title */}
            <View style={s.titleRow}>
              <View style={{ flex: 1 }}>
                <Label>{opp.category} · {opp.type}</Label>
                <Text style={[s.title, { color: theme.text }]}>{opp.title}</Text>
                <Text style={[s.brand, { color: theme.muted }]}>{opp.brand}</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onBookmark(opp.id);
                }}
                activeOpacity={0.6}
                style={s.bookmarkBtn}
              >
                <Feather
                  name="bookmark"
                  size={18}
                  color={opp.bookmarked ? theme.text : theme.muted}
                  style={{ opacity: opp.bookmarked ? 1 : 0.35 }}
                />
              </TouchableOpacity>
            </View>

            {/* Pills */}
            <View style={s.pills}>
              {[opp.location, opp.discipline, `${opp.applicants} applicants`].map((p, i) => (
                <View key={i} style={[s.pill, { backgroundColor: theme.fill }]}>
                  <Text style={[s.pillText, { color: theme.muted }]}>{p}</Text>
                </View>
              ))}
            </View>

            {/* Fee / Deadline */}
            {(opp.fee || opp.deadline) && (
              <View style={[s.infoBox, { backgroundColor: theme.fill, borderRadius: RADIUS.md }]}>
                {opp.fee && (
                  <View style={s.infoCell}>
                    <Label>{t.compensation}</Label>
                    <Text style={[s.infoVal, { color: theme.text }]}>{opp.fee}</Text>
                  </View>
                )}
                {opp.deadline && (
                  <>
                    {opp.fee && <View style={[s.infoDivider, { backgroundColor: theme.border }]} />}
                    <View style={s.infoCell}>
                      <Label>{t.deadline}</Label>
                      <Text style={[s.infoVal, { color: theme.text }]}>{opp.deadline}</Text>
                    </View>
                  </>
                )}
              </View>
            )}

            <Divider style={{ marginVertical: 24 }} />

            <Text style={[s.body, { color: theme.muted }]}>{opp.description}</Text>

            {/* Requirements */}
            <View style={s.reqBlock}>
              <Label bright style={{ marginBottom: 14 }}>{t.requirements}</Label>
              {opp.requirements.map((r, i) => (
                <View key={i} style={s.req}>
                  <Text style={[s.reqDash, { color: theme.muted }]}>—</Text>
                  <Text style={[s.reqText, { color: theme.muted }]}>{r}</Text>
                </View>
              ))}
            </View>

            <Text style={[s.posted, { color: theme.dim }]}>Posted {opp.posted}</Text>

            <Divider style={{ marginVertical: 24 }} />

            {/* CTA */}
            {expressed ? (
              <View style={[s.expressedBlock, { backgroundColor: theme.fill, borderRadius: RADIUS.md }]}>
                <View style={s.expressedTitleRow}>
                  <Image source={isDark ? LOGO_WHITE : LOGO_BLACK} style={s.expressedIcon} resizeMode="contain" />
                  <Text style={[s.expressedTitle, { color: theme.text }]}>Interest Expressed</Text>
                </View>
                <Text style={[s.expressedSub, { color: theme.muted }]}>
                  {t.brandWillBeInTouch}
                </Text>
              </View>
            ) : (
              <Button
                label={t.expressInterest}
                onPress={() => {
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  setExpressed(true);
                }}
                fullWidth
              />
            )}
          </ScrollView>
        </View>
      )}
    </AppModal>
  );
}

const s = StyleSheet.create({
  sheet: { flex: 1 },
  sheetHeader: {
    alignItems: "center",
    paddingTop: 14,
    paddingBottom: 12,
    paddingHorizontal: 20,
    position: "relative",
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  closeBtn: {
    position: "absolute",
    right: 20,
    top: 10,
    padding: 4,
  },
  closeCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  sheetContent: { padding: 24, gap: 0 },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 18,
    gap: 14,
  },
  title: {
    fontFamily: FONT.serifLight,
    fontSize: 44,
    lineHeight: 48,
    letterSpacing: 0.3,
    marginTop: 8,
  },
  brand: {
    fontFamily: FONT.sansRegular,
    fontSize: 13,
    marginTop: 6,
  },
  bookmarkBtn: { padding: 6, marginTop: 8 },
  pills: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 20 },
  pill: {
    borderRadius: RADIUS.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  pillText: {
    fontFamily: FONT.sansRegular,
    fontSize: 10,
    letterSpacing: 0.3,
  },
  infoBox: {
    flexDirection: "row",
    gap: 24,
    padding: 16,
    marginBottom: 4,
  },
  infoCell: { gap: 6 },
  infoDivider: { width: StyleSheet.hairlineWidth, alignSelf: "stretch" },
  infoVal: {
    fontFamily: FONT.serifLight,
    fontSize: 18,
    letterSpacing: 0.2,
  },
  body: {
    fontFamily: FONT.sansRegular,
    fontSize: 13,
    lineHeight: 22,
    marginBottom: 24,
  },
  reqBlock: { marginBottom: 24 },
  req: { flexDirection: "row", gap: 10, marginBottom: 10 },
  reqDash: { fontFamily: FONT.sansRegular, fontSize: 12, marginTop: 1 },
  reqText: {
    flex: 1,
    fontFamily: FONT.sansRegular,
    fontSize: 12,
    lineHeight: 19,
  },
  posted: {
    fontFamily: FONT.sansRegular,
    fontSize: 10,
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  expressedBlock: { alignItems: "center", gap: 8, paddingVertical: 20, paddingHorizontal: 16 },
  expressedTitleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  expressedIcon: { width: 14, height: 14 },
  expressedTitle: {
    fontFamily: FONT.sansMedium,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  expressedSub: {
    fontFamily: FONT.sansRegular,
    fontSize: 12,
    textAlign: "center",
  },
});

// ── Main Screen ───────────────────────────────────────────────────────────────

export default function OpportunitiesScreen() {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const { t, fc } = useLanguage();

  const [opps, setOpps] = useState(SEED);
  const [category, setCategory] = useState("All");
  const [type, setType] = useState("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Opportunity | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const filtered = opps.filter((o) => {
    const matchCat = category === "All" || o.category === category;
    const matchType = type === "All" || o.type === type;
    const matchQ =
      !query ||
      o.title.toLowerCase().includes(query.toLowerCase()) ||
      o.brand.toLowerCase().includes(query.toLowerCase());
    const matchSaved = !showSaved || o.bookmarked;
    return matchCat && matchType && matchQ && matchSaved;
  });

  const handleBookmark = (id: string) => {
    setOpps((prev) => prev.map((o) => (o.id === id ? { ...o, bookmarked: !o.bookmarked } : o)));
    setSelected((prev) => (prev?.id === id ? { ...prev, bookmarked: !prev.bookmarked } : prev));
  };

  const savedCount = opps.filter((o) => o.bookmarked).length;

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 20, backgroundColor: theme.bg }]}>
        <View style={styles.headRow}>
          <View>
            <Label>{t.curatedForYouLabel}</Label>
            <Text style={[styles.heading, { color: theme.text, fontFamily: fc.serifFamily, fontSize: fc.hs(48), lineHeight: fc.hl(fc.hs(48)) }]}>{t.rolesHeading}</Text>
          </View>
          {savedCount > 0 && (
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowSaved((s) => !s);
              }}
              activeOpacity={0.7}
              style={[
                styles.savedPill,
                { backgroundColor: showSaved ? theme.invertBg : theme.fill },
              ]}
            >
              <Feather name="bookmark" size={10} color={showSaved ? theme.invertText : theme.muted} />
              <Text style={[styles.savedText, { color: showSaved ? theme.invertText : theme.muted }]}>
                {savedCount} {t.saved}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Search */}
        <View style={[styles.searchRow, { backgroundColor: theme.surface, borderRadius: RADIUS.md }, !isDark && SHADOW.card]}>
          <Feather name="search" size={14} color={theme.muted} style={{ opacity: 0.5 }} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            value={query}
            onChangeText={setQuery}
            placeholder={t.searchPlaceholder}
            placeholderTextColor={theme.dim}
            selectionColor={theme.text}
          />
          {!!query && (
            <TouchableOpacity onPress={() => setQuery("")} activeOpacity={0.6}>
              <Feather name="x" size={14} color={theme.muted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Category chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {CATEGORIES.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setCategory(c); }}
              style={[
                styles.chip,
                { backgroundColor: c === category ? theme.invertBg : theme.fill },
              ]}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, { color: c === category ? theme.invertText : theme.muted }]}>
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Type chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {TYPES.map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setType(t); }}
              style={[
                styles.chip,
                styles.chipSm,
                { backgroundColor: t === type ? theme.invertBg : theme.fill },
              ]}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, { color: t === type ? theme.invertText : theme.muted }]}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Divider />
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 80 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.muted} />}
        ItemSeparatorComponent={() => <Divider />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: theme.muted }]}>{t.noRolesMatch}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelected(item);
            }}
            activeOpacity={0.72}
            style={styles.row}
          >
            <View style={{ flex: 1, gap: 5 }}>
              <View style={styles.rowMeta}>
                <Text style={[styles.rowCat, { color: theme.muted }]}>{item.category}</Text>
                <Text style={[styles.rowDot, { color: theme.muted }]}>·</Text>
                <Text style={[styles.rowType, { color: theme.muted }]}>{item.type}</Text>
              </View>
              <Text style={[styles.rowTitle, { color: theme.text }]}>{item.title}</Text>
              <Text style={[styles.rowBrand, { color: theme.muted }]}>
                {item.brand} — {item.location}
              </Text>
            </View>
            <View style={styles.rowRight}>
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  handleBookmark(item.id);
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                activeOpacity={0.6}
              >
                <Feather
                  name="bookmark"
                  size={15}
                  color={theme.muted}
                  style={{ opacity: item.bookmarked ? 1 : 0.3 }}
                />
              </TouchableOpacity>
              <Text style={[styles.rowPosted, { color: theme.dim }]}>{item.posted}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Detail sheet */}
      <DetailSheet
        opp={selected}
        onClose={() => setSelected(null)}
        onBookmark={handleBookmark}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 20, gap: 14, paddingBottom: 0 },
  headRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  heading: {
    lineHeight: 56,
    letterSpacing: 0.5,
    marginTop: 8,
  },
  savedPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginTop: 14,
  },
  savedText: {
    fontFamily: FONT.sansMedium,
    fontSize: 9,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONT.sansRegular,
    fontSize: 13,
  },
  chips: { gap: 6, paddingRight: 20 },
  chip: {
    borderRadius: RADIUS.pill,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  chipSm: { paddingVertical: 7 },
  chipText: {
    fontFamily: FONT.sansMedium,
    fontSize: 9,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 20,
    gap: 14,
  },
  rowMeta: { flexDirection: "row", alignItems: "center", gap: 6 },
  rowCat: {
    fontFamily: FONT.sansMedium,
    fontSize: 8,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  rowDot: { fontSize: 9 },
  rowType: {
    fontFamily: FONT.sansRegular,
    fontSize: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  rowTitle: {
    fontFamily: FONT.serifLight,
    fontSize: 24,
    letterSpacing: 0.2,
  },
  rowBrand: {
    fontFamily: FONT.sansRegular,
    fontSize: 11,
    lineHeight: 16,
  },
  rowRight: { alignItems: "flex-end", gap: 10, paddingTop: 2 },
  rowPosted: {
    fontFamily: FONT.sansRegular,
    fontSize: 9,
    letterSpacing: 0.3,
  },
  empty: { paddingTop: 60, alignItems: "center" },
  emptyText: { fontFamily: FONT.sansRegular, fontSize: 12 },
});
