import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator, Image,
} from "react-native";
import AppModal from "@/components/AppModal";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { FONT, RADIUS, SHADOW } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";

const LOGO_BLACK = require("@/assets/logo-mark.png");
const LOGO_WHITE = require("@/assets/logo-mark-white.png");

// ── Forgot Password Modal ─────────────────────────────────────────────────────

function ForgotModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSent(true);
  };

  const handleClose = () => { setEmail(""); setSent(false); setLoading(false); onClose(); };

  return (
    <AppModal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <View style={[fm.root, { backgroundColor: theme.bg }]}>
        <View style={fm.header}>
          <View style={[fm.handle, { backgroundColor: theme.border }]} />
          <TouchableOpacity onPress={handleClose} style={fm.closeBtn} activeOpacity={0.6}>
            <View style={[fm.closeCircle, { backgroundColor: theme.fill }]}>
              <Feather name="x" size={14} color={theme.muted} />
            </View>
          </TouchableOpacity>
        </View>
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={fm.content}>
            {sent ? (
              <View style={fm.successBlock}>
                <Text style={[fm.successIcon, { color: theme.text }]}>✦</Text>
                <Text style={[fm.successHeading, { color: theme.text }]}>Check your inbox</Text>
                <Text style={[fm.successBody, { color: theme.muted }]}>
                  We've sent a password reset link to {email}. It may take a moment to arrive.
                </Text>
                <TouchableOpacity
                  onPress={handleClose}
                  style={[fm.btn, { backgroundColor: theme.invertBg, borderRadius: RADIUS.md, marginTop: 16 }]}
                  activeOpacity={0.8}
                >
                  <Text style={[fm.btnText, { color: theme.invertText }]}>Done</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text style={[fm.label, { color: theme.muted }]}>ACCOUNT RECOVERY</Text>
                <Text style={[fm.heading, { color: theme.text }]}>{"Reset your\npassword."}</Text>
                <Text style={[fm.sub, { color: theme.muted }]}>
                  Enter the email address associated with your Coterie membership.
                </Text>
                <View style={fm.fieldGroup}>
                  <Text style={[fm.fieldLabel, { color: theme.muted }]}>Email address</Text>
                  <TextInput
                    style={[fm.input, { backgroundColor: theme.surface, color: theme.text, borderRadius: RADIUS.md }]}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="your@email.com"
                    placeholderTextColor={theme.dim}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    selectionColor={theme.text}
                  />
                </View>
                <TouchableOpacity
                  onPress={handleReset}
                  disabled={loading || !email.trim()}
                  style={[fm.btn, { backgroundColor: theme.invertBg, borderRadius: RADIUS.md, opacity: (!email.trim() || loading) ? 0.5 : 1 }]}
                  activeOpacity={0.8}
                >
                  {loading
                    ? <ActivityIndicator color={theme.invertText} size="small" />
                    : <Text style={[fm.btnText, { color: theme.invertText }]}>Send Reset Link</Text>}
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </View>
    </AppModal>
  );
}

const fm = StyleSheet.create({
  root: { flex: 1 },
  header: { alignItems: "center", paddingTop: 14, paddingBottom: 8, paddingHorizontal: 20, position: "relative" },
  handle: { width: 36, height: 4, borderRadius: 2 },
  closeBtn: { position: "absolute", right: 20, top: 10, padding: 4 },
  closeCircle: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  content: { padding: 28, gap: 20 },
  label: { fontFamily: FONT.sansMedium, fontSize: 9, letterSpacing: 2, textTransform: "uppercase" },
  heading: { fontFamily: FONT.serifLight, fontSize: 48, lineHeight: 52, letterSpacing: 0.2 },
  sub: { fontFamily: FONT.sansRegular, fontSize: 14, lineHeight: 22 },
  fieldGroup: { gap: 8 },
  fieldLabel: { fontFamily: FONT.sansMedium, fontSize: 13 },
  input: { fontFamily: FONT.sansRegular, fontSize: 16, paddingHorizontal: 16, paddingVertical: 14 },
  btn: { paddingVertical: 16, alignItems: "center" },
  btnText: { fontFamily: FONT.sansMedium, fontSize: 16 },
  successBlock: { alignItems: "center", gap: 14, paddingVertical: 40 },
  successIcon: { fontSize: 32 },
  successHeading: { fontFamily: FONT.serifLight, fontSize: 32, letterSpacing: 0.3 },
  successBody: { fontFamily: FONT.sansRegular, fontSize: 14, lineHeight: 22, textAlign: "center", maxWidth: 300 },
});

// ── Demo Modal ────────────────────────────────────────────────────────────────

function DemoModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { theme } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSent(true);
  };

  const handleClose = () => {
    setName(""); setEmail(""); setCompany(""); setMessage(""); setSent(false); setLoading(false);
    onClose();
  };

  return (
    <AppModal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <View style={[dm.root, { backgroundColor: theme.bg }]}>
        <View style={dm.header}>
          <View style={[dm.handle, { backgroundColor: theme.border }]} />
          <TouchableOpacity onPress={handleClose} style={dm.closeBtn} activeOpacity={0.6}>
            <View style={[dm.closeCircle, { backgroundColor: theme.fill }]}>
              <Feather name="x" size={14} color={theme.muted} />
            </View>
          </TouchableOpacity>
        </View>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View style={dm.content}>
              {sent ? (
                <View style={dm.successBlock}>
                  <Text style={[dm.successIcon, { color: theme.text }]}>✦</Text>
                  <Text style={[dm.successHeading, { color: theme.text }]}>Request Received</Text>
                  <Text style={[dm.successBody, { color: theme.muted }]}>
                    A member of the Coterie team will reach out to you within 24 hours to arrange your private demo.
                  </Text>
                  <TouchableOpacity
                    onPress={handleClose}
                    style={[dm.btn, { backgroundColor: theme.invertBg, borderRadius: RADIUS.md, marginTop: 16 }]}
                    activeOpacity={0.8}
                  >
                    <Text style={[dm.btnText, { color: theme.invertText }]}>Done</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <Text style={[dm.label, { color: theme.muted }]}>PRIVATE DEMO</Text>
                  <Text style={[dm.heading, { color: theme.text }]}>{"Meet the\nCoterie team."}</Text>
                  <Text style={[dm.sub, { color: theme.muted }]}>
                    We'll walk you through membership, make introductions, and answer any questions personally.
                  </Text>
                  <View style={dm.fields}>
                    {[
                      { label: "Full name", value: name, set: setName, placeholder: "Your name", keyboard: "default" as const },
                      { label: "Email address", value: email, set: setEmail, placeholder: "your@email.com", keyboard: "email-address" as const },
                      { label: "Company or Brand", value: company, set: setCompany, placeholder: "e.g. Vogue UK", keyboard: "default" as const },
                    ].map((f) => (
                      <View key={f.label} style={dm.fieldGroup}>
                        <Text style={[dm.fieldLabel, { color: theme.muted }]}>{f.label}</Text>
                        <TextInput
                          style={[dm.input, { backgroundColor: theme.surface, color: theme.text, borderRadius: RADIUS.md }]}
                          value={f.value}
                          onChangeText={f.set}
                          placeholder={f.placeholder}
                          placeholderTextColor={theme.dim}
                          keyboardType={f.keyboard}
                          autoCapitalize={f.keyboard === "email-address" ? "none" : "words"}
                          selectionColor={theme.text}
                        />
                      </View>
                    ))}
                    <View style={dm.fieldGroup}>
                      <Text style={[dm.fieldLabel, { color: theme.muted }]}>What would you like to discuss?</Text>
                      <TextInput
                        style={[dm.input, dm.textarea, { backgroundColor: theme.surface, color: theme.text, borderRadius: RADIUS.md }]}
                        value={message}
                        onChangeText={setMessage}
                        placeholder="Tell us a little about yourself and what you're looking for..."
                        placeholderTextColor={theme.dim}
                        multiline
                        textAlignVertical="top"
                        selectionColor={theme.text}
                      />
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={loading || !name.trim() || !email.trim()}
                    style={[dm.btn, { backgroundColor: theme.invertBg, borderRadius: RADIUS.md, opacity: (!name.trim() || !email.trim() || loading) ? 0.5 : 1 }]}
                    activeOpacity={0.8}
                  >
                    {loading
                      ? <ActivityIndicator color={theme.invertText} size="small" />
                      : <Text style={[dm.btnText, { color: theme.invertText }]}>Request Demo</Text>}
                  </TouchableOpacity>
                </>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </AppModal>
  );
}

const dm = StyleSheet.create({
  root: { flex: 1 },
  header: { alignItems: "center", paddingTop: 14, paddingBottom: 8, paddingHorizontal: 20, position: "relative" },
  handle: { width: 36, height: 4, borderRadius: 2 },
  closeBtn: { position: "absolute", right: 20, top: 10, padding: 4 },
  closeCircle: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  content: { padding: 28, gap: 20 },
  label: { fontFamily: FONT.sansMedium, fontSize: 9, letterSpacing: 2, textTransform: "uppercase" },
  heading: { fontFamily: FONT.serifLight, fontSize: 48, lineHeight: 52, letterSpacing: 0.2 },
  sub: { fontFamily: FONT.sansRegular, fontSize: 14, lineHeight: 22 },
  fields: { gap: 16 },
  fieldGroup: { gap: 8 },
  fieldLabel: { fontFamily: FONT.sansMedium, fontSize: 13 },
  input: { fontFamily: FONT.sansRegular, fontSize: 15, paddingHorizontal: 16, paddingVertical: 14 },
  textarea: { minHeight: 100, paddingTop: 14 },
  btn: { paddingVertical: 16, alignItems: "center" },
  btnText: { fontFamily: FONT.sansMedium, fontSize: 16 },
  successBlock: { alignItems: "center", gap: 14, paddingVertical: 40 },
  successIcon: { fontSize: 32 },
  successHeading: { fontFamily: FONT.serifLight, fontSize: 32, letterSpacing: 0.3 },
  successBody: { fontFamily: FONT.sansRegular, fontSize: 14, lineHeight: 22, textAlign: "center", maxWidth: 300 },
});

// ── Apply Modal ───────────────────────────────────────────────────────────────

function ApplyModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { theme } = useTheme();
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [brand, setBrand] = useState("");
  const [years, setYears] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [why, setWhy] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const YEARS_OPTIONS = ["0 – 2 years", "3 – 5 years", "6 – 10 years", "10+ years"];

  const handleClose = () => {
    setStep(1); setFirstName(""); setLastName(""); setEmail("");
    setRole(""); setBrand(""); setYears(""); setPortfolio(""); setWhy("");
    setLoading(false); setSubmitted(false);
    onClose();
  };

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSubmitted(true);
  };

  const step1Valid = firstName.trim() && lastName.trim() && email.trim();
  const step2Valid = role.trim() && brand.trim() && years;
  const step3Valid = why.trim().length > 20;

  return (
    <AppModal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <View style={[am.root, { backgroundColor: theme.bg }]}>
        <View style={am.header}>
          <View style={[am.handle, { backgroundColor: theme.border }]} />
          <TouchableOpacity onPress={handleClose} style={am.closeBtn} activeOpacity={0.6}>
            <View style={[am.closeCircle, { backgroundColor: theme.fill }]}>
              <Feather name="x" size={14} color={theme.muted} />
            </View>
          </TouchableOpacity>
        </View>

        {!submitted ? (
          <>
            {/* Progress */}
            <View style={am.progress}>
              {[1, 2, 3].map((s) => (
                <View
                  key={s}
                  style={[am.progressDot, {
                    backgroundColor: s <= step ? theme.text : theme.border,
                    width: s === step ? 24 : 6,
                  }]}
                />
              ))}
              <Text style={[am.progressText, { color: theme.dim }]}>{step} / 3</Text>
            </View>

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
              <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                <View style={am.content}>
                  {step === 1 && (
                    <>
                      <Text style={[am.stepLabel, { color: theme.muted }]}>ABOUT YOU</Text>
                      <Text style={[am.heading, { color: theme.text }]}>{"Let's start\nwith you."}</Text>
                      <View style={am.fields}>
                        {[
                          { label: "First name", value: firstName, set: setFirstName, placeholder: "First name" },
                          { label: "Last name",  value: lastName,  set: setLastName,  placeholder: "Last name"  },
                          { label: "Email address", value: email, set: setEmail, placeholder: "your@email.com" },
                        ].map((f) => (
                          <View key={f.label} style={am.fieldGroup}>
                            <Text style={[am.fieldLabel, { color: theme.muted }]}>{f.label}</Text>
                            <TextInput
                              style={[am.input, { backgroundColor: theme.surface, color: theme.text, borderRadius: RADIUS.md }]}
                              value={f.value} onChangeText={f.set}
                              placeholder={f.placeholder} placeholderTextColor={theme.dim}
                              keyboardType={f.label === "Email address" ? "email-address" : "default"}
                              autoCapitalize={f.label === "Email address" ? "none" : "words"}
                              selectionColor={theme.text}
                            />
                          </View>
                        ))}
                      </View>
                      <TouchableOpacity
                        onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setStep(2); }}
                        disabled={!step1Valid}
                        style={[am.btn, { backgroundColor: theme.invertBg, borderRadius: RADIUS.md, opacity: step1Valid ? 1 : 0.4 }]}
                        activeOpacity={0.8}
                      >
                        <Text style={[am.btnText, { color: theme.invertText }]}>Continue</Text>
                        <Feather name="arrow-right" size={16} color={theme.invertText} />
                      </TouchableOpacity>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <Text style={[am.stepLabel, { color: theme.muted }]}>YOUR WORK</Text>
                      <Text style={[am.heading, { color: theme.text }]}>{"Tell us about\nyour work."}</Text>
                      <View style={am.fields}>
                        {[
                          { label: "Current role or title", value: role, set: setRole, placeholder: "e.g. Senior Stylist" },
                          { label: "Brand or company", value: brand, set: setBrand, placeholder: "e.g. Vogue UK" },
                          { label: "Portfolio URL (optional)", value: portfolio, set: setPortfolio, placeholder: "https://yourportfolio.com" },
                        ].map((f) => (
                          <View key={f.label} style={am.fieldGroup}>
                            <Text style={[am.fieldLabel, { color: theme.muted }]}>{f.label}</Text>
                            <TextInput
                              style={[am.input, { backgroundColor: theme.surface, color: theme.text, borderRadius: RADIUS.md }]}
                              value={f.value} onChangeText={f.set}
                              placeholder={f.placeholder} placeholderTextColor={theme.dim}
                              keyboardType={f.label === "Portfolio URL (optional)" ? "url" : "default"}
                              autoCapitalize="none"
                              selectionColor={theme.text}
                            />
                          </View>
                        ))}
                        <View style={am.fieldGroup}>
                          <Text style={[am.fieldLabel, { color: theme.muted }]}>Years in the industry</Text>
                          <View style={am.yearsRow}>
                            {YEARS_OPTIONS.map((y) => (
                              <TouchableOpacity
                                key={y}
                                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setYears(y); }}
                                style={[am.yearPill, { backgroundColor: years === y ? theme.invertBg : theme.fill, borderRadius: RADIUS.pill }]}
                                activeOpacity={0.7}
                              >
                                <Text style={[am.yearPillText, { color: years === y ? theme.invertText : theme.muted }]}>{y}</Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </View>
                      </View>
                      <View style={am.btnRow}>
                        <TouchableOpacity
                          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setStep(1); }}
                          style={[am.btnGhost, { backgroundColor: theme.fill, borderRadius: RADIUS.md }]}
                          activeOpacity={0.7}
                        >
                          <Feather name="arrow-left" size={16} color={theme.muted} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setStep(3); }}
                          disabled={!step2Valid}
                          style={[am.btn, { flex: 1, backgroundColor: theme.invertBg, borderRadius: RADIUS.md, opacity: step2Valid ? 1 : 0.4 }]}
                          activeOpacity={0.8}
                        >
                          <Text style={[am.btnText, { color: theme.invertText }]}>Continue</Text>
                          <Feather name="arrow-right" size={16} color={theme.invertText} />
                        </TouchableOpacity>
                      </View>
                    </>
                  )}

                  {step === 3 && (
                    <>
                      <Text style={[am.stepLabel, { color: theme.muted }]}>THE WHY</Text>
                      <Text style={[am.heading, { color: theme.text }]}>{"Why\nCoterie?"}</Text>
                      <Text style={[am.sub, { color: theme.muted }]}>
                        Tell us what you're looking for and why you'd like to join our network.
                      </Text>
                      <View style={am.fieldGroup}>
                        <TextInput
                          style={[am.input, am.textarea, { backgroundColor: theme.surface, color: theme.text, borderRadius: RADIUS.md }]}
                          value={why}
                          onChangeText={setWhy}
                          placeholder="What are you hoping to find at Coterie? What would make this membership truly valuable to you?"
                          placeholderTextColor={theme.dim}
                          multiline
                          textAlignVertical="top"
                          selectionColor={theme.text}
                        />
                        <Text style={[am.charCount, { color: why.length > 20 ? theme.muted : theme.dim }]}>
                          {why.length} / 500
                        </Text>
                      </View>
                      <View style={am.btnRow}>
                        <TouchableOpacity
                          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setStep(2); }}
                          style={[am.btnGhost, { backgroundColor: theme.fill, borderRadius: RADIUS.md }]}
                          activeOpacity={0.7}
                        >
                          <Feather name="arrow-left" size={16} color={theme.muted} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={handleSubmit}
                          disabled={loading || !step3Valid}
                          style={[am.btn, { flex: 1, backgroundColor: theme.invertBg, borderRadius: RADIUS.md, opacity: (step3Valid && !loading) ? 1 : 0.4 }]}
                          activeOpacity={0.8}
                        >
                          {loading
                            ? <ActivityIndicator color={theme.invertText} size="small" />
                            : <>
                                <Text style={[am.btnText, { color: theme.invertText }]}>Submit Application</Text>
                              </>}
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </>
        ) : (
          <View style={am.successBlock}>
            <Text style={[am.successIcon, { color: theme.text }]}>✦</Text>
            <Text style={[am.successHeading, { color: theme.text }]}>Application Received</Text>
            <Text style={[am.successBody, { color: theme.muted }]}>
              Thank you, {firstName}. Our membership committee reviews applications personally. You'll hear from us within 5–7 business days.
            </Text>
            <TouchableOpacity
              onPress={handleClose}
              style={[am.btn, { backgroundColor: theme.invertBg, borderRadius: RADIUS.md, marginTop: 16, paddingHorizontal: 40 }]}
              activeOpacity={0.8}
            >
              <Text style={[am.btnText, { color: theme.invertText }]}>Close</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </AppModal>
  );
}

