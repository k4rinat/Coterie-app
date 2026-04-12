/**
 * ModalPortalContext — renders AppModal overlays above the tab bar on web.
 *
 * Pattern:
 *  1. <ModalPortalProvider> wraps the entire app so all screens can call mount/unmount.
 *  2. <ModalPortalHost> is placed AFTER the app content in the DOM (in IPhoneFrame),
 *     which puts it above everything including the CustomTabBar.
 *
 * Only used on web. Native uses the OS modal mechanism directly.
 */

import React, {
  createContext, useCallback, useContext, useState,
} from "react";
import { View } from "react-native";

interface PortalEntry {
  id: string;
  element: React.ReactNode;
}

interface ModalPortalCtx {
  mount:   (id: string, element: React.ReactNode) => void;
  unmount: (id: string) => void;
}

// Default no-op — safe if provider is accidentally missing
export const ModalPortalContext = createContext<ModalPortalCtx>({
  mount:   () => {},
  unmount: () => {},
});

export function useModalPortal() {
  return useContext(ModalPortalContext);
}

// ── Provider — wrap the entire app ────────────────────────────────────────────
interface ProviderProps {
  children: React.ReactNode;
}

/** Internal context that shares the entries list with <ModalPortalHost> */
const EntriesContext = createContext<PortalEntry[]>([]);

export function ModalPortalProvider({ children }: ProviderProps) {
  const [entries, setEntries] = useState<PortalEntry[]>([]);

  const mount = useCallback((id: string, element: React.ReactNode) => {
    setEntries(prev => {
      const without = prev.filter(e => e.id !== id);
      return [...without, { id, element }];
    });
  }, []);

  const unmount = useCallback((id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  }, []);

  return (
    <ModalPortalContext.Provider value={{ mount, unmount }}>
      <EntriesContext.Provider value={entries}>
        {children}
      </EntriesContext.Provider>
    </ModalPortalContext.Provider>
  );
}

// ── Host — place AFTER app content so it renders above the tab bar ─────────────
export function ModalPortalHost() {
  const entries = useContext(EntriesContext);

  if (entries.length === 0) return null;

  return (
    <View
      style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      pointerEvents="box-none"
    >
      {entries.map(e => (
        <View
          key={e.id}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          pointerEvents="box-none"
        >
          {e.element}
        </View>
      ))}
    </View>
  );
}
