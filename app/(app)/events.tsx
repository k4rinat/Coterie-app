import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Image,
} from "react-native";
import AppModal from "@/components/AppModal";

const LOGO_BLACK = require("@/assets/logo-mark.png");
const LOGO_WHITE = require("@/assets/logo-mark-white.png");

// ── Optional integrations (require: npx expo install expo-calendar expo-notifications) ──
let ExpoCalendar: any = null;
let Notifications: any = null;
try { ExpoCalendar = require("expo-calendar"); } catch {}
try { Notifications = require("expo-notifications"); } catch {}
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

interface Event {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  displayDate: string;
  time: string;
  location: string;
  format: string;
  capacity: number;
  spotsLeft: number;
  description: string;
  host?: string;
  dresscode?: string;
  rsvpd: boolean;
}

const EVENTS: Event[] = [
  {
    id: "1",
    title: "Hermès Creative Leadership Dinner",
    subtitle: "Private evening with the Paris studio heads",
    date: "2026-03-18",
    displayDate: "18 March 2026",
    time: "7:30 PM",
    location: "The Connaught, London",
    format: "Private Dinner",
    capacity: 14,
    spotsLeft: 3,
    description: "An intimate off-the-record dinner with senior creative leadership from Hermès. Conversations will span craft, culture, and the future of artisanal luxury. By invitation — Coterie Elite members only.",
    host: "Coterie × Hermès",
    dresscode: "Evening dress",
    rsvpd: false,
  },
  {
    id: "2",
    title: "Fashion Intelligence Forum",
    subtitle: "Trends, talent, and the next decade of luxury",
    date: "2026-03-24",
    displayDate: "24 March 2026",
    time: "10:00 AM – 5:00 PM",
    location: "180 The Strand, London",
    format: "Symposium",
    capacity: 80,
    spotsLeft: 22,
    description: "A full-day symposium bringing together editors, creative directors, and brand strategists to examine the forces reshaping the luxury sector. Three keynotes, six breakout sessions, and a curated lunch.",
    host: "Coterie",
    rsvpd: true,
  },
  {
    id: "3",
    title: "Valentino Archive Preview",
    subtitle: "Exclusive access to the SS25 campaign archive",
    date: "2026-04-02",
    displayDate: "2 April 2026",
    time: "6:00 PM",
    location: "Valentino, Bond Street",
    format: "Preview",
    capacity: 30,
    spotsLeft: 7,
    description: "A private preview of Valentino's SS25 campaign archive, presented by the brand's communications team. Light refreshments served.",
    host: "Valentino × Coterie",
    rsvpd: false,
  },
  {
    id: "4",
    title: "Emerging Talent Showcase",
    subtitle: "Spotlighting the next generation of fashion creatives",
    date: "2026-04-10",
    displayDate: "10 April 2026",
    time: "7:00 PM",
    location: "Saatchi Gallery, London",
    format: "Showcase",
    capacity: 60,
    spotsLeft: 41,
    description: "A curated evening celebrating twelve emerging creatives selected from the Coterie network. Live presentations, portfolio viewings, and direct conversations with established figures.",
    host: "Coterie",
    rsvpd: false,
  },
  {
    id: "5",
    title: "Loewe Craft Masterclass",
    subtitle: "Leatherwork and artisanal process with the Barcelona atelier",
    date: "2026-04-22",
    displayDate: "22 April 2026",
    time: "2:00 PM",
    location: "Loewe Atelier, Paris",
    format: "Masterclass",
    capacity: 12,
    spotsLeft: 0,
    description: "A half-day masterclass in leather craft and material sourcing with Loewe's head artisan.",
    host: "Loewe × Coterie",
    rsvpd: false,
  },
];

const EVENT_DATES = new Set(EVENTS.map((e) => e.date));
const RSVP_DATES  = new Set(EVENTS.filter((e) => e.rsvpd).map((e) => e.date));