const am = StyleSheet.create({
  root: { flex: 1 },
  header: { alignItems: "center", paddingTop: 14, paddingBottom: 8, paddingHorizontal: 20, position: "relative" },
  handle: { width: 36, height: 4, borderRadius: 2 },
  closeBtn: { position: "absolute", right: 20, top: 10, padding: 4 },
  closeCircle: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  progress: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 28, paddingVertical: 8 },
  progressDot: { height: 4, borderRadius: 2 },
  progressText: { fontFamily: FONT.sansMedium, fontSize: 10, letterSpacing: 1, marginLeft: 6 },
  content: { padding: 28, gap: 20 },
  stepLabel: { fontFamily: FONT.sansMedium, fontSize: 9, letterSpacing: 2, textTransform: "uppercase" },
  heading: { fontFamily: FONT.serifLight, fontSize: 44, lineHeight: 48, letterSpacing: 0.2 },
  sub: { fontFamily: FONT.sansRegular, fontSize: 14, lineHeight: 22 },
  fields: { gap: 16 },
  fieldGroup: { gap: 8 },
  fieldLabel: { fontFamily: FONT.sansMedium, fontSize: 13 },
  input: { fontFamily: FONT.sansRegular, fontSize: 15, paddingHorizontal: 16, paddingVertical: 14 },
  textarea: { minHeight: 130, paddingTop: 14 },
  charCount: { fontFamily: FONT.sansRegular, fontSize: 10, alignSelf: "flex-end", letterSpacing: 0.3 },
  yearsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  yearPill: { paddingHorizontal: 14, paddingVertical: 9 },
  yearPillText: { fontFamily: FONT.sansMedium, fontSize: 10, letterSpacing: 0.5 },
  btnRow: { flexDirection: "row", gap: 10 },
  btn: { flexDirection: "row", gap: 8, paddingVertical: 16, alignItems: "center", justifyContent: "center" },
  btnText: { fontFamily: FONT.sansMedium, fontSize: 15 },
  btnGhost: { paddingHorizontal: 18, paddingVertical: 16, alignItems: "center", justifyContent: "center" },
  successBlock: { flex: 1, alignItems: "center", justifyContent: "center", padding: 40, gap: 16 },
  successIcon: { fontSize: 36, marginBottom: 8 },
  successHeading: { fontFamily: FONT.serifLight, fontSize: 34, letterSpacing: 0.3, textAlign: "center" },
  successBody: { fontFamily: FONT.sansRegular, fontSize: 14, lineHeight: 22, textAlign: "center", maxWidth: 300 },
});

