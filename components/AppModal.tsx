/**
 * AppModal — cross-platform modal that stays inside the iPhone frame on web.
 *
 * Problem: React Native's <Modal> portals to document.body, escaping the frame.
 * Previous fix (in-tree absolute) was blocked by the CustomTabBar, which renders
 * AFTER screen content in the DOM and therefore always sits on top regardless of
 * z-index, because they live in different CSS stacking contexts.
 *
 * Real fix: use ModalPortalContext to mount the overlay in (app)/_layout.tsx,
 * AFTER <Tabs> in the DOM. That guarantees it renders above the CustomTabBar
 * while still being clipped by the iPhone frame's overflow:hidden container.
 *
 * On native: delegates to <Modal> unchanged — zero behaviour change on device.
 */

import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Platform,
  Pressable,
  View,
} from "react-native";
import { useModalPortal } from "@/contexts/ModalPortalContext";

interface AppModalProps {
  visible: boolean;
  onRequestClose?: () => void;
  animationType?: "slide" | "fade" | "none";
  presentationStyle?: "pageSheet" | "fullScreen" | "formSheet" | "overFullScreen";
  transparent?: boolean;
  children?: React.ReactNode;
}

// ── Native ────────────────────────────────────────────────────────────────────
function NativeModal({ visible, onRequestClose, animationType, presentationStyle, transparent, children }: AppModalProps) {
  return (
    <Modal
      visible={visible}
      onRequestClose={onRequestClose}
      animationType={animationType ?? "slide"}
      presentationStyle={presentationStyle ?? "pageSheet"}
      transparent={transparent}
    >
      {children}
    </Modal>
  );
}

// ── Web: sheet that slides up from bottom ─────────────────────────────────────
function WebSheetContent({ visible, onRequestClose, children }: AppModalProps) {
  const anim = useRef(new Animated.Value(0)).current;
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (visible) {
      setActive(true);
      Animated.spring(anim, { toValue: 1, useNativeDriver: false, tension: 65, friction: 11 }).start();
    } else {
      Animated.timing(anim, { toValue: 0, duration: 240, useNativeDriver: false })
        .start(() => setActive(false));
    }
  }, [visible]);

  if (!active && !visible) return null;

  const backdropOpacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.45] });
  const translateY      = anim.interpolate({ inputRange: [0, 1], outputRange: [900, 0] });

  return (
    <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} pointerEvents="box-none">
      {/* Backdrop */}
      <Animated.View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "#000", opacity: backdropOpacity }}>
        <Pressable style={{ flex: 1 }} onPress={onRequestClose} />
      </Animated.View>

      {/* Sheet — top: 7% gives the same pageSheet look, bottom: 0 fills to edge */}
      <Animated.View style={{
        position: "absolute",
        top: "7%" as any,
        left: 0, right: 0, bottom: 0,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: "hidden",
        transform: [{ translateY }],
      }}>
        {children}
      </Animated.View>
    </View>
  );
}

// ── Web: full-screen fade (transparent=true, animationType="fade") ─────────────
function WebFadeContent({ visible, children }: AppModalProps) {
  const anim = useRef(new Animated.Value(0)).current;
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (visible) {
      setActive(true);
      Animated.timing(anim, { toValue: 1, duration: 180, useNativeDriver: false }).start();
    } else {
      Animated.timing(anim, { toValue: 0, duration: 180, useNativeDriver: false })
        .start(() => setActive(false));
    }
  }, [visible]);

  if (!active && !visible) return null;

  return (
    <Animated.View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: anim }}>
      {children}
    </Animated.View>
  );
}

// ── Web wrapper: mounts content via portal so it renders above the tab bar ────
function WebModal(props: AppModalProps) {
  const { mount, unmount } = useModalPortal();
  // useId gives a stable unique key for this modal instance
  const id = useRef(`modal-${Math.random().toString(36).slice(2)}`).current;

  const Content = (props.transparent || props.animationType === "fade")
    ? WebFadeContent
    : WebSheetContent;

  useEffect(() => {
    mount(id, <Content key={id} {...props} />);
  }, [props.visible, props.children]);

  useEffect(() => {
    return () => unmount(id);
  }, []);

  return null; // actual UI is rendered in the portal host
}

export default function AppModal(props: AppModalProps) {
  if (Platform.OS === "web") return <WebModal {...props} />;
  return <NativeModal {...props} />;
}
