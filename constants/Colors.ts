/**
 * Coterie Design Tokens — Apple HIG · Monochrome
 */

export const RADIUS = {
  xs:     6,
  sm:     10,
  md:     14,
  lg:     16,
  xl:     20,
  sheet:  24,
  pill:   100,
} as const;

export const SHADOW = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 3,
  },
  modal: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 10,
  },
} as const;

export const DARK = {
  bg:         "#0A0A0A",
  surface:    "#1C1C1E",
  elevated:   "#2C2C2E",
  border:     "rgba(255,255,255,0.09)",
  text:       "#F2F1EF",
  muted:      "#8E8E93",
  dim:        "rgba(242,241,239,0.28)",
  icon:       "#636366",
  iconActive: "#F2F1EF",
  fill:       "rgba(255,255,255,0.07)",
  invertBg:   "#F2F1EF",
  invertText: "#0A0A0A",
  overlay:    "rgba(0,0,0,0.6)",
} as const;

export const LIGHT = {
  bg:         "#F2F2F7",
  surface:    "#FFFFFF",
  elevated:   "#F2F2F7",
  border:     "rgba(0,0,0,0.08)",
  text:       "#0A0A0A",
  muted:      "#8E8E93",
  dim:        "rgba(0,0,0,0.28)",
  icon:       "#8E8E93",
  iconActive: "#0A0A0A",
  fill:       "rgba(0,0,0,0.05)",
  invertBg:   "#0A0A0A",
  invertText: "#F2F1EF",
  overlay:    "rgba(0,0,0,0.4)",
} as const;

export type AppTheme = typeof DARK;

export const FONT = {
  serifLight:       "CormorantGaramond_300Light",
  serifLightItalic: "CormorantGaramond_300Light_Italic",
  serifRegular:     "CormorantGaramond_400Regular",
  serifItalic:      "CormorantGaramond_400Regular_Italic",
  sansRegular:      "Inter_400Regular",
  sansMedium:       "Inter_500Medium",
} as const;
