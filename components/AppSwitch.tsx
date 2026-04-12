/**
 * AppSwitch — cross-platform toggle that exactly matches the native iOS UISwitch.
 *
 * Reference: iOS Alarm app toggle (UISwitch).
 *   - Track 51×31 px, thumb 27×27 px, 2 px padding each side
 *   - OFF track: solid #e5e5ea (iOS system grey-5)   → mapped to trackColor.false
 *   - ON  track: solid colour                         → mapped to trackColor.true
 *   - Thumb: pure white, 3-layer drop-shadow for iOS depth
 *   - Spring animation on toggle
 *
 * On web: custom View-based component (RN Web ignores Switch trackColor).
 * On native: delegates to the built-in <Switch> unchanged.
 */

import React, { useRef, useEffect } from "react";
import { Animated, Platform, Pressable, Switch, View } from "react-native";

interface AppSwitchProps {
  value: boolean;
  onValueChange: (v: boolean) => void;
  trackColor?: { false?: string; true?: string };
  thumbColor?: string;
  ios_backgroundColor?: string;
  disabled?: boolean;
}

// ── Native ────────────────────────────────────────────────────────────────────
function NativeSwitch({ value, onValueChange, trackColor, thumbColor, ios_backgroundColor, disabled }: AppSwitchProps) {
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={trackColor}
      thumbColor={thumbColor}
      ios_backgroundColor={ios_backgroundColor}
      disabled={disabled}
    />
  );
}

// ── Exact iOS UISwitch dimensions ────────────────────────────────────────────
const TW = 51;   // track width
const TH = 31;   // track height
const TD = 27;   // thumb diameter
const TP = 2;    // thumb padding from track edge

// ── Web ───────────────────────────────────────────────────────────────────────
function WebSwitch({ value, onValueChange, trackColor, disabled }: AppSwitchProps) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: value ? 1 : 0,
      useNativeDriver: false,
      // iOS spring feel
      tension: 200,
      friction: 20,
    }).start();
  }, [value]);

  // iOS system colours — these match exactly what you see in the Alarm app
  const offTrack = trackColor?.false ?? "#e5e5ea";
  const onTrack  = trackColor?.true  ?? "#34c759";   // iOS green — overridden by caller for this app

  const trackColor_ = anim.interpolate({ inputRange: [0, 1], outputRange: [offTrack, onTrack] });
  const thumbLeft   = anim.interpolate({ inputRange: [0, 1], outputRange: [TP, TW - TD - TP] });

  return (
    <Pressable
      onPress={() => { if (!disabled) onValueChange(!value); }}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      style={{ opacity: disabled ? 0.38 : 1 }}
    >
      {/* Track */}
      <Animated.View style={{
        width: TW,
        height: TH,
        borderRadius: TH / 2,
        backgroundColor: trackColor_,
        justifyContent: "center",
      }}>
        {/* Thumb */}
        <Animated.View style={{
          position: "absolute",
          left: thumbLeft,
          width: TD,
          height: TD,
          borderRadius: TD / 2,
          backgroundColor: "#ffffff",
          // Three-layer shadow — taken from Apple's UISwitch rendering:
          // 1. Soft ambient shadow
          // 2. Medium directional shadow
          // 3. Tight contact shadow
          // @ts-ignore
          boxShadow: [
            "0 3px 1px rgba(0,0,0,0.06)",
            "0 2px 2px rgba(0,0,0,0.10)",
            "0 3px 3px rgba(0,0,0,0.05)",
          ].join(", "),
        }} />
      </Animated.View>
    </Pressable>
  );
}

export default function AppSwitch(props: AppSwitchProps) {
  if (Platform.OS === "web") return <WebSwitch {...props} />;
  return <NativeSwitch {...props} />;
}
