import { useEffect, useState } from "react";
import { Platform, View, Text } from "react-native";
import { ModalPortalProvider, ModalPortalHost } from "@/contexts/ModalPortalContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaInsetsContext } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import { useFonts,
  CormorantGaramond_300Light,
  CormorantGaramond_300Light_Italic,
  CormorantGaramond_400Regular,
  CormorantGaramond_400Regular_Italic,
} from "@expo-google-fonts/cormorant-garamond";
import {
  Inter_400Regular,
  Inter_500Medium,
} from "@expo-google-fonts/inter";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import OnboardingOverlay from "@/components/OnboardingOverlay";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();


// On web, react-native-safe-area-context measures CSS env() vars which are
// always 0 in a browser. We force the correct iPhone insets so every screen
// that calls useSafeAreaInsets() pushes its content below the fake status bar.
const WEB_INSETS = { top: 40, right: 0, bottom: 34, left: 0 };

function RootStack() {
  const { isDark } = useTheme();
  const content = (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false, animation: "fade" }} />
      <OnboardingOverlay />
    </>
  );
  if (Platform.OS === "web") {
    return (
      <SafeAreaInsetsContext.Provider value={WEB_INSETS}>
        <FakeStatusBar isDark={isDark} />
        {content}
      </SafeAreaInsetsContext.Provider>
    );
  }
  return content;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function pad(n: number) { return n < 10 ? `0${n}` : `${n}`; }
function nowTime() {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// ─── Fake iOS status bar ───────────────────────────────────────────────────────
// Sits in the 59 px safe-area gap that SafeAreaProvider leaves at the top.
// Positioned on either side of the Dynamic Island.
function FakeStatusBar({ isDark }: { isDark: boolean }) {
  const [time, setTime] = useState(nowTime());
  const color = isDark ? "#fff" : "#000";
  useEffect(() => {
    const id = setInterval(() => setTime(nowTime()), 15000);
    return () => clearInterval(id);
  }, []);

  // Dynamic Island occupies the horizontal centre.
  // Time sits in the left ~140 px, icons in the right ~140 px.
  // Vertical centre ≈ 17 px from screen top (DI centre).
  return (
    <View style={{
      position: "absolute", top: 0, left: 0, right: 0,
      height: 59,
      zIndex: 999,
      flexDirection: "row",
      alignItems: "center",
      paddingTop: 8,         // nudge to match DI vertical centre
      paddingLeft: 22,
      paddingRight: 22,
    } as any}>

      {/* ── Time (left of Dynamic Island) ─────────────────────────────── */}
      <Text style={{
        color,
        fontSize: 15,
        fontWeight: "600",
        letterSpacing: 0.3,
        flex: 1,
        // @ts-ignore
        fontVariantNumeric: "tabular-nums",
        userSelect: "none",
      }}>
        {time}
      </Text>

      {/* ── Status icons (right of Dynamic Island) ────────────────────── */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 } as any}>

        {/* Cellular signal — 4 bars */}
        {/* @ts-ignore */}
        <svg width="17" height="13" viewBox="0 0 17 13" xmlns="http://www.w3.org/2000/svg">
          {/* @ts-ignore */}<rect x="0"    y="9"   width="3" height="4"  rx="0.7" fill={color}/>
          {/* @ts-ignore */}<rect x="4.7"  y="6"   width="3" height="7"  rx="0.7" fill={color}/>
          {/* @ts-ignore */}<rect x="9.4"  y="3"   width="3" height="10" rx="0.7" fill={color}/>
          {/* @ts-ignore */}<rect x="14.1" y="0"   width="3" height="13" rx="0.7" fill={color}/>
        </svg>

        {/* Wi-Fi — 3 arcs + dot */}
        {/* @ts-ignore */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* @ts-ignore */}
          <path d="M0.5 4.5 Q4 0.5 8 0.5 Q12 0.5 15.5 4.5"
                stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
          {/* @ts-ignore */}
          <path d="M3 7 Q5.2 4.5 8 4.5 Q10.8 4.5 13 7"
                stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
          {/* @ts-ignore */}
          <path d="M5.5 9.3 Q6.6 8 8 8 Q9.4 8 10.5 9.3"
                stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
          {/* @ts-ignore */}
          <circle cx="8" cy="11.3" r="1.2" fill={color}/>
        </svg>

        {/* Battery — ~80% charged */}
        {/* @ts-ignore */}
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* @ts-ignore */}
          <rect x="0.8" y="0.8" width="22" height="11.4" rx="2.6"
                stroke={color} strokeOpacity="0.5" strokeWidth="1.4"/>
          {/* @ts-ignore */}
          <rect x="23.1" y="4.2" width="2.5" height="4.6" rx="1.1" fill={color} fillOpacity="0.4"/>
          {/* @ts-ignore */}
          <rect x="2.4" y="2.6" width="15.5" height="7.8" rx="1.6" fill={color}/>
        </svg>

      </View>
    </View>
  );
}

