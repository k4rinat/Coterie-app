import React, { useState } from "react";
import {
  View, Text, Image, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, FlatList,
} from "react-native";
import AppSwitch from "@/components/AppSwitch";
import AppModal from "@/components/AppModal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/contexts/LanguageContext";
import { FONT, RADIUS, SHADOW } from "@/constants/Colors";
import Card from "@/components/Card";
import Label from "@/components/Label";
import Divider from "@/components/Divider";
import Button from "@/components/Button";
import * as ImagePicker from "expo-image-picker";

const LOGO_BLACK = require("@/assets/logo-mark.png");
const LOGO_WHITE = require("@/assets/logo-mark-white.png");

// ── Static Data ───────────────────────────────────────────────────────────────

const INITIAL_CREDITS = [
  { id: "1", role: "Senior Stylist",  entity: "British Vogue",               year: "2024" },
  { id: "2", role: "Creative Lead",   entity: "Bottega Veneta SS24 Campaign", year: "2024" },
  { id: "3", role: "Stylist",         entity: "W Magazine",                   year: "2023" },
  { id: "4", role: "Consultant",      entity: "Toteme Brand Relaunch",        year: "2023" },
  { id: "5", role: "Head Stylist",    entity: "Miu Miu Resort 2023",          year: "2022" },
];

const BADGES = [
  { id: "1", icon: "✦", name: "Elite Member",       desc: "Top-tier verified professional with 10+ years documented experience.",         granted: "March 2024",    active: true  },
  { id: "2", icon: "◈", name: "Brand Collaborator", desc: "Verified collaborations with three or more luxury fashion houses.",             granted: "January 2024",  active: true  },
  { id: "3", icon: "◇", name: "Vogue Circle",       desc: "Featured contributor or subject in an international Vogue edition.",           granted: "August 2023",   active: true  },
  { id: "4", icon: "◉", name: "Editorial Voice",    desc: "Published contributor to a Tier 1 international fashion publication.",         granted: "Pending",       active: false },
  { id: "5", icon: "▶", name: "Runway Alum",        desc: "Credited contribution to five or more international runway productions.",      granted: "Pending",       active: false },
  { id: "6", icon: "⊕", name: "Connector",          desc: "Facilitated ten or more successful introductions within the Coterie network.", granted: "Pending",       active: false },
  { id: "7", icon: "▪", name: "House Insider",      desc: "Verified in-house employment or residency at a luxury fashion house.",         granted: "Pending",       active: false },
  { id: "8", icon: "●", name: "Event Host",         desc: "Co-hosted or hosted a verified Coterie private event or members' gathering.", granted: "Pending",  active: false },
];


const ALL_HOUSES = [
  "Chanel", "Dior", "Louis Vuitton", "Guerlain", "Givenchy", "Celine", "Loewe", "Fendi",
  "Valentino", "Tom Ford", "Alexander McQueen", "Burberry", "Balenciaga", "Bottega Veneta",
  "Balmain", "Saint Laurent", "Gucci", "Prada", "Miu Miu", "Dolce & Gabbana", "Versace",
  "Giorgio Armani", "Emporio Armani", "Hermès", "Loro Piana", "Brunello Cucinelli",
];

const FAQ_ITEMS = [
  // Membership & Eligibility
  { q: "Who can apply to Coterie?", a: "Coterie is open to fashion creatives at all career stages — from emerging talent to established directors. Whether you are two years into your career or twenty, we review every application on the quality of your work, your professional conduct, and your relevance to the network. There is no seniority threshold." },
  { q: "How does the verification process work?", a: "Once you apply, the Coterie team manually reviews your application. This includes verifying your professional identity, cross-referencing your credited work against primary sources, and speaking with at least one reference. The process typically takes 5–10 business days. You will be notified by email at each stage." },
  { q: "Can I apply if I am based outside London?", a: "Yes. Coterie is headquartered in London and the majority of opportunities are UK-based, but membership is open to creatives across the UK. A small number of remote and international opportunities are also listed. We are building toward a broader geographic presence over time." },
  { q: "Is membership guaranteed after applying?", a: "No. Coterie operates a selective admissions process. Applications are reviewed individually and not all applicants are accepted. If your application is not successful at this time, you are welcome to reapply in a future intake. Feedback is not provided on unsuccessful applications." },
  { q: "Can I apply on behalf of a team or agency?", a: "Membership is individual. Each Coterie member represents themselves, not an employer or agency. If multiple people from the same team wish to join, each must apply separately and be verified in their own right." },
  // Opportunities & Introductions
  { q: "How do I request an introduction?", a: "Go to Introductions → tap 'Request Intro' and provide the name, brand, and a brief context note. Our team will facilitate the connection within 3–5 business days." },
  { q: "How does the job board work?", a: "Coterie's private job board is only accessible to verified members. Roles are posted directly by approved brand accounts — they are not scraped from external sources. When you express interest in an opportunity, the Coterie team facilitates the introduction. You are never cold-applying; the context of the network travels with you." },
  { q: "Will I be sent irrelevant opportunities?", a: "No. Opportunity matching is handled by the Coterie team, who review your profile, specialisms, and availability before surfacing relevant roles. You will only receive invitations to opportunities we believe are a genuine fit." },
  { q: "What happens after I express interest in a role?", a: "The Coterie team reviews your expression of interest alongside your verified profile and introduces you to the brand directly. We provide context on both sides of the introduction. Response times are typically 3–5 business days." },
  { q: "Can brands contact me directly?", a: "No. All contact is mediated through Coterie. Brands cannot message members directly, access contact details, or initiate unsolicited outreach. Every introduction is facilitated by a member of the Coterie team." },
  { q: "How are introductions facilitated?", a: "All introductions are reviewed by the Coterie team before being sent. We ensure context is appropriate on both sides before making the connection." },
  { q: "Can I attend Coterie events?", a: "Yes, all events are open to active members. RSVP early as spots are strictly limited and fill quickly." },
  // Privacy & Data
  { q: "Who can see my profile?", a: "By default, your profile is visible only to verified brand accounts on the platform. You can further restrict visibility in your Privacy Controls — including turning off brand visibility entirely. Your profile is never indexed by search engines." },
  { q: "Can I control what appears on my profile?", a: "Yes. You control which credits are shown, whether your availability is visible, and whether you accept introduction requests. Verified badges are awarded by Coterie and cannot be edited, but all other profile content is managed by you." },
  { q: "How do I delete my account?", a: "You can cancel your membership from Me → Settings → Account. Cancelling deactivates your profile and pauses your access, but your account and data are fully retained. You can return and reactivate at any time. If you wish to permanently delete your account and all associated data, you can request this from the Privacy Controls tab." },
  { q: "Is my data shared with third parties?", a: "No. Coterie does not sell, rent, or share member data with third parties. Your information is used solely to operate the network and facilitate introductions between members and approved brand accounts." },
  // Account & Settings
  { q: "How do I update my profile?", a: "Go to Me → Portfolio tab → tap 'Edit Profile' to update your name, title, and bio. Use the '+' button to add credits." },
  { q: "How do I update my membership manager?", a: "Contact your membership manager directly via hello@coterie.com or through the Contact Support form in Settings." },
  { q: "How often are new roles posted?", a: "New roles are typically added weekly. You will receive a notification whenever a new role matches your profile." },
];

// ── Add Credit Modal ──────────────────────────────────────────────────────

function AddCreditModal({ visible, onClose, onAdd }: {
  visible: boolean; onClose: () => void; onAdd: (role: string, entity: string, year: string) => void;
}) {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [role, setRole] = useState("");
  const [entity, setEntity] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const handleClose = () => { setRole(""); setEntity(""); setYear(new Date().getFullYear().toString()); onClose(); };
  const handleAdd = () => {
    if (!role.trim() || !entity.trim()) return;
    onAdd(role.trim(), entity.trim(), year.trim()); handleClose();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };
  return (
    <AppModal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <View style={[ac.root, { backgroundColor: theme.bg }]}>
        <View style={ac.header}><View style={[ac.handle, { backgroundColor: theme.border }]} />
          <TouchableOpacity onPress={handleClose} style={ac.closeBtn} activeOpacity={0.6}>
            <View style={[ac.closeCircle, { backgroundColor: theme.fill }]}><Feather name="x" size={14} color={theme.muted} /></View>
          </TouchableOpacity>
        </View>
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={ac.content}>
            <Label>{t.addToPortfolio}</Label>
            <Text style={[ac.heading, { color: theme.text }]}>{t.addCreditTitle}</Text>
            <View style={ac.fields}>
              {[[t.yourRole, t.rolePlaceholder, role, setRole, "default" as const],
                [t.brandOrPublication, t.brandPlaceholder, entity, setEntity, "default" as const],
                [t.year, "2024", year, setYear, "number-pad" as const]].map(([lbl, ph, val, set, kbType], i) => (
                <View key={i} style={ac.field}>
                  <Label>{lbl as string}</Label>
                  <TextInput style={[ac.input, { color: theme.text, backgroundColor: theme.surface, borderRadius: RADIUS.md }]}
                    value={val as string} onChangeText={set as any} placeholder={ph as string} placeholderTextColor={theme.dim}
                    selectionColor={theme.text} keyboardType={kbType as any} maxLength={kbType === "number-pad" ? 4 : undefined} />
                </View>
              ))}
            </View>
            <View style={ac.actions}>
              <Button label={t.cancel} variant="ghost" onPress={handleClose} style={{ flex: 1 }} />
              <Button label={t.addCreditBtn} onPress={handleAdd} style={{ flex: 1 }} />
            </View>
          </View>
        </ScrollView>
      </View>
    </AppModal>
  );
}