// ── Main Sign In Screen ───────────────────────────────────────────────────────

// ── Optional biometric auth (requires: npx expo install expo-local-authentication) ──
let LocalAuthentication: any = null;
try { LocalAuthentication = require("expo-local-authentication"); } catch {}

export default function SignInScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const { login } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPw, setShowPw]     = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [showApply, setShowApply]   = useState(false);
  const [showDemo, setShowDemo]     = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  React.useEffect(() => {
    if (!LocalAuthentication) return;
    (async () => {
      const has = await LocalAuthentication.hasHardwareAsync();
      if (!has) return;
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setBiometricAvailable(enrolled);
    })();
  }, []);

  const handleBiometricLogin = async () => {
    if (!LocalAuthentication) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Sign in to Coterie",
        cancelLabel: "Use password",
        disableDeviceFallback: false,
      });
      if (result.success) {
        setLoading(true);
        const isFirst = await login();
        router.replace(isFirst ? "/(app)/onboarding" : "/(app)");
      }
    } catch {
      // Biometric unavailable — fall through to password
    }
  };

  const handleSignIn = async () => {
    setError("");
    if (!email.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError("Please enter your email address.");
      return;
    }
    if (!password) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError("Please enter your password.");
      return;
    }
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      const isFirst = await login();
      router.replace(isFirst ? "/(app)/onboarding" : "/(app)");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <KeyboardAvoidingView style={[styles.root, { backgroundColor: theme.bg }]} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          contentContainerStyle={[styles.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topBar}>
            <Image source={isDark ? LOGO_WHITE : LOGO_BLACK} style={styles.logoMark} resizeMode="contain" />
            <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); toggleTheme(); }} activeOpacity={0.6}>
              <Feather name={isDark ? "sun" : "moon"} size={18} color={theme.muted} />
            </TouchableOpacity>
          </View>

          <View style={styles.headingBlock}>
            <Text style={[styles.heading, { color: theme.text }]}>{"Welcome\nback."}</Text>
            <Text style={[styles.sub, { color: theme.muted }]}>Sign in to access your Coterie membership.</Text>
          </View>

          <View style={styles.fields}>
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: theme.muted }]}>Email address</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderRadius: RADIUS.md }]}
                value={email}
                onChangeText={(t) => { setEmail(t); setError(""); }}
                placeholder="your@email.com"
                placeholderTextColor={theme.dim}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                selectionColor={theme.text}
                returnKeyType="next"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: theme.muted }]}>Password</Text>
              <View style={[styles.passwordWrap, { backgroundColor: theme.surface, borderRadius: RADIUS.md }]}>
                <TextInput
                  style={[styles.passwordInput, { color: theme.text }]}
                  value={password}
                  onChangeText={(t) => { setPassword(t); setError(""); }}
                  secureTextEntry={!showPw}
                  placeholder="Enter your password"
                  placeholderTextColor={theme.dim}
                  selectionColor={theme.text}
                  returnKeyType="done"
                  onSubmitEditing={handleSignIn}
                />
                <TouchableOpacity onPress={() => setShowPw(!showPw)} activeOpacity={0.6} style={{ padding: 6 }}>
                  <Feather name={showPw ? "eye-off" : "eye"} size={16} color={theme.muted} />
                </TouchableOpacity>
              </View>
            </View>

            {!!error && (
              <View style={[styles.errorBox, { backgroundColor: theme.fill, borderRadius: RADIUS.sm }]}>
                <Feather name="alert-circle" size={13} color={theme.muted} />
                <Text style={[styles.errorText, { color: theme.muted }]}>{error}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setShowForgot(true); }}
            activeOpacity={0.6}
            style={{ alignSelf: "flex-end" }}
          >
            <Text style={[styles.forgotText, { color: theme.muted }]}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSignIn}
            disabled={loading}
            activeOpacity={0.8}
            style={[styles.signInBtn, { backgroundColor: theme.invertBg, borderRadius: RADIUS.md, opacity: loading ? 0.7 : 1 }]}
          >
            {loading
              ? <ActivityIndicator color={theme.invertText} size="small" />
              : <Text style={[styles.signInText, { color: theme.invertText }]}>Sign In</Text>}
          </TouchableOpacity>

          {biometricAvailable && (
            <TouchableOpacity
              onPress={handleBiometricLogin}
              activeOpacity={0.75}
              style={[styles.biometricBtn, { backgroundColor: theme.fill, borderRadius: RADIUS.md }]}
            >
              <Feather name="shield" size={15} color={theme.muted} />
              <Text style={[styles.biometricText, { color: theme.muted }]}>Sign in with Face ID</Text>
            </TouchableOpacity>
          )}

          <View style={styles.orRow}>
            <View style={[styles.orLine, { backgroundColor: theme.border }]} />
            <Text style={[styles.orText, { color: theme.dim }]}>or</Text>
            <View style={[styles.orLine, { backgroundColor: theme.border }]} />
          </View>

          <TouchableOpacity
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setShowApply(true); }}
            activeOpacity={0.78}
            style={[styles.secondaryBtn, { backgroundColor: theme.surface, borderRadius: RADIUS.md }]}
          >
            <Text style={[styles.secondaryText, { color: theme.text }]}>Apply for Membership</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setShowDemo(true); }}
            activeOpacity={0.6}
            style={{ alignItems: "center" }}
          >
            <Text style={[styles.demoText, { color: theme.muted }]}>Book a demo with our team</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <ForgotModal visible={showForgot} onClose={() => setShowForgot(false)} />
      <ApplyModal  visible={showApply}  onClose={() => setShowApply(false)}  />
      <DemoModal   visible={showDemo}   onClose={() => setShowDemo(false)}   />
    </>
  );
}