// ─── iPhone 17 Pro frame (web only) ───────────────────────────────────────────
function IPhoneFrame({ children }: { children: React.ReactNode }) {
  // Prevent the browser page from scrolling — all scrolling happens inside the app
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    html.style.overflow = "hidden";
    html.style.height   = "100%";
    body.style.overflow = "hidden";
    body.style.height   = "100%";
    return () => {
      html.style.overflow = "";
      html.style.height   = "";
      body.style.overflow = "";
      body.style.height   = "";
    };
  }, []);
  const APP_W  = 390;
  const APP_H  = 844;
  const BEZEL  = 11;
  const FRAME  = 3;
  const R_OUT  = 56;
  const R_GLASS = R_OUT - FRAME; // 53
  const R_SCR  = 46;

  const GLASS_W = APP_W + BEZEL * 2;   // 412
  const GLASS_H = APP_H + BEZEL * 2;   // 866
  const PHONE_W = GLASS_W + FRAME * 2; // 418
  const PHONE_H = GLASS_H + FRAME * 2; // 872

  const DI_W = 126;
  const DI_H = 37;

  const BTN_W   = 5;
  const BTN_GAP = 9;
  const WRAP_W  = PHONE_W + (BTN_W + BTN_GAP) * 2;

  const SCALE = 0.86;
  const MARGIN_COMP = -(PHONE_H * (1 - SCALE)) / 2;

  const btnShadow = "inset 0 1.5px 0 rgba(255,255,255,0.14), inset 0 -1.5px 0 rgba(0,0,0,0.85)";
  const frameBg  = "#2d2b28";
  const buttonBg = "#272522";

  return (
    <View style={{
      // Pin to the viewport so the page never scrolls
      position: "fixed" as any,
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "#0b0b0c",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden" as any,
    }}>
      <View style={{
        transform: [{ scale: SCALE }],
        marginTop: MARGIN_COMP,
        marginBottom: MARGIN_COMP,
        width: WRAP_W,
        height: PHONE_H,
        position: "relative",
      }}>

        {/* ── Left: Action, Vol+, Vol– ──────────────────────────────────── */}
        <View style={{ position:"absolute", left:0, top:122, width:BTN_W, height:28, borderRadius:4, backgroundColor:buttonBg, // @ts-ignore
          boxShadow:btnShadow }} />
        <View style={{ position:"absolute", left:0, top:174, width:BTN_W, height:66, borderRadius:2, backgroundColor:buttonBg, // @ts-ignore
          boxShadow:btnShadow }} />
        <View style={{ position:"absolute", left:0, top:256, width:BTN_W, height:66, borderRadius:2, backgroundColor:buttonBg, // @ts-ignore
          boxShadow:btnShadow }} />

        {/* ── Right: Power, Camera Control ─────────────────────────────── */}
        <View style={{ position:"absolute", right:0, top:185, width:BTN_W, height:88, borderRadius:2, backgroundColor:buttonBg, // @ts-ignore
          boxShadow:btnShadow }} />
        <View style={{ position:"absolute", right:0, top:508, width:BTN_W, height:36, borderRadius:4, backgroundColor:buttonBg, // @ts-ignore
          boxShadow:btnShadow }} />

        {/* ── Titanium frame ────────────────────────────────────────────── */}
        <View style={{
          position:"absolute", left:BTN_W+BTN_GAP, top:0,
          width:PHONE_W, height:PHONE_H,
          borderRadius:R_OUT, padding:FRAME,
          backgroundColor:frameBg,
          // @ts-ignore
          boxShadow:[
            "0 80px 200px rgba(0,0,0,1)",
            "0 24px 60px rgba(0,0,0,0.85)",
            "0 8px 20px rgba(0,0,0,0.7)",
            "0 0 0 0.5px rgba(255,255,255,0.10)",
            "inset 0 2px 0 rgba(255,255,255,0.24)",
            "inset 0 -2px 0 rgba(0,0,0,0.95)",
            "inset 3px 0 6px rgba(255,255,255,0.06)",
            "inset -3px 0 6px rgba(0,0,0,0.60)",
          ].join(", "),
        }}>

          {/* ── Black glass ───────────────────────────────────────────────── */}
          <View style={{
            flex:1, borderRadius:R_GLASS, backgroundColor:"#080808", overflow:"hidden",
            // @ts-ignore
            boxShadow:"inset 0 0 50px rgba(0,0,0,0.6)",
          }}>

            {/* ── Screen — app at native 390×844 ─────────────────────────── */}
            <View style={{
              position:"absolute", top:BEZEL, left:BEZEL,
              width:APP_W, height:APP_H,
              borderRadius:R_SCR, overflow:"hidden",
              backgroundColor:"#000",
              // @ts-ignore
              boxShadow:"0 0 0 0.5px rgba(255,255,255,0.05)",
            }}>
              {children}
            </View>

            {/* ── Dynamic Island ────────────────────────────────────────────── */}
            <View style={{
              position:"absolute",
              top:BEZEL - 1, left:(GLASS_W - DI_W)/2,
              width:DI_W, height:DI_H,
              borderRadius:DI_H/2,
              backgroundColor:"#000",
              zIndex:10,
              flexDirection:"row", alignItems:"center",
              justifyContent:"flex-end", paddingRight:17,
              // @ts-ignore
              boxShadow:"0 0 0 0.8px rgba(255,255,255,0.07), inset 0 -1px 3px rgba(0,0,0,0.9)",
            }}>
              {/* Front camera */}
              <View style={{
                width:11, height:11, borderRadius:6,
                backgroundColor:"#07101e",
                // @ts-ignore
                boxShadow:"0 0 0 1.5px rgba(255,255,255,0.07), inset 0 0 4px rgba(80,120,255,0.18)",
              }} />
            </View>

            {/* ── Glass sheen (top 30%) ─────────────────────────────────────── */}
            <View style={{
              position:"absolute", top:0, left:0, right:0,
              height:GLASS_H * 0.3,
              borderTopLeftRadius:R_GLASS, borderTopRightRadius:R_GLASS,
              backgroundColor:"rgba(255,255,255,0.025)",
              pointerEvents:"none", zIndex:20,
            }} />

            {/* ── Home indicator ────────────────────────────────────────────── */}
            <View style={{
              position:"absolute",
              bottom:BEZEL+6, left:(GLASS_W-130)/2,
              width:130, height:5, borderRadius:3,
              backgroundColor:"rgba(255,255,255,0.28)",
              zIndex:10,
            }} />

          </View>
        </View>
      </View>
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    CormorantGaramond_300Light,
    CormorantGaramond_300Light_Italic,
    CormorantGaramond_400Regular,
    CormorantGaramond_400Regular_Italic,
    Inter_400Regular,
    Inter_500Medium,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  const app = (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <OnboardingProvider>
                <RootStack />
              </OnboardingProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );

  if (Platform.OS === "web") {
    return (
      <IPhoneFrame>
        {/* Provider wraps everything so any screen can mount portals.
            Host is placed AFTER app content → renders above tab bar in DOM order. */}
        <ModalPortalProvider>
          <View style={{ flex: 1 }}>
            {app}
            <ModalPortalHost />
          </View>
        </ModalPortalProvider>
      </IPhoneFrame>
    );
  }

  return app;
}