const ac = StyleSheet.create({
  root: { flex: 1 }, header: { alignItems: "center", paddingTop: 14, paddingBottom: 12, paddingHorizontal: 20, position: "relative" },
  handle: { width: 36, height: 4, borderRadius: 2 }, closeBtn: { position: "absolute", right: 20, top: 10, padding: 4 },
  closeCircle: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  content: { padding: 28, gap: 24 }, heading: { fontFamily: FONT.serifLight, fontSize: 38, lineHeight: 44, letterSpacing: 0.3 },
  fields: { gap: 18 }, field: { gap: 8 },
  input: { fontFamily: FONT.sansRegular, fontSize: 13, paddingHorizontal: 14, paddingVertical: 14 },
  actions: { flexDirection: "row", gap: 10 },
});

// ── Doc Modal ─────────────────────────────────────────────────────────────────

function DocModal({ title, label, body, visible, onClose }: { title: string; label?: string; body: string; visible: boolean; onClose: () => void }) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <AppModal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[doc.root, { backgroundColor: theme.bg }]}>
        <View style={doc.header}><View style={[doc.handle, { backgroundColor: theme.border }]} />
          <TouchableOpacity onPress={onClose} style={doc.closeBtn} activeOpacity={0.6}>
            <View style={[doc.closeCircle, { backgroundColor: theme.fill }]}><Feather name="x" size={14} color={theme.muted} /></View>
          </TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[doc.content, { paddingBottom: insets.bottom + 40 }]}>
          {label && <Label>{label}</Label>}
          <Text style={[doc.title, { color: theme.text }]}>{title}</Text>
          <Text style={[doc.body, { color: theme.muted }]}>{body}</Text>
        </ScrollView>
      </View>
    </AppModal>
  );
}

const doc = StyleSheet.create({
  root: { flex: 1 }, header: { alignItems: "center", paddingTop: 14, paddingBottom: 12, paddingHorizontal: 20, position: "relative" },
  handle: { width: 36, height: 4, borderRadius: 2 }, closeBtn: { position: "absolute", right: 20, top: 10, padding: 4 },
  closeCircle: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  content: { paddingHorizontal: 24, paddingTop: 20, gap: 16 },
  title: { fontFamily: FONT.serifLight, fontSize: 40, lineHeight: 46, letterSpacing: 0.3 },
  body:  { fontFamily: FONT.sansRegular, fontSize: 13, lineHeight: 22 },
});

// ── Legal texts ───────────────────────────────────────────────────────────────

const PRIVACY_TEXT = `Last updated: March 2026

Coterie ("we", "us") operates as a private membership platform for luxury fashion professionals. This Privacy Policy describes how we collect, use, and protect your personal data when you use our iOS and Android applications.

What we collect
We collect the information you provide when applying for membership or creating your profile: name, email address, professional history, and portfolio credits. When you use the app, we collect usage data such as which screens you visit and how you interact with introductions and role listings. We do not collect financial data directly — payment is processed via our web portal.

How we use your data
Your profile information is shown to other verified Coterie members and to brands searching for talent within the network. We use your usage data to improve the app experience and to surface more relevant role matches and introductions.

Data sharing
We do not sell your data to third parties. We may share your professional profile with brands actively recruiting through Coterie, with your consent (expressed through the visibility settings in Me → Settings). We use industry-standard analytics services to understand app performance.

Your rights
You may request access to, correction of, or deletion of your personal data at any time by contacting your membership manager or writing to privacy@coterie.com. You may also delete your account directly from Me → Settings → Account.

Data retention
We retain your data for as long as your account is active. If you delete your account, your data is removed within 30 days, except where required by applicable law.

Contact
For privacy-related enquiries: privacy@coterie.com`;

const TERMS_TEXT = `Last updated: March 2026

These Terms of Service govern your use of the Coterie mobile application. By using the app, you agree to these terms.

Membership
Coterie is a private, invitation-only network. Membership is subject to vetting and approval by the Coterie committee. We reserve the right to revoke membership at any time for conduct that violates these terms or the Community Guidelines.

Platform use
The app and its contents — introductions, role listings, event details, member profiles — are for your personal professional use only. You may not reproduce, distribute, or commercialise any content from the platform without our written consent.

Introductions
Introductions facilitated through Coterie are provided in good faith. We do not guarantee employment outcomes or the accuracy of any member's self-reported credentials. Members are responsible for conducting their own due diligence.

Roles and opportunities
Role listings on the platform are provided by third-party brands and employers. Coterie does not act as an employment agency and is not party to any employment contract formed through the platform.

Subscriptions
Membership subscriptions are billed annually. Cancellation requests must be made at least 7 days before renewal. Refunds are not provided for partial subscription periods.

Limitation of liability
To the maximum extent permitted by law, Coterie shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform.

Contact
For queries about these terms: hello@coterie.com`;

const COMMUNITY_TEXT = `Last updated: March 2026

Coterie exists because the luxury fashion industry deserves a private, high-trust professional network. These Community Guidelines exist to maintain that standard.

Conduct
Members are expected to engage with one another with professionalism and discretion. Information shared in the context of introductions, events, or direct correspondence should be treated as confidential unless explicitly stated otherwise.

Introductions
Accepting an introduction carries a responsibility to respond within a reasonable timeframe (we suggest five business days). Members who consistently ignore or decline introductions without notice may have their access reviewed.

Roles and opportunities
Brands who list roles on Coterie agree to respond to expressions of interest within 14 days. Members who express interest in a role represent that their profile information is accurate and up to date.

Events
Coterie events are private gatherings. Conversations, attendee lists, and content from events may not be shared publicly without the explicit consent of all parties involved. Photography at events is subject to specific guidance communicated in each event invitation.

Prohibited conduct
The following will result in immediate membership suspension: misrepresenting your credentials or identity; sharing another member's personal information without consent; using the platform for unsolicited commercial solicitation; engaging in discriminatory, harassing, or abusive conduct toward any member.

Reporting
If you encounter conduct that violates these guidelines, contact your membership manager or write to safety@coterie.com. All reports are handled confidentially.`;

// ── Change Email Modal ────────────────────────────────────────────────────────

function ChangeEmailModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [newEmail, setNewEmail] = useState("");
  const [done, setDone] = useState(false);
  const [resent, setResent] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const handleClose = () => { setNewEmail(""); setDone(false); setResent(false); setEmailError(false); onClose(); };
  const handleSubmit = () => {
    if (!newEmail.trim() || !newEmail.includes("@") || !newEmail.includes(".")) {
      setEmailError(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    setEmailError(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setDone(true);
  };
  const handleResend = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setResent(true);
    setTimeout(() => setResent(false), 3000);
  };
  return (
    <AppModal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <View style={[fm.root, { backgroundColor: theme.bg }]}>
        <View style={fm.header}><View style={[fm.handle, { backgroundColor: theme.border }]} />
          <TouchableOpacity onPress={handleClose} style={fm.closeBtn} activeOpacity={0.6}>
            <View style={[fm.closeCircle, { backgroundColor: theme.fill }]}><Feather name="x" size={14} color={theme.muted} /></View>
          </TouchableOpacity>
        </View>
        <View style={fm.content}>
          <Label>{t.account}</Label>
          <Text style={[fm.heading, { color: theme.text }]}>{t.changeEmailTitle}</Text>
          {done ? (
            <View style={fm.sentBlock}>
              <View style={[fm.sentIcon, { backgroundColor: theme.fill, borderRadius: RADIUS.pill }]}>
                <Feather name="mail" size={20} color={theme.text} />
              </View>
              <Text style={[fm.sentHeading, { color: theme.text }]}>{t.checkYourInbox}</Text>
              <Text style={[fm.sentSub, { color: theme.muted }]}>{t.codeArrivesDesc.replace("{email}", newEmail)}</Text>
              <Text style={[fm.sentSub, { color: theme.dim, marginTop: 4 }]}>{t.onceVerifiedDesc}</Text>
              <TouchableOpacity onPress={handleResend} activeOpacity={0.6} style={{ marginTop: 8 }}>
                <Text style={[fm.resendText, { color: resent ? theme.dim : theme.muted }]}>
                  {resent ? t.codeResent : t.didntReceive}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={fm.field}>
                <Label>{t.newEmailAddress}</Label>
                <TextInput
                  style={[fm.input, { color: theme.text, backgroundColor: theme.surface, borderRadius: RADIUS.md, borderWidth: emailError ? 1 : 0, borderColor: emailError ? "#c0392b" : "transparent" }]}
                  value={newEmail} onChangeText={(v) => { setNewEmail(v); if (emailError) setEmailError(false); }}
                  placeholder="you@example.com"
                  placeholderTextColor={theme.dim} keyboardType="email-address" autoCapitalize="none"
                  selectionColor={theme.text}
                />
                {emailError && (
                  <Text style={{ fontFamily: FONT.sansRegular, fontSize: 11, color: "#c0392b", marginTop: 4 }}>
                    {t.errInvalidEmail}
                  </Text>
                )}
              </View>
              <Button label={t.sendVerification} onPress={handleSubmit} fullWidth />
            </>
          )}
          <Button label={done ? t.done : t.cancel} variant="ghost" onPress={handleClose} fullWidth style={{ marginTop: 8 }} />
        </View>
      </View>
    </AppModal>
  );
}

// ── Change Password Modal ─────────────────────────────────────────────────────

function ChangePasswordModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [current, setCurrent]   = useState("");
  const [newPass, setNewPass]   = useState("");
  const [confirm, setConfirm]   = useState("");
  const [done, setDone]         = useState(false);
  const [error, setError]       = useState("");
  const handleClose = () => { setCurrent(""); setNewPass(""); setConfirm(""); setDone(false); setError(""); onClose(); };
  const handleSubmit = () => {
    setError("");
    if (!current) { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); setError(t.errEnterCurrentPassword); return; }
    if (newPass.length < 8) { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); setError(t.errPasswordTooShort); return; }
    if (newPass !== confirm) { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); setError(t.errPasswordsMustMatch); return; }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setDone(true);
  };
  return (
    <AppModal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <View style={[fm.root, { backgroundColor: theme.bg }]}>
        <View style={fm.header}><View style={[fm.handle, { backgroundColor: theme.border }]} />
          <TouchableOpacity onPress={handleClose} style={fm.closeBtn} activeOpacity={0.6}>
            <View style={[fm.closeCircle, { backgroundColor: theme.fill }]}><Feather name="x" size={14} color={theme.muted} /></View>
          </TouchableOpacity>
        </View>
        <View style={fm.content}>
          <Label>{t.account}</Label>
          <Text style={[fm.heading, { color: theme.text }]}>{t.changePasswordTitle}</Text>
          {done ? (
            <View style={fm.sentBlock}>
              <View style={[fm.sentIcon, { backgroundColor: theme.fill, borderRadius: RADIUS.pill }]}>
                <Feather name="check" size={20} color={theme.text} />
              </View>
              <Text style={[fm.sentHeading, { color: theme.text }]}>{t.passwordUpdated}</Text>
              <Text style={[fm.sentSub, { color: theme.muted }]}>{t.passwordUpdatedDesc}</Text>
            </View>
          ) : (
            <>
              {[
                [t.currentPassword, current, setCurrent],
                [t.newPasswordLabel, newPass, setNewPass],
                [t.confirmNewPassword, confirm, setConfirm],
              ].map(([label, val, setter], i) => (
                <View key={i} style={fm.field}>
                  <Label>{label as string}</Label>
                  <TextInput
                    style={[fm.input, { color: theme.text, backgroundColor: theme.surface, borderRadius: RADIUS.md }]}
                    value={val as string} onChangeText={(v) => { (setter as any)(v); setError(""); }}
                    placeholder="••••••••" placeholderTextColor={theme.dim}
                    secureTextEntry selectionColor={theme.text}
                  />
                </View>
              ))}
              {!!error && (
                <View style={[fm.errorBox, { backgroundColor: theme.fill, borderRadius: RADIUS.sm }]}>
                  <Feather name="alert-circle" size={13} color={theme.muted} />
                  <Text style={[fm.errorText, { color: theme.muted }]}>{error}</Text>
                </View>
              )}
              <Button label={t.updatePassword} onPress={handleSubmit} fullWidth />
            </>
          )}
          <Button label={done ? t.done : t.cancel} variant="ghost" onPress={handleClose} fullWidth style={{ marginTop: 8 }} />
        </View>
      </View>
    </AppModal>
  );
}

const fm = StyleSheet.create({
  root: { flex: 1 }, header: { alignItems: "center", paddingTop: 14, paddingBottom: 12, paddingHorizontal: 20, position: "relative" },
  handle: { width: 36, height: 4, borderRadius: 2 }, closeBtn: { position: "absolute", right: 20, top: 10, padding: 4 },
  closeCircle: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  content: { padding: 28, gap: 20 },
  heading: { fontFamily: FONT.serifLight, fontSize: 38, lineHeight: 44, letterSpacing: 0.3, marginBottom: 4 },
  field: { gap: 8 },
  input: { fontFamily: FONT.sansRegular, fontSize: 13, paddingHorizontal: 14, paddingVertical: 14 },
  confirmation: { padding: 20, gap: 10 },
  confirmText: { fontFamily: FONT.sansMedium, fontSize: 13, letterSpacing: 0.2 },
  confirmSub:  { fontFamily: FONT.sansRegular, fontSize: 13, lineHeight: 20 },
  // Sent / success block (email + password modals)
  sentBlock:   { alignItems: "center", gap: 12, paddingTop: 8, paddingBottom: 8 },
  sentIcon:    { width: 52, height: 52, alignItems: "center", justifyContent: "center" },
  sentHeading: { fontFamily: FONT.serifLight, fontSize: 28, lineHeight: 34, letterSpacing: 0.2, textAlign: "center" },
  sentSub:     { fontFamily: FONT.sansRegular, fontSize: 13, lineHeight: 21, textAlign: "center" },
  resendText:  { fontFamily: FONT.sansMedium, fontSize: 13, letterSpacing: 0.2, textDecorationLine: "underline" },
  // Inline error (password modal)
  errorBox:    { flexDirection: "row", alignItems: "center", gap: 8, padding: 12 },
  errorText:   { fontFamily: FONT.sansRegular, fontSize: 13, lineHeight: 18, flex: 1 },
});

// ── Manage Houses Modal ───────────────────────────────────────────────────────

function ManageHousesModal({ visible, onClose, followed, onToggle }: {
  visible: boolean; onClose: () => void; followed: string[]; onToggle: (h: string) => void;
}) {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  return (
    <AppModal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[mh.root, { backgroundColor: theme.bg }]}>
        <View style={mh.header}><View style={[mh.handle, { backgroundColor: theme.border }]} />
          <TouchableOpacity onPress={onClose} style={mh.closeBtn} activeOpacity={0.6}>
            <View style={[mh.closeCircle, { backgroundColor: theme.fill }]}><Feather name="x" size={14} color={theme.muted} /></View>
          </TouchableOpacity>
        </View>
        <View style={{ paddingHorizontal: 24, paddingBottom: 12, gap: 4 }}>
          <Label>{t.eloiPreferences}</Label>
          <Text style={[mh.heading, { color: theme.text }]}>{t.fashionHousesTitle}</Text>
          <Text style={[mh.sub, { color: theme.muted }]}>{t.eloiSurfacesDesc}</Text>
        </View>
        <FlatList
          data={ALL_HOUSES}
          keyExtractor={h => h}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 40, paddingHorizontal: 20 }}
          ItemSeparatorComponent={() => <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: theme.border }} />}
          renderItem={({ item }) => {
            const active = followed.includes(item);
            return (
              <TouchableOpacity
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onToggle(item); }}
                activeOpacity={0.7}
                style={mh.row}
              >
                <Text style={[mh.houseName, { color: active ? theme.text : theme.muted }]}>{item}</Text>
                {active && <Feather name="check" size={14} color={theme.text} />}
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </AppModal>
  );
}

const mh = StyleSheet.create({
  root: { flex: 1 }, header: { alignItems: "center", paddingTop: 14, paddingBottom: 12, paddingHorizontal: 20, position: "relative" },
  handle: { width: 36, height: 4, borderRadius: 2 }, closeBtn: { position: "absolute", right: 20, top: 10, padding: 4 },
  closeCircle: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  heading: { fontFamily: FONT.serifLight, fontSize: 36, lineHeight: 40, letterSpacing: 0.3 },
  sub:  { fontFamily: FONT.sansRegular, fontSize: 13, lineHeight: 20 },
  row:  { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 14 },
  houseName: { fontFamily: FONT.sansRegular, fontSize: 14 },
});