const styles = StyleSheet.create({
  root:          { flex: 1 },
  container:     { paddingHorizontal: 24, gap: 26 },
  topBar:        { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  wordmark:      { fontFamily: FONT.serifLightItalic, fontSize: 22 },
  logoMark:      { width: 32, height: 32 },
  headingBlock:  { gap: 10 },
  heading:       { fontFamily: FONT.serifLight, fontSize: 56, lineHeight: 60, letterSpacing: 0.2 },
  sub:           { fontFamily: FONT.sansRegular, fontSize: 15, lineHeight: 22 },
  fields:        { gap: 16 },
  fieldGroup:    { gap: 8 },
  fieldLabel:    { fontFamily: FONT.sansMedium, fontSize: 13 },
  input:         { fontFamily: FONT.sansRegular, fontSize: 16, paddingHorizontal: 16, paddingVertical: 14 },
  passwordWrap:  { flexDirection: "row", alignItems: "center", paddingHorizontal: 16 },
  passwordInput: { flex: 1, fontFamily: FONT.sansRegular, fontSize: 16, paddingVertical: 14 },
  errorBox:      { flexDirection: "row", alignItems: "center", gap: 8, padding: 12 },
  errorText:     { fontFamily: FONT.sansRegular, fontSize: 13, flex: 1 },
  forgotText:    { fontFamily: FONT.sansRegular, fontSize: 14 },
  signInBtn:     { paddingVertical: 16, alignItems: "center" },
  signInText:    { fontFamily: FONT.sansMedium, fontSize: 16 },
  orRow:         { flexDirection: "row", alignItems: "center", gap: 12 },
  orLine:        { flex: 1, height: StyleSheet.hairlineWidth },
  orText:        { fontFamily: FONT.sansRegular, fontSize: 13 },
  secondaryBtn:  { paddingVertical: 15, alignItems: "center" },
  secondaryText: { fontFamily: FONT.sansMedium, fontSize: 15 },
  demoText:      { fontFamily: FONT.sansRegular, fontSize: 14 },
  biometricBtn:  { flexDirection: "row", gap: 10, paddingVertical: 15, alignItems: "center", justifyContent: "center" },
  biometricText: { fontFamily: FONT.sansMedium, fontSize: 15 },
});