// ── Calendar ──────────────────────────────────────────────────────────────────

function Calendar({
  year, month, selectedDate, onSelectDate, onMonthChange, monthNames, dayLetters,
}: {
  year: number; month: number; selectedDate: string | null;
  onSelectDate: (date: string) => void; onMonthChange: (y: number, m: number) => void;
  monthNames: string[]; dayLetters: string[];
}) {
  const { theme, isDark } = useTheme();

  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today       = new Date();
  const todayStr    = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const toDateStr = (d: number) =>
    `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;

  const prevMonth = () => { if (month === 0) onMonthChange(year - 1, 11); else onMonthChange(year, month - 1); };
  const nextMonth = () => { if (month === 11) onMonthChange(year + 1, 0); else onMonthChange(year, month + 1); };

  return (
    <View style={[cal.root, { backgroundColor: theme.surface, borderRadius: RADIUS.lg }, !isDark && SHADOW.card]}>
      {/* Month nav */}
      <View style={cal.nav}>
        <TouchableOpacity onPress={prevMonth} activeOpacity={0.6} style={cal.navBtn}>
          <Feather name="chevron-left" size={18} color={theme.text} />
        </TouchableOpacity>
        <Text style={[cal.monthTitle, { color: theme.text }]}>
          {monthNames[month]} {year}
        </Text>
        <TouchableOpacity onPress={nextMonth} activeOpacity={0.6} style={cal.navBtn}>
          <Feather name="chevron-right" size={18} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Day headers */}
      <View style={cal.weekRow}>
        {dayLetters.map((d, i) => (
          <View key={i} style={cal.dayHeaderCell}>
            <Text style={[cal.dayHeader, { color: theme.muted }]}>{d}</Text>
          </View>
        ))}
      </View>

      {/* Date grid */}
      <View style={cal.grid}>
        {Array.from({ length: cells.length / 7 }, (_, row) => (
          <View key={row} style={cal.row}>
            {cells.slice(row * 7, row * 7 + 7).map((day, col) => {
              if (!day) return <View key={col} style={cal.cell} />;
              const dateStr    = toDateStr(day);
              const isToday    = dateStr === todayStr;
              const isSelected = dateStr === selectedDate;
              const hasEvent   = EVENT_DATES.has(dateStr);

              return (
                <TouchableOpacity
                  key={col}
                  style={cal.cell}
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onSelectDate(dateStr); }}
                  activeOpacity={0.7}
                >
                  <View style={[
                    cal.dayOuter,
                    isSelected && { backgroundColor: theme.text },
                    isToday && !isSelected && { borderWidth: 1.5, borderColor: theme.text },
                  ]}>
                    <Text style={[
                      cal.dayNum,
                      { color: isSelected ? theme.bg : theme.text },
                      !isSelected && !isToday && { opacity: 0.8 },
                    ]}>
                      {day}
                    </Text>
                  </View>
                  {hasEvent && (
                    <View style={[cal.dot, { backgroundColor: isSelected ? theme.bg : theme.text, opacity: isSelected ? 0.5 : 0.8 }]} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const cal = StyleSheet.create({
  root: { paddingHorizontal: 4, paddingBottom: 16 },
  nav: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 8, paddingVertical: 16 },
  navBtn: { padding: 6 },
  monthTitle: { fontFamily: FONT.serifLight, fontSize: 22, letterSpacing: 0.3 },
  weekRow: { flexDirection: "row", marginBottom: 4 },
  dayHeaderCell: { flex: 1, alignItems: "center", paddingVertical: 4 },
  dayHeader: { fontFamily: FONT.sansMedium, fontSize: 9, letterSpacing: 1 },
  grid: { gap: 2 },
  row: { flexDirection: "row" },
  cell: { flex: 1, alignItems: "center", paddingVertical: 2, gap: 2 },
  dayOuter: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  dayNum: { fontFamily: FONT.sansRegular, fontSize: 14 },
  dot: { width: 4, height: 4, borderRadius: 2 },
});

// ── RSVP Modal ────────────────────────────────────────────────────────────────

async function addEventToCalendar(event: Event) {
  if (!ExpoCalendar) return;
  try {
    const { status } = await ExpoCalendar.requestCalendarPermissionsAsync();
    if (status !== "granted") return;
    const calendars = await ExpoCalendar.getCalendarsAsync(ExpoCalendar.EntityTypes.EVENT);
    const target = calendars.find((c: any) => c.isPrimary) ?? calendars[0];
    if (!target) return;
    const [y, m, d] = event.date.split("-").map(Number);
    // Use event time if parseable, else default to 7pm
    const hour = parseInt(event.time, 10) || 19;
    await ExpoCalendar.createEventAsync(target.id, {
      title: event.title,
      location: event.location,
      startDate: new Date(y, m - 1, d, hour, 0),
      endDate: new Date(y, m - 1, d, hour + 2, 0),
      notes: event.description,
    });
  } catch {}
}

async function scheduleRSVPReminder(event: Event) {
  if (!Notifications) return;
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") return;
    Notifications.setNotificationHandler({
      handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: false, shouldSetBadge: false }),
    });
    const [y, m, d] = event.date.split("-").map(Number);
    const hour = parseInt(event.time, 10) || 19;
    const eventTime = new Date(y, m - 1, d, hour, 0);
    const reminderTime = new Date(eventTime.getTime() - 60 * 60 * 1000); // 1hr before
    if (reminderTime > new Date()) {
      await Notifications.scheduleNotificationAsync({
        content: { title: "Coterie — Tonight", body: `${event.title} · ${event.location}` },
        trigger: reminderTime,
      });
    }
  } catch {}
}

function RSVPModal({ event, onClose, onConfirm }: {
  event: Event | null; onClose: () => void; onConfirm: (id: string) => void;
}) {
  const { theme, isDark } = useTheme();
  const { t } = useLanguage();
  const eventDescIdx = event ? EVENTS.findIndex((e) => e.id === event.id) : -1;
  const [confirmed, setConfirmed] = useState(false);
  const [addedToCalendar, setAddedToCalendar] = useState(false);

  React.useEffect(() => { if (event) { setConfirmed(false); setAddedToCalendar(false); } }, [event?.id]);

  return (
    <AppModal visible={!!event} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      {event && (
        <View style={[rsvp.root, { backgroundColor: theme.bg }]}>
          <View style={rsvp.header}>
            <View style={[rsvp.handle, { backgroundColor: theme.border }]} />
            <TouchableOpacity onPress={onClose} style={rsvp.closeBtn} activeOpacity={0.6}>
              <View style={[rsvp.closeCircle, { backgroundColor: theme.fill }]}>
                <Feather name="x" size={14} color={theme.muted} />
              </View>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={rsvp.content} showsVerticalScrollIndicator={false}>
            {confirmed ? (
              <View style={rsvp.confirmedBlock}>
                <Image source={isDark ? LOGO_WHITE : LOGO_BLACK} style={rsvp.confirmedIcon} resizeMode="contain" />
                <Text style={[rsvp.confirmedHeading, { color: theme.text }]}>{t.rsvpConfirmed}</Text>
                <Text style={[rsvp.confirmedSub, { color: theme.muted }]}>
                  {t.rsvpConfirmedDesc.replace("{title}", event.title)}
                </Text>
                {ExpoCalendar && (
                  <TouchableOpacity
                    onPress={async () => {
                      if (addedToCalendar) return;
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      await addEventToCalendar(event);
                      await scheduleRSVPReminder(event);
                      setAddedToCalendar(true);
                      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    }}
                    activeOpacity={addedToCalendar ? 1 : 0.75}
                    style={[
                      rsvp.calBtn,
                      {
                        backgroundColor: addedToCalendar ? theme.fill : theme.surface,
                        borderRadius: RADIUS.md,
                        borderWidth: StyleSheet.hairlineWidth,
                        borderColor: addedToCalendar ? "transparent" : theme.border,
                      },
                    ]}
                  >
                    <Feather
                      name={addedToCalendar ? "check" : "calendar"}
                      size={14}
                      color={addedToCalendar ? theme.muted : theme.text}
                    />
                    <Text style={[rsvp.calBtnText, { color: addedToCalendar ? theme.muted : theme.text }]}>
                      {addedToCalendar ? t.addedToCalendar : t.addToCalendar}
                    </Text>
                  </TouchableOpacity>
                )}
                <Button label={t.done} onPress={onClose} fullWidth style={{ marginTop: 8 }} />
              </View>
            ) : (
              <>
                <Label>{event.format}</Label>
                <Text style={[rsvp.title, { color: theme.text }]}>{event.title}</Text>

                <View style={[rsvp.detailsBox, { backgroundColor: theme.fill, borderRadius: RADIUS.md }]}>
                  {([
                    [t.date, `${event.displayDate}, ${event.time}`],
                    [t.location, event.location],
                    ...(event.host ? [[t.host, event.host]] : []),
                    ...(event.dresscode ? [[t.dressCode, event.dresscode]] : []),
                    [t.spotsRemaining, `${event.spotsLeft} of ${event.capacity}`],
                  ] as [string, string][]).map(([k, v], i) => (
                    <View key={i}>
                      {i > 0 && <Divider style={{ marginVertical: 10 }} />}
                      <View style={rsvp.detailRow}>
                        <Text style={[rsvp.detailKey, { color: theme.muted }]}>{k}</Text>
                        <Text style={[rsvp.detailVal, { color: theme.text }]}>{v}</Text>
                      </View>
                    </View>
                  ))}
                </View>

                <Text style={[rsvp.desc, { color: theme.muted }]}>
                  {eventDescIdx >= 0 ? t.eventDescriptions[eventDescIdx] : event.description}
                </Text>

                <View style={rsvp.actions}>
                  <Button label={t.cancel} variant="ghost" onPress={onClose} style={{ flex: 1 }} />
                  <Button
                    label={`${t.rsvp} ✦`}
                    onPress={() => {
                      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                      setConfirmed(true);
                      onConfirm(event.id);
                    }}
                    style={{ flex: 1 }}
                  />
                </View>
              </>
            )}
          </ScrollView>
        </View>
      )}
    </AppModal>
  );
}

const rsvp = StyleSheet.create({
  root: { flex: 1 },
  header: { alignItems: "center", paddingTop: 14, paddingBottom: 12, paddingHorizontal: 20, position: "relative" },
  handle: { width: 36, height: 4, borderRadius: 2 },
  closeBtn: { position: "absolute", right: 20, top: 10, padding: 4 },
  closeCircle: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  content: { padding: 24, gap: 20 },
  confirmedBlock: { alignItems: "center", gap: 14, paddingVertical: 40 },
  confirmedIcon: { width: 36, height: 36 },
  confirmedHeading: { fontFamily: FONT.serifLight, fontSize: 34, letterSpacing: 0.3 },
  confirmedSub: { fontFamily: FONT.sansRegular, fontSize: 13, lineHeight: 20, textAlign: "center", maxWidth: 300 },
  title: { fontFamily: FONT.serifLight, fontSize: 38, lineHeight: 44, letterSpacing: 0.3 },
  detailsBox: { padding: 16 },
  detailRow: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  detailKey: { fontFamily: FONT.sansMedium, fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", width: 90 },
  detailVal: { flex: 1, fontFamily: FONT.sansRegular, fontSize: 12, lineHeight: 17, textAlign: "right" },
  desc: { fontFamily: FONT.sansRegular, fontSize: 13, lineHeight: 21 },
  actions: { flexDirection: "row", gap: 10 },
  calBtn:     { width: "100%", flexDirection: "row", gap: 10, alignItems: "center", justifyContent: "center", paddingVertical: 15, marginTop: 4 },
  calBtnText: { fontFamily: FONT.sansMedium, fontSize: 14, letterSpacing: 0.2 },
});

// ── Event Row ─────────────────────────────────────────────────────────────────

function EventRow({ event, onPress, spotsLeftLabel, spotLeftLabel }: { event: Event; onPress: () => void; spotsLeftLabel: string; spotLeftLabel: string; }) {
  const { theme, isDark } = useTheme();
  const { t } = useLanguage();
  const isFull   = event.spotsLeft === 0;
  const isUrgent = !isFull && event.spotsLeft <= 5;

  const spotsText = event.spotsLeft === 1 ? spotLeftLabel : spotsLeftLabel;

  return (
    <TouchableOpacity
      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress(); }}
      activeOpacity={0.72}
      style={styles.eventRow}
    >
      {/* Time column */}
      <View style={styles.timeCol}>
        <Text style={[styles.timeText, { color: theme.muted }]}>{event.time.split("–")[0].trim()}</Text>
      </View>

      {/* Timeline */}
      <View style={styles.timelineCol}>
        <View style={[styles.timelineDot, { backgroundColor: event.rsvpd ? theme.text : theme.border, borderColor: theme.text }]} />
        <View style={[styles.timelineLine, { backgroundColor: theme.border }]} />
      </View>

      {/* Content */}
      <View style={styles.eventContent}>
        <View style={styles.eventTopRow}>
          <View style={[styles.formatPill, { backgroundColor: theme.fill, borderRadius: RADIUS.pill }]}>
            <Text style={[styles.formatPillText, { color: theme.muted }]}>{event.format}</Text>
          </View>
          {event.rsvpd && (
            <View style={[styles.rsvpdPill, { backgroundColor: theme.invertBg, borderRadius: RADIUS.pill }]}>
              <Image source={isDark ? LOGO_BLACK : LOGO_WHITE} style={styles.rsvpdIcon} resizeMode="contain" />
              <Text style={[styles.rsvpdText, { color: theme.invertText }]}>{t.goingLabel}</Text>
            </View>
          )}
        </View>
        <Text style={[styles.eventTitle, { color: theme.text }]}>{event.title}</Text>
        <Text style={[styles.eventSub, { color: theme.muted }]}>{event.location}</Text>
        {!isFull ? (
          <Text style={[styles.spotsText, { color: isUrgent ? theme.text : theme.muted, opacity: isUrgent ? 1 : 0.5 }]}>
            {isUrgent ? `${t.onlyLabel} ${event.spotsLeft} ${spotsText}` : `${event.spotsLeft} ${spotsText}`}
          </Text>
        ) : (
          <Text style={[styles.spotsText, { color: theme.muted, opacity: 0.35 }]}>{t.capacityFull}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────

export default function EventsScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t, fc } = useLanguage();

  const today = new Date();
  const [calYear, setCalYear]   = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [events, setEvents]     = useState(EVENTS);
  const [rsvpEvent, setRsvpEvent] = useState<Event | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleSelectDate = (date: string) => {
    setSelectedDate((prev) => (prev === date ? null : date));
  };

  const handleMonthChange = (y: number, m: number) => { setCalYear(y); setCalMonth(m); };

  const handleConfirmRSVP = (id: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, rsvpd: true, spotsLeft: Math.max(0, e.spotsLeft - 1) } : e))
    );
  };

  const displayedEvents = selectedDate
    ? events.filter((e) => e.date === selectedDate)
    : events.filter((e) => {
        const [ey, em] = e.date.split("-").map(Number);
        return ey === calYear && em - 1 === calMonth;
      });

  const rsvpdCount = events.filter((e) => e.rsvpd).length;

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 90 }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.muted} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Label>{t.eventPrivate}</Label>
            <Text style={[styles.heading, { color: theme.text, fontFamily: fc.serifFamily, fontSize: fc.hs(48), lineHeight: fc.hl(fc.hs(48)) }]}>{t.events}</Text>
          </View>
          {rsvpdCount > 0 && (
            <View style={[styles.attendingPill, { backgroundColor: theme.fill, borderRadius: RADIUS.pill }]}>
              <Text style={[styles.attendingText, { color: theme.muted }]}>✦ {rsvpdCount} {t.rsvpd}</Text>
            </View>
          )}
        </View>

        {/* Calendar */}
        <Calendar
          year={calYear}
          month={calMonth}
          selectedDate={selectedDate}
          onSelectDate={handleSelectDate}
          onMonthChange={handleMonthChange}
          monthNames={t.months}
          dayLetters={t.dayLetters}
        />

        {/* Events list */}
        <View style={styles.listSection}>
          <Label bright>
            {selectedDate
              ? new Date(selectedDate + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long" })
              : t.months[calMonth]}
          </Label>

          {displayedEvents.length === 0 ? (
            <View style={styles.empty}>
              <Text style={[styles.emptyText, { color: theme.muted }]}>
                {selectedDate ? t.noEventsOnDate : t.noEventsThisMonth}
              </Text>
            </View>
          ) : (
            displayedEvents.map((event, idx) => (
              <View key={event.id}>
                {idx > 0 && <View style={{ height: 8 }} />}
                <EventRow event={event} onPress={() => setRsvpEvent(event)} spotsLeftLabel={t.spotsLeft} spotLeftLabel={t.spotLeft} />
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <RSVPModal
        event={rsvpEvent}
        onClose={() => setRsvpEvent(null)}
        onConfirm={handleConfirmRSVP}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: { paddingHorizontal: 20, gap: 24 },
  header: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  heading: { lineHeight: 56, letterSpacing: 0.5, marginTop: 8 },
  attendingPill: { paddingHorizontal: 12, paddingVertical: 8, marginTop: 14 },
  attendingText: { fontFamily: FONT.sansMedium, fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase" },
  listSection: { gap: 4 },
  eventRow: { flexDirection: "row", alignItems: "flex-start", paddingVertical: 4 },
  timeCol: { width: 54, paddingTop: 6 },
  timeText: { fontFamily: FONT.sansRegular, fontSize: 11, letterSpacing: 0.2 },
  timelineCol: { width: 20, alignItems: "center", paddingTop: 7 },
  timelineDot: { width: 8, height: 8, borderRadius: 4, borderWidth: StyleSheet.hairlineWidth },
  timelineLine: { width: StyleSheet.hairlineWidth, flex: 1, marginTop: 4, minHeight: 60 },
  eventContent: { flex: 1, paddingLeft: 12, paddingBottom: 20, gap: 5 },
  eventTopRow: { flexDirection: "row", gap: 6, marginBottom: 2 },
  formatPill: { paddingHorizontal: 10, paddingVertical: 5 },
  formatPillText: { fontFamily: FONT.sansMedium, fontSize: 8, letterSpacing: 1.5, textTransform: "uppercase" },
  rsvpdPill: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 5 },
  rsvpdIcon: { width: 10, height: 10 },
  rsvpdText: { fontFamily: FONT.sansMedium, fontSize: 8, letterSpacing: 1.5, textTransform: "uppercase" },
  eventTitle: { fontFamily: FONT.serifLight, fontSize: 20, letterSpacing: 0.2, lineHeight: 25 },
  eventSub: { fontFamily: FONT.sansRegular, fontSize: 11, lineHeight: 16 },
  spotsText: { fontFamily: FONT.sansMedium, fontSize: 9, letterSpacing: 1, textTransform: "uppercase", marginTop: 2 },
  empty: { paddingVertical: 32, alignItems: "center" },
  emptyText: { fontFamily: FONT.sansRegular, fontSize: 12 },
});