// ── FAQ Modal ─────────────────────────────────────────────────────────────────

function FAQModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState<number | null>(null);
  return (
    <AppModal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[doc.root, { backgroundColor: theme.bg }]}>
        <View style={doc.header}><View style={[doc.handle, { backgroundColor: theme.border }]} />
          <TouchableOpacity onPress={onClose} style={doc.closeBtn} activeOpacity={0.6}>
            <View style={[doc.closeCircle, { backgroundColor: theme.fill }]}><Feather name="x" size={14} color={theme.muted} /></View>
          </TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}>
          <View style={{ paddingHorizontal: 24, paddingTop: 12, paddingBottom: 20, gap: 4 }}>
            <Label>{t.helpAndSupport}</Label>
            <Text style={[doc.title, { color: theme.text }]}>{t.faq}</Text>
          </View>
          {FAQ_ITEMS.map((item, i) => (
            <View key={i} style={{ borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.border }}>
              <TouchableOpacity
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setOpen(open === i ? null : i); }}
                activeOpacity={0.7}
                style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, paddingVertical: 16, gap: 16 }}
              >
                <Text style={[{ fontFamily: FONT.sansMedium, fontSize: 13, flex: 1, lineHeight: 20 }, { color: theme.text }]}>{item.q}</Text>
                <Feather name={open === i ? "chevron-up" : "chevron-down"} size={14} color={theme.muted} />
              </TouchableOpacity>
              {open === i && (
                <View style={{ paddingHorizontal: 24, paddingBottom: 16 }}>
                  <Text style={[{ fontFamily: FONT.sansRegular, fontSize: 13, lineHeight: 21 }, { color: theme.muted }]}>{item.a}</Text>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    </AppModal>
  );
}

// ── Contact Support Modal ─────────────────────────────────────────────────────

function ContactSupportModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const handleClose = () => { setMessage(""); setSent(false); onClose(); };
  const handleSend = () => {
    if (!message.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSent(true);
  };
  return (
    <AppModal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <View style={[fm.root, { backgroundColor: theme.bg }]}>
        <View style={fm.header}><View style={[fm.handle, { backgroundColor: theme.border }]} />
          <TouchableOpacity onPress={handleClose} style={fm.closeBtn} activeOpacity={0.6}>
            <View style={[fm.closeCircle, { backgroundColor: theme.fill }]}><Feather name="x" size={14} color={theme.muted} /></View>
          </TouchableOpacity>
        </View>
        <View style={fm.content}>
          <Label>{t.helpAndSupport}</Label>
          <Text style={[fm.heading, { color: theme.text }]}>{t.contactSupportTitle}</Text>
          {sent ? (
            <View style={[fm.confirmation, { backgroundColor: theme.fill, borderRadius: RADIUS.md }]}>
              <Text style={[fm.confirmText, { color: theme.text }]}>{t.messageSent}</Text>
              <Text style={[fm.confirmSub, { color: theme.muted }]}>{t.memberManagerResponseDesc}</Text>
            </View>
          ) : (
            <>
              <Text style={[{ fontFamily: FONT.sansRegular, fontSize: 13, lineHeight: 20 }, { color: theme.muted }]}>{t.memberManagerDesc}</Text>
              <View style={fm.field}>
                <Label>{t.yourMessage}</Label>
                <TextInput
                  style={[fm.input, { color: theme.text, backgroundColor: theme.surface, borderRadius: RADIUS.md, height: 120, textAlignVertical: "top" }]}
                  value={message} onChangeText={setMessage} placeholder={t.howCanWeHelp}
                  placeholderTextColor={theme.dim} multiline selectionColor={theme.text}
                />
              </View>
              <Button label={t.sendMessage} onPress={handleSend} fullWidth />
            </>
          )}
          <Button label={sent ? t.close : t.cancel} variant="ghost" onPress={handleClose} fullWidth style={{ marginTop: 8 }} />
        </View>
      </View>
    </AppModal>
  );
}

// ── Report Bug Modal ──────────────────────────────────────────────────────────

function ReportBugModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [title, setTitle]   = useState("");
  const [desc, setDesc]     = useState("");
  const [sent, setSent]     = useState(false);
  const handleClose = () => { setTitle(""); setDesc(""); setSent(false); onClose(); };
  const handleSend = () => {
    if (!title.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSent(true);
  };
  return (
    <AppModal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <View style={[fm.root, { backgroundColor: theme.bg }]}>
        <View style={fm.header}><View style={[fm.handle, { backgroundColor: theme.border }]} />
          <TouchableOpacity onPress={handleClose} style={fm.closeBtn} activeOpacity={0.6}>
            <View style={[fm.closeCircle, { backgroundColor: theme.fill }]}><Feather name="x" size={14} color={theme.muted} /></View>
          </TouchableOpacity>
        </View>
        <View style={fm.content}>
          <Label>{t.helpAndSupport}</Label>
          <Text style={[fm.heading, { color: theme.text }]}>{t.reportBugTitle}</Text>
          {sent ? (
            <View style={[fm.confirmation, { backgroundColor: theme.fill, borderRadius: RADIUS.md }]}>
              <Text style={[fm.confirmText, { color: theme.text }]}>{t.reportSubmitted}</Text>
              <Text style={[fm.confirmSub, { color: theme.muted }]}>{t.reportThanks}</Text>
            </View>
          ) : (
            <>
              {[[t.issueTitleLabel, title, setTitle, false], [t.descriptionOptional, desc, setDesc, true]].map(([label, val, setter, multi], i) => (
                <View key={i} style={fm.field}>
                  <Label>{label as string}</Label>
                  <TextInput
                    style={[fm.input, { color: theme.text, backgroundColor: theme.surface, borderRadius: RADIUS.md }, (multi as boolean) && { height: 100, textAlignVertical: "top" }]}
                    value={val as string} onChangeText={setter as any}
                    placeholder={i === 0 ? t.issuePlaceholder : t.stepsToReproduce}
                    placeholderTextColor={theme.dim} multiline={multi as boolean} selectionColor={theme.text}
                  />
                </View>
              ))}
              <Button label={t.submitReport} onPress={handleSend} fullWidth />
            </>
          )}
          <Button label={sent ? t.close : t.cancel} variant="ghost" onPress={handleClose} fullWidth style={{ marginTop: 8 }} />
        </View>
      </View>
    </AppModal>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { logout, completeOnboarding } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
  const { startTour } = useOnboarding();
  const { language, setLanguage: setGlobalLanguage, t, fc, LANGUAGES } = useLanguage();

  const [tab, setTab] = useState<"portfolio" | "badges" | "subscription" | "settings">("portfolio");
  const [editing, setEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [name, setName] = useState("Isabelle Fontaine");
  const [title, setTitle] = useState("Senior Stylist & Creative Consultant");
  const [bio, setBio] = useState("Fifteen years shaping the visual language of luxury fashion. From Vogue covers to Valentino campaigns — I work where craft meets culture.");
  const [credits, setCredits] = useState(INITIAL_CREDITS);

  // Settings state
  const [notifications, setNotifications] = useState({ introductions: true, events: true, eloiUpdates: true, weeklyDigest: false });
  const [privacy, setPrivacy] = useState({ profilePublic: false, showLocation: true, showDisciplines: true, allowIntros: true, showAvailability: true, marketingEmails: false });
  const [eloiPrefs, setEloiPrefs] = useState({ fashionNews: true, weeklyDigest: false });
  const [followedHouses, setFollowedHouses] = useState(["Loewe", "Valentino", "Bottega Veneta", "Maison Margiela", "Burberry"]);

  // Modals
  const [deleteModal, setDeleteModal]     = useState(false);
  const [deleteStep, setDeleteStep]       = useState(0);
  const [addCreditModal, setAddCreditModal] = useState(false);
  const [manageSubModal, setManageSubModal] = useState(false);
  const [langModal, setLangModal]         = useState(false);
  const [langScrollY, setLangScrollY]     = useState(0);
  const [langContentH, setLangContentH]   = useState(0);
  const [langViewH, setLangViewH]         = useState(0);
  const [docModal, setDocModal]           = useState<null | "privacy" | "terms" | "community">(null);
  const [changeEmailModal, setChangeEmailModal]   = useState(false);
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [manageHousesModal, setManageHousesModal] = useState(false);
  const [faqModal, setFaqModal]           = useState(false);
  const [contactModal, setContactModal]   = useState(false);
  const [bugModal, setBugModal]           = useState(false);


  const handleLogout = () => { logout(); router.replace("/(auth)/sign-in"); };
  const handleAddCredit = (role: string, entity: string, year: string) => {
    setCredits(prev => [{ id: Date.now().toString(), role, entity, year }, ...prev]);
  };
  const toggleHouse = (h: string) => {
    setFollowedHouses(prev => prev.includes(h) ? prev.filter(x => x !== h) : [...prev, h]);
  };

  const PROFILE_TABS: { key: typeof tab; label: string }[] = [
    { key: "portfolio",    label: t.portfolio },
    { key: "badges",       label: t.badges },
    { key: "subscription", label: t.plan },
    { key: "settings",     label: t.settings },
  ];

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      {/* Fixed header */}
      <View style={[styles.header, { paddingTop: insets.top + 20, backgroundColor: theme.bg }]}>
        <View style={styles.headRow}>
          <Text style={[styles.heading, { fontFamily: fc.serifFamily, fontSize: fc.hs(48), lineHeight: fc.hl(fc.hs(48)), color: theme.text }]}>{t.profileTitle}</Text>
          <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); toggleTheme(); }} activeOpacity={0.6} style={[styles.themeBtn, { backgroundColor: theme.fill, borderRadius: RADIUS.pill }]}>
            <Feather name={isDark ? "sun" : "moon"} size={15} color={theme.muted} />
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
          {PROFILE_TABS.map(t => (
            <TouchableOpacity key={t.key}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setTab(t.key); }}
              style={[styles.tabBtn, tab === t.key && { borderBottomColor: theme.text, borderBottomWidth: 1.5 }]}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, { color: tab === t.key ? theme.text : theme.muted }]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Divider />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 80 }]}>

        {/* ── Portfolio ─────────────────────────────────────────────────────── */}
        {tab === "portfolio" && (
          <View style={styles.tabContent}>
            <Card elevated>
              <View style={styles.profileTop}>
                <TouchableOpacity
                  onPress={async () => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                    if (status !== "granted") return;
                    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.8 });
                    if (!result.canceled && result.assets[0]) { setProfileImage(result.assets[0].uri); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); }
                  }}
                  style={[styles.avatar, { backgroundColor: theme.fill, borderRadius: RADIUS.md, overflow: "hidden" }]}
                  activeOpacity={0.8}
                >
                  {profileImage
                    ? <Image source={{ uri: profileImage }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                    : <Text style={[styles.avatarInitial, { color: theme.text }]}>K</Text>}
                  <View style={[styles.avatarOverlay, { backgroundColor: "rgba(0,0,0,0.30)" }]}>
                    <Feather name="camera" size={14} color="#fff" />
                  </View>
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                  {editing
                    ? <TextInput style={[styles.editName, { color: theme.text, borderBottomColor: theme.border }]} value={name} onChangeText={setName} selectionColor={theme.text} />
                    : <Text style={[styles.profileName, { color: theme.text }]}>{name}</Text>}
                  {editing
                    ? <TextInput style={[styles.editTitle, { color: theme.muted, borderBottomColor: theme.border }]} value={title} onChangeText={setTitle} selectionColor={theme.text} />
                    : <Text style={[styles.profileTitle, { color: theme.muted }]}>{title}</Text>}
                </View>
              </View>
              <Divider style={styles.div} />
              <Label style={{ marginBottom: 8 }}>{t.about}</Label>
              {editing
                ? <TextInput style={[styles.bioInput, { color: theme.muted, backgroundColor: theme.fill, borderRadius: RADIUS.sm }]} value={bio} onChangeText={setBio} multiline selectionColor={theme.text} textAlignVertical="top" />
                : <Text style={[styles.bio, { color: theme.muted }]}>{bio}</Text>}
              <Divider style={styles.div} />
              <TouchableOpacity
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setEditing(!editing); }}
                style={[styles.editBtn, { backgroundColor: theme.fill, borderRadius: RADIUS.md }]} activeOpacity={0.7}
              >
                <Feather name={editing ? "check" : "edit-2"} size={12} color={theme.muted} />
                <Text style={[styles.editBtnText, { color: theme.muted }]}>{editing ? t.saveChanges : t.editProfile}</Text>
              </TouchableOpacity>
            </Card>

            {/* ── Profile completeness nudge ──────────────────────────────── */}
            {(() => {
              const checks = [
                { label: "Profile photo", done: profileImage !== null },
                { label: "Bio", done: bio.trim().length > 30 },
                { label: "Credits", done: credits.length >= 1 },
                { label: "Houses followed", done: followedHouses.length >= 1 },
              ];
              const doneCount = checks.filter(c => c.done).length;
              if (doneCount === checks.length) return null;
              const pct = Math.round((doneCount / checks.length) * 100);
              const pending = checks.filter(c => !c.done);
              return (
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setEditing(true); }}
                  style={[styles.completeness, { backgroundColor: theme.surface, borderRadius: RADIUS.md }]}
                >
                  <View style={styles.completenessTop}>
                    <Label bright>Profile Strength</Label>
                    <Text style={[styles.completenessPct, { color: theme.text }]}>{pct}%</Text>
                  </View>
                  <View style={[styles.completenessTrack, { backgroundColor: theme.fill }]}>
                    <View style={[styles.completenessBar, { backgroundColor: theme.text, width: `${pct}%` as any }]} />
                  </View>
                  <Text style={[styles.completenessTip, { color: theme.muted }]}>
                    {pending.map(c => c.label).join(" · ")} — tap to complete.
                  </Text>
                </TouchableOpacity>
              );
            })()}

            <View style={styles.section}>
              <View style={styles.sectionHead}>
                <Label bright>{t.selectedCredits}</Label>
                <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setAddCreditModal(true); }}
                  style={[styles.addBtn, { backgroundColor: theme.fill, borderRadius: RADIUS.pill }]} activeOpacity={0.7}>
                  <Feather name="plus" size={11} color={theme.muted} />
                  <Text style={[styles.addBtnText, { color: theme.muted }]}>{t.add}</Text>
                </TouchableOpacity>
              </View>
              <Card>
                {credits.map((c, idx) => (
                  <View key={c.id}>
                    {idx > 0 && <Divider />}
                    <View style={styles.creditRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.creditRole, { color: theme.text }]}>{c.role}</Text>
                        <Text style={[styles.creditEntity, { color: theme.muted }]}>{c.entity}</Text>
                      </View>
                      <Text style={[styles.creditYear, { color: theme.dim }]}>{c.year}</Text>
                    </View>
                  </View>
                ))}
              </Card>
            </View>
          </View>
        )}

        {/* ── Badges ────────────────────────────────────────────────────────── */}
        {tab === "badges" && (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <Label bright>{t.activeBadges}</Label>
              <Card>
                {BADGES.filter(b => b.active).map((b, idx, arr) => (
                  <View key={b.id}>
                    {idx > 0 && <Divider />}
                    <View style={styles.badgeRow}>
                      <View style={[styles.badgeIconWrap, { backgroundColor: theme.fill, borderRadius: RADIUS.sm }]}>
                        {b.id === "1"
                          ? <Image source={isDark ? LOGO_WHITE : LOGO_BLACK} style={styles.badgeLogoIcon} resizeMode="contain" />
                          : <Text style={[styles.badgeIcon, { color: theme.text }]}>{b.icon}</Text>}
                      </View>
                      <View style={{ flex: 1, gap: 4 }}>
                        <Text style={[styles.badgeName, { color: theme.text }]}>{t.badgeNames[Number(b.id) - 1] ?? b.name}</Text>
                        <Text style={[styles.badgeDesc, { color: theme.muted }]}>{t.badgeDescs[Number(b.id) - 1] ?? b.desc}</Text>
                        <Text style={[styles.badgeGranted, { color: theme.dim }]}>{t.granted} {b.granted}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </Card>
            </View>

            <View style={styles.section}>
              <Label bright>{t.pendingBadges}</Label>
              <Card>
                {BADGES.filter(b => !b.active).map((b, idx) => (
                  <View key={b.id}>
                    {idx > 0 && <Divider />}
                    <View style={[styles.badgeRow, { opacity: 0.45 }]}>
                      <View style={[styles.badgeIconWrap, { backgroundColor: theme.fill, borderRadius: RADIUS.sm }]}>
                        {b.id === "1"
                          ? <Image source={isDark ? LOGO_WHITE : LOGO_BLACK} style={styles.badgeLogoIcon} resizeMode="contain" />
                          : <Text style={[styles.badgeIcon, { color: theme.text }]}>{b.icon}</Text>}
                      </View>
                      <View style={{ flex: 1, gap: 4 }}>
                        <Text style={[styles.badgeName, { color: theme.text }]}>{t.badgeNames[Number(b.id) - 1] ?? b.name}</Text>
                        <Text style={[styles.badgeDesc, { color: theme.muted }]}>{t.badgeDescs[Number(b.id) - 1] ?? b.desc}</Text>
                        <View style={[styles.pendingPill, { backgroundColor: theme.fill, borderRadius: RADIUS.pill }]}>
                          <Text style={[styles.pendingText, { color: theme.dim }]}>{t.notYetEarned}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </Card>
            </View>
          </View>
        )}

        {/* ── Plan ──────────────────────────────────────────────────────────── */}
        {tab === "subscription" && (
          <View style={styles.tabContent}>
            <Card elevated>
              <Label>{t.currentPlan}</Label>
              <Text style={[styles.planName, { color: theme.text }]}>Elite</Text>
              <Text style={[styles.planTier, { color: theme.muted }]}>{t.annualTier}</Text>
              <View style={[styles.planPriceBadge, { backgroundColor: theme.fill, borderRadius: RADIUS.pill }]}>
                <Text style={[styles.planPrice, { color: theme.text }]}>£1,200</Text>
              </View>
              <Text style={[styles.planPeriod, { color: theme.muted }]}>{t.renewalNote}</Text>
              <Divider style={styles.div} />
              <Label bright style={{ marginBottom: 14 }}>{t.whatsIncluded}</Label>
              {t.planFeatures.map((f, i) => (
                <View key={i} style={styles.featureRow}>
                  <Feather name="check" size={13} color={theme.text} />
                  <Text style={[styles.featureText, { color: theme.muted }]}>{f}</Text>
                </View>
              ))}
              <Divider style={styles.div} />
              <TouchableOpacity
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setManageSubModal(true); }}
                style={[styles.manageBtn, { backgroundColor: theme.invertBg, borderRadius: RADIUS.md }]} activeOpacity={0.7}
              >
                <Text style={[styles.manageBtnText, { color: theme.invertText }]}>{t.manageSubscription}</Text>
              </TouchableOpacity>
            </Card>
            <View style={[styles.subNote, { backgroundColor: theme.fill, borderRadius: RADIUS.md }]}>
              <Feather name="info" size={13} color={theme.muted} style={{ marginTop: 1 }} />
              <Text style={[styles.subNoteText, { color: theme.muted }]}>{t.subUpgradeNote}</Text>
            </View>
          </View>
        )}

        {/* ── Settings ─────────────────────────────────────────────────────── */}
        {tab === "settings" && (
          <View style={styles.tabContent}>

            {/* General */}
            <View style={styles.settingsSection}>
              <Label bright style={styles.settingsSectionLabel}>{t.general}</Label>
              <Card>
                <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setLangModal(true); }}
                  activeOpacity={0.7} style={styles.settingsRow}>
                  <View style={styles.settingsRowLeft}>
                    <Feather name="globe" size={16} color={theme.muted} />
                    <View>
                      <Text style={[styles.settingsRowLabel, { color: theme.text }]}>{t.language}</Text>
                      <Text style={[styles.settingsRowSub, { color: theme.muted }]}>{t.languageDisplay}</Text>
                    </View>
                  </View>
                  <Feather name="chevron-right" size={15} color={theme.dim} />
                </TouchableOpacity>
              </Card>
            </View>

            {/* Notifications */}
            <View style={styles.settingsSection}>
              <Label bright style={styles.settingsSectionLabel}>{t.notifications}</Label>
              <Card>
                {[
                  { key: "introductions", label: t.introductions,        sub: t.notifIntroductionsSub },
                  { key: "events",        label: t.events,               sub: t.notifEventsSub },
                  { key: "eloiUpdates",   label: t.notifEloiUpdates,    sub: t.notifEloiUpdatesSub },
                  { key: "weeklyDigest",  label: t.weeklyDigest,  sub: t.weeklyDigestSub },
                ].map((item, idx) => (
                  <View key={item.key}>
                    {idx > 0 && <Divider />}
                    <View style={styles.privacyRow}>
                      <View style={{ flex: 1, gap: 2 }}>
                        <Text style={[styles.privacyLabel, { color: theme.text }]}>{item.label}</Text>
                        <Text style={[styles.privacyDesc, { color: theme.muted }]}>{item.sub}</Text>
                      </View>
                      <AppSwitch
                        value={notifications[item.key as keyof typeof notifications]}
                        onValueChange={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setNotifications(p => ({ ...p, [item.key]: !p[item.key as keyof typeof notifications] })); }}
                        trackColor={{ false: theme.border, true: theme.text }} thumbColor={theme.bg} ios_backgroundColor={theme.border}
                      />
                    </View>
                  </View>
                ))}
              </Card>
            </View>

            {/* Privacy */}
            <View style={styles.settingsSection}>
              <Label bright style={styles.settingsSectionLabel}>{t.privacy}</Label>
              <Card>
                {[
                  { key: "profilePublic",    label: t.publicProfile,       desc: t.publicProfileDesc },
                  { key: "showLocation",     label: t.showLocation,        desc: t.showLocationDesc },
                  { key: "showDisciplines",  label: t.showDisciplines,  desc: t.showDisciplinesDesc },
                  { key: "allowIntros",      label: t.allowIntros, desc: t.allowIntrosDesc },
                  { key: "showAvailability", label: t.showAvailability,    desc: t.showAvailabilityDesc },
                  { key: "marketingEmails",  label: t.marketingEmails,     desc: t.marketingEmailsDesc },
                ].map((item, idx) => (
                  <View key={item.key}>
                    {idx > 0 && <Divider />}
                    <View style={styles.privacyRow}>
                      <View style={{ flex: 1, gap: 2 }}>
                        <Text style={[styles.privacyLabel, { color: theme.text }]}>{item.label}</Text>
                        <Text style={[styles.privacyDesc, { color: theme.muted }]}>{item.desc}</Text>
                      </View>
                      <AppSwitch
                        value={privacy[item.key as keyof typeof privacy]}
                        onValueChange={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setPrivacy(p => ({ ...p, [item.key]: !p[item.key as keyof typeof privacy] })); }}
                        trackColor={{ false: theme.border, true: theme.text }} thumbColor={theme.bg} ios_backgroundColor={theme.border}
                      />
                    </View>
                  </View>
                ))}
              </Card>
            </View>

            {/* Account */}
            <View style={styles.settingsSection}>
              <Label bright style={styles.settingsSectionLabel}>{t.account}</Label>
              <Card>
                {[
                  { icon: "edit-2",  label: t.editProfile,    onPress: () => { setTab("portfolio"); setEditing(true); } },
                  { icon: "mail",    label: t.changeEmailTitle,    onPress: () => setChangeEmailModal(true) },
                  { icon: "lock",    label: t.changePasswordTitle, onPress: () => setChangePasswordModal(true) },
                ].map((item, idx) => (
                  <View key={idx}>
                    {idx > 0 && <Divider />}
                    <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); item.onPress(); }} activeOpacity={0.7} style={styles.settingsRow}>
                      <View style={styles.settingsRowLeft}>
                        <Feather name={item.icon as any} size={16} color={theme.muted} />
                        <Text style={[styles.settingsRowLabel, { color: theme.text }]}>{item.label}</Text>
                      </View>
                      <Feather name="chevron-right" size={15} color={theme.dim} />
                    </TouchableOpacity>
                  </View>
                ))}
              </Card>
              <TouchableOpacity onPress={handleLogout}
                style={[styles.signOutBtn, { backgroundColor: theme.fill, borderRadius: RADIUS.md }]} activeOpacity={0.7}>
                <Feather name="log-out" size={13} color={theme.muted} />
                <Text style={[styles.signOutText, { color: theme.muted }]}>{t.signOut}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); setDeleteModal(true); setDeleteStep(0); }}
                style={[styles.deleteBtn, { backgroundColor: theme.fill, borderRadius: RADIUS.md }]} activeOpacity={0.7}>
                <Feather name="trash-2" size={13} color={theme.muted} />
                <Text style={[styles.deleteText, { color: theme.muted }]}>{t.deleteAccount}</Text>
              </TouchableOpacity>
            </View>

            {/* Éloi Preferences */}
            <View style={styles.settingsSection}>
              <Label bright style={styles.settingsSectionLabel}>{t.eloiPreferences}</Label>
              <Card>
                <View style={styles.privacyRow}>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={[styles.privacyLabel, { color: theme.text }]}>{t.fashionNewsUpdates}</Text>
                    <Text style={[styles.privacyDesc, { color: theme.muted }]}>{t.eloiDailyHighlights}</Text>
                  </View>
                  <AppSwitch value={eloiPrefs.fashionNews}
                    onValueChange={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setEloiPrefs(p => ({ ...p, fashionNews: !p.fashionNews })); }}
                    trackColor={{ false: theme.border, true: theme.text }} thumbColor={theme.bg} ios_backgroundColor={theme.border} />
                </View>
                <Divider />
                <View style={styles.privacyRow}>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={[styles.privacyLabel, { color: theme.text }]}>{t.weeklyDigest}</Text>
                    <Text style={[styles.privacyDesc, { color: theme.muted }]}>{t.eloiWeeklyRoundup}</Text>
                  </View>
                  <AppSwitch value={eloiPrefs.weeklyDigest}
                    onValueChange={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setEloiPrefs(p => ({ ...p, weeklyDigest: !p.weeklyDigest })); }}
                    trackColor={{ false: theme.border, true: theme.text }} thumbColor={theme.bg} ios_backgroundColor={theme.border} />
                </View>
              </Card>

              {/* Followed houses */}
              <Card>
                <View style={styles.housesHeader}>
                  <Label>{t.followingFashionHouses}</Label>
                  <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setManageHousesModal(true); }}
                    style={[styles.manageHousesBtn, { backgroundColor: theme.fill, borderRadius: RADIUS.pill }]} activeOpacity={0.7}>
                    <Feather name="edit-2" size={10} color={theme.muted} />
                    <Text style={[styles.manageHousesBtnText, { color: theme.muted }]}>{t.edit}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.housesRow}>
                  {followedHouses.length > 0
                    ? followedHouses.map(h => (
                        <View key={h} style={[styles.housePill, { backgroundColor: theme.fill, borderRadius: RADIUS.pill }]}>
                          <Text style={[styles.housePillText, { color: theme.muted }]}>{h}</Text>
                        </View>
                      ))
                    : <Text style={[{ fontFamily: FONT.sansRegular, fontSize: 13 }, { color: theme.dim }]}>{t.noHousesFollowed}</Text>
                  }
                </View>
              </Card>

              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  startTour();
                  router.replace("/(app)");
                }}
                style={[styles.replayBtn, { backgroundColor: theme.fill, borderRadius: RADIUS.md }]} activeOpacity={0.7}
              >
                <Feather name="play-circle" size={14} color={theme.muted} />
                <Text style={[styles.replayBtnText, { color: theme.muted }]}>{t.replayTutorial}</Text>
              </TouchableOpacity>
            </View>

            {/* Help & Support */}
            <View style={styles.settingsSection}>
              <Label bright style={styles.settingsSectionLabel}>{t.helpAndSupport}</Label>
              <Card>
                {[
                  { icon: "help-circle",    label: t.faq,             sub: t.faqSub,        onPress: () => setFaqModal(true) },
                  { icon: "message-square", label: t.helpAndSupport, sub: t.contactSupportSub,     onPress: () => setContactModal(true) },
                  { icon: "alert-circle",   label: t.reportBug,    sub: t.reportBugSub,           onPress: () => setBugModal(true) },
                ].map((item, idx) => (
                  <View key={idx}>
                    {idx > 0 && <Divider />}
                    <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); item.onPress(); }} activeOpacity={0.7} style={styles.settingsRow}>
                      <View style={styles.settingsRowLeft}>
                        <Feather name={item.icon as any} size={16} color={theme.muted} />
                        <View>
                          <Text style={[styles.settingsRowLabel, { color: theme.text }]}>{item.label}</Text>
                          <Text style={[styles.settingsRowSub, { color: theme.muted }]}>{item.sub}</Text>
                        </View>
                      </View>
                      <Feather name="chevron-right" size={15} color={theme.dim} />
                    </TouchableOpacity>
                  </View>
                ))}
              </Card>
            </View>

            {/* Legal */}
            <View style={styles.settingsSection}>
              <Label bright style={styles.settingsSectionLabel}>{t.legal}</Label>
              <Card>
                {[
                  { label: t.privacyPolicy,      key: "privacy" as const },
                  { label: t.termsOfService,     key: "terms" as const },
                  { label: t.communityGuidelines, key: "community" as const },
                ].map((item, idx) => (
                  <View key={idx}>
                    {idx > 0 && <Divider />}
                    <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setDocModal(item.key); }} activeOpacity={0.7} style={styles.settingsRow}>
                      <View style={styles.settingsRowLeft}>
                        <Feather name="file-text" size={16} color={theme.muted} />
                        <Text style={[styles.settingsRowLabel, { color: theme.text }]}>{item.label}</Text>
                      </View>
                      <Feather name="chevron-right" size={15} color={theme.dim} />
                    </TouchableOpacity>
                  </View>
                ))}
              </Card>
            </View>
          </View>
        )}
      </ScrollView>

      {/* ── Modals ─────────────────────────────────────────────────────────── */}

      <AddCreditModal visible={addCreditModal} onClose={() => setAddCreditModal(false)} onAdd={handleAddCredit} />
      <ChangeEmailModal visible={changeEmailModal} onClose={() => setChangeEmailModal(false)} />
      <ChangePasswordModal visible={changePasswordModal} onClose={() => setChangePasswordModal(false)} />
      <ManageHousesModal visible={manageHousesModal} onClose={() => setManageHousesModal(false)} followed={followedHouses} onToggle={toggleHouse} />
      <FAQModal visible={faqModal} onClose={() => setFaqModal(false)} />
      <ContactSupportModal visible={contactModal} onClose={() => setContactModal(false)} />
      <ReportBugModal visible={bugModal} onClose={() => setBugModal(false)} />

      {/* Manage subscription */}
      <AppModal visible={manageSubModal} transparent animationType="fade" onRequestClose={() => setManageSubModal(false)}>
        <View style={styles.deleteOverlay}>
          <View style={[styles.deletePanel, { backgroundColor: theme.surface, borderRadius: RADIUS.xl }]}>
            <Text style={[styles.deletePanelHeading, { color: theme.text }]}>{t.manageSubscription}</Text>
            <Text style={[styles.deletePanelBody, { color: theme.muted }]}>{t.managedViaPortal}</Text>
            <Button label={t.gotIt} onPress={() => setManageSubModal(false)} fullWidth />
          </View>
        </View>
      </AppModal>

      {/* Language picker */}
      <AppModal visible={langModal} transparent animationType="fade" onRequestClose={() => setLangModal(false)}>
        <View style={styles.deleteOverlay}>
          <View style={[styles.deletePanel, { backgroundColor: theme.surface, borderRadius: RADIUS.xl }]}>
            <Text style={[styles.deletePanelHeading, { color: theme.text }]}>{t.language}</Text>
            <View style={{ maxHeight: 380 }} onLayout={e => setLangViewH(e.nativeEvent.layout.height)}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                bounces={false}
                onScroll={e => setLangScrollY(e.nativeEvent.contentOffset.y)}
                onContentSizeChange={(_, h) => setLangContentH(h)}
                scrollEventThrottle={16}
              >
                {LANGUAGES.map(l => (
                  <TouchableOpacity key={l} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setGlobalLanguage(l as Language); setLangModal(false); }}
                    style={[styles.langOption, { backgroundColor: l === language ? theme.fill : "transparent", borderRadius: RADIUS.md }]} activeOpacity={0.7}>
                    <Text style={[styles.langOptionText, { color: l === language ? theme.text : theme.muted }]}>{t.languageNames[l] ?? l}</Text>
                    {l === language && <Feather name="check" size={14} color={theme.text} />}
                  </TouchableOpacity>
                ))}
              </ScrollView>
              {langContentH > langViewH && (() => {
                const trackH = langViewH - 12;
                const thumbH = Math.max(28, (langViewH / langContentH) * trackH);
                const thumbTop = 6 + (langScrollY / (langContentH - langViewH)) * (trackH - thumbH);
                return (
                  <View style={[styles.langScrollTrack, { backgroundColor: theme.border }]} pointerEvents="none">
                    <View style={[styles.langScrollThumb, { backgroundColor: theme.muted, height: thumbH, transform: [{ translateY: thumbTop }] }]} />
                  </View>
                );
              })()}
            </View>
            <Button label={t.cancel} variant="ghost" onPress={() => setLangModal(false)} fullWidth />
          </View>
        </View>
      </AppModal>

      {/* Delete account */}
      <AppModal visible={deleteModal} transparent animationType="fade" onRequestClose={() => setDeleteModal(false)}>
        <View style={styles.deleteOverlay}>
          <View style={[styles.deletePanel, { backgroundColor: theme.surface, borderRadius: RADIUS.xl }]}>
            <Text style={[styles.deletePanelHeading, { color: theme.text }]}>{deleteStep === 0 ? t.deleteAccountTitle : t.deleteAccountConfirmTitle}</Text>
            <Text style={[styles.deletePanelBody, { color: theme.muted }]}>
              {deleteStep === 0 ? t.deleteAccountDesc : t.deleteAccountConfirmDesc}
            </Text>
            <View style={styles.deletePanelActions}>
              <Button label={deleteStep === 0 ? t.cancel : t.keepAccount} variant="ghost" onPress={() => setDeleteModal(false)} style={{ flex: 1 }} />
              <Button label={deleteStep === 0 ? t.continueBtn : t.deleteBtn} onPress={() => { if (deleteStep === 0) setDeleteStep(1); else setDeleteModal(false); }} style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </AppModal>

      {/* Legal docs */}
      <DocModal title={t.privacyPolicy}      label={t.legal} body={PRIVACY_TEXT}   visible={docModal === "privacy"}    onClose={() => setDocModal(null)} />
      <DocModal title={t.termsOfService}    label={t.legal} body={TERMS_TEXT}     visible={docModal === "terms"}      onClose={() => setDocModal(null)} />
      <DocModal title={t.communityGuidelines} label={t.legal} body={COMMUNITY_TEXT} visible={docModal === "community"} onClose={() => setDocModal(null)} />
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root:    { flex: 1 },
  header:  { zIndex: 10, borderBottomWidth: 0 },
  headRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, marginBottom: 16 },
  heading: { fontFamily: FONT.serifLight, fontSize: 48, lineHeight: 52, letterSpacing: 0.2 },
  themeBtn:{ padding: 8 },
  tabs:    { paddingHorizontal: 20, gap: 24 },
  tabBtn:  { paddingVertical: 12, paddingBottom: 14 },
  tabText: { fontFamily: FONT.sansMedium, fontSize: 12, letterSpacing: 0.5 },
  content: { paddingHorizontal: 20, paddingTop: 24 },
  tabContent:{ gap: 20 },
  section: { gap: 12 },
  sectionHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  // Profile completeness
  completeness:    { padding: 16, gap: 10 },
  completenessTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  completenessPct: { fontFamily: FONT.serifLight, fontSize: 20, letterSpacing: 0.3 },
  completenessTrack:{ height: 2, borderRadius: 1, overflow: "hidden" },
  completenessBar: { height: 2, borderRadius: 1 },
  completenessTip: { fontFamily: FONT.sansRegular, fontSize: 12, lineHeight: 18 },
  // Portfolio
  profileTop:  { flexDirection: "row", gap: 16, alignItems: "flex-start" },
  avatar:      { width: 80, height: 80, position: "relative" },
  avatarInitial:{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, textAlign: "center", textAlignVertical: "center", fontFamily: FONT.serifLight, fontSize: 32, lineHeight: 80 },
  avatarOverlay:{ position: "absolute", bottom: 0, left: 0, right: 0, height: 28, alignItems: "center", justifyContent: "center" },
  profileName: { fontFamily: FONT.serifLight, fontSize: 26, lineHeight: 30, letterSpacing: 0.2 },
  profileTitle:{ fontFamily: FONT.sansRegular, fontSize: 13, lineHeight: 19, marginTop: 6 },
  editName:    { fontFamily: FONT.serifLight, fontSize: 24, letterSpacing: 0.2, borderBottomWidth: StyleSheet.hairlineWidth, paddingVertical: 4 },
  editTitle:   { fontFamily: FONT.sansRegular, fontSize: 13, borderBottomWidth: StyleSheet.hairlineWidth, paddingVertical: 4, marginTop: 6 },
  bio:         { fontFamily: FONT.sansRegular, fontSize: 13, lineHeight: 21 },
  bioInput:    { fontFamily: FONT.sansRegular, fontSize: 13, lineHeight: 21, padding: 12, minHeight: 90 },
  div:         { marginVertical: 16 },
  editBtn:     { flexDirection: "row", gap: 8, alignItems: "center", justifyContent: "center", paddingVertical: 12 },
  editBtnText: { fontFamily: FONT.sansMedium, fontSize: 12, letterSpacing: 0.3 },
  addBtn:      { flexDirection: "row", gap: 5, alignItems: "center", paddingHorizontal: 12, paddingVertical: 6 },
  addBtnText:  { fontFamily: FONT.sansMedium, fontSize: 11 },
  creditRow:   { flexDirection: "row", alignItems: "center", paddingVertical: 12, gap: 12 },
  creditRole:  { fontFamily: FONT.sansMedium, fontSize: 13 },
  creditEntity:{ fontFamily: FONT.sansRegular, fontSize: 12, marginTop: 3 },
  creditYear:  { fontFamily: FONT.sansRegular, fontSize: 11 },
  // Badges
  badgeRow:    { flexDirection: "row", gap: 14, paddingVertical: 14, alignItems: "flex-start" },
  badgeIconWrap:{ width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  badgeIcon:   { fontSize: 18 },
  badgeLogoIcon: { width: 22, height: 22 },
  badgeName:   { fontFamily: FONT.sansMedium, fontSize: 13, letterSpacing: 0.2 },
  badgeDesc:   { fontFamily: FONT.sansRegular, fontSize: 12, lineHeight: 18 },
  badgeGranted:{ fontFamily: FONT.sansRegular, fontSize: 11 },
  pendingPill: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, marginTop: 4 },
  pendingText: { fontFamily: FONT.sansMedium, fontSize: 9, letterSpacing: 1, textTransform: "uppercase" },
  // Plan
  planName:    { fontFamily: FONT.serifLight, fontSize: 42, lineHeight: 48, letterSpacing: 0.2, marginTop: 8 },
  planTier:    { fontFamily: FONT.sansMedium, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", marginTop: 4 },
  planPriceBadge:{ alignSelf: "flex-start", paddingHorizontal: 14, paddingVertical: 7, marginTop: 10 },
  planPrice:   { fontFamily: FONT.sansMedium, fontSize: 12, letterSpacing: 0.5 },
  planPeriod:  { fontFamily: FONT.sansRegular, fontSize: 12, marginTop: 6 },
  featureRow:  { flexDirection: "row", gap: 12, alignItems: "flex-start", paddingVertical: 5 },
  featureText: { fontFamily: FONT.sansRegular, fontSize: 13, flex: 1, lineHeight: 20 },
  manageBtn:   { paddingVertical: 14, alignItems: "center", marginTop: 4 },
  manageBtnText:{ fontFamily: FONT.sansMedium, fontSize: 13 },
  subNote:     { flexDirection: "row", gap: 10, padding: 16 },
  subNoteText: { fontFamily: FONT.sansRegular, fontSize: 12, lineHeight: 20, flex: 1 },
  // Settings
  settingsSection:     { gap: 12 },
  settingsSectionLabel:{ marginBottom: 4 },
  settingsRow:         { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 14 },
  settingsRowLeft:     { flexDirection: "row", alignItems: "center", gap: 14, flex: 1 },
  settingsRowLabel:    { fontFamily: FONT.sansMedium, fontSize: 13 },
  settingsRowSub:      { fontFamily: FONT.sansRegular, fontSize: 11, marginTop: 2 },
  privacyRow:          { flexDirection: "row", alignItems: "center", paddingVertical: 12, gap: 12 },
  privacyLabel:        { fontFamily: FONT.sansMedium, fontSize: 13 },
  privacyDesc:         { fontFamily: FONT.sansRegular, fontSize: 11, lineHeight: 17 },
  signOutBtn:          { flexDirection: "row", gap: 10, alignItems: "center", justifyContent: "center", paddingVertical: 14 },
  signOutText:         { fontFamily: FONT.sansMedium, fontSize: 13 },
  deleteBtn:           { flexDirection: "row", gap: 10, alignItems: "center", justifyContent: "center", paddingVertical: 14 },
  deleteText:          { fontFamily: FONT.sansMedium, fontSize: 13 },
  housesHeader:        { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  housesRow:           { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  housePill:           { paddingHorizontal: 12, paddingVertical: 7 },
  housePillText:       { fontFamily: FONT.sansMedium, fontSize: 11, letterSpacing: 0.3 },
  manageHousesBtn:     { flexDirection: "row", gap: 5, alignItems: "center", paddingHorizontal: 10, paddingVertical: 6 },
  manageHousesBtnText: { fontFamily: FONT.sansMedium, fontSize: 11 },
  replayBtn:           { flexDirection: "row", gap: 10, alignItems: "center", justifyContent: "center", paddingVertical: 14 },
  replayBtnText:       { fontFamily: FONT.sansMedium, fontSize: 13 },
  // Modals
  deleteOverlay:       { flex: 1, backgroundColor: "rgba(0,0,0,0.75)", justifyContent: "center", alignItems: "center", padding: 28 },
  deletePanel:         { padding: 28, gap: 16, width: "100%" },
  deletePanelHeading:  { fontFamily: FONT.serifLight, fontSize: 28, letterSpacing: 0.3 },
  deletePanelBody:     { fontFamily: FONT.sansRegular, fontSize: 12, lineHeight: 19 },
  deletePanelActions:  { flexDirection: "row", gap: 10 },
  langOption:          { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 12, paddingVertical: 14 },
  langOptionText:      { fontFamily: FONT.sansRegular, fontSize: 14 },
  langScrollTrack:     { position: "absolute", right: 3, top: 0, bottom: 0, width: 2.5, borderRadius: 99, opacity: 0.25 },
  langScrollThumb:     { position: "absolute", left: 0, right: 0, borderRadius: 99, opacity: 1 },
});
