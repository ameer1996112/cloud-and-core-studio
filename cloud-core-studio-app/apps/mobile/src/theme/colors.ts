import { useMemo } from "react";
import { useWindowDimensions } from "react-native";

export const colors = {
  navy: "#24201C",
  ink: "#24201C",
  ivory: "#F6F0E7",
  gold: "#B88A42",
  goldSoft: "#F5E7C9",
  blue: "#DDEAEC",
  sand: "#D9CBB8",
  slate: "#6F665E",
  mist: "#FFFaf3",
  rose: "#F3DCDE",
  moss: "#4F6F61",
  plum: "#386D73",
  white: "#FFFFFF",
  success: "#4F6F61",
  warning: "#B47B2A",
  danger: "#AA3F3F",
};

export const palette = {
  dark: {
    background: "#08090D",
    backgroundAlt: "#10141C",
    surface: "#121722",
    surfaceElevated: "#171E2B",
    surfaceGlass: "rgba(18,23,34,0.88)",
    surfaceQuiet: "#1D2532",
    border: "rgba(250,247,242,0.10)",
    borderStrong: "rgba(212,175,106,0.38)",
    primary: colors.gold,
    primaryMuted: "rgba(212,175,106,0.18)",
    accent: colors.blue,
    success: colors.success,
    successMuted: "rgba(50,106,90,0.22)",
    warning: colors.warning,
    warningMuted: "rgba(166,106,31,0.24)",
    danger: colors.danger,
    dangerMuted: "rgba(166,66,66,0.24)",
    textPrimary: colors.ivory,
    textSecondary: "#CBD4E2",
    textMuted: "#8E99AB",
    imageScrim: "rgba(8,9,13,0.58)",
    imageScrimStrong: "rgba(8,9,13,0.78)",
  },
  light: {
    background: colors.ivory,
    backgroundAlt: "#F4EFE7",
    surface: colors.white,
    surfaceElevated: colors.white,
    surfaceGlass: "rgba(255,255,255,0.85)",
    surfaceQuiet: "#F4EFE7",
    border: "rgba(17,24,39,0.10)",
    borderStrong: "rgba(212,175,106,0.36)",
    primary: colors.gold,
    primaryMuted: "rgba(212,175,106,0.15)",
    accent: colors.blue,
    success: colors.success,
    successMuted: "rgba(50,106,90,0.15)",
    warning: colors.warning,
    warningMuted: "rgba(166,106,31,0.15)",
    danger: colors.danger,
    dangerMuted: "rgba(166,66,66,0.15)",
    textPrimary: colors.navy,
    textSecondary: "#4F5968",
    textMuted: "#7B8493",
    imageScrim: "rgba(17,24,39,0.34)",
    imageScrimStrong: "rgba(17,24,39,0.54)",
  },
};

export const fitness = {
  appBg: colors.ivory,
  surface: "#FFFAF3",
  surfaceRaised: colors.white,
  surfaceSoft: "#EFE5D8",
  textPrimary: colors.ink,
  textSecondary: "#5F574F",
  textMuted: "#80776D",
  border: "rgba(65,52,42,0.14)",
  borderStrong: "rgba(79,111,97,0.34)",
  goldGlow: palette.dark.primaryMuted,
  blueGlow: "rgba(56,109,115,0.14)",
  imageScrim: "rgba(36,32,28,0.34)",
  imageScrimStrong: "rgba(36,32,28,0.52)",
  dangerGlow: "rgba(170,63,63,0.14)",
  successGlow: "rgba(79,111,97,0.16)",
};

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 56,
};

export const radii = {
  small: 16,
  medium: 22,
  large: 30,
  hero: 32,
  pill: 999,
  fullCard: 40,
};

export const typography = {
  display: { fontSize: 34, lineHeight: 42, fontWeight: "700" as const },
  h1: { fontSize: 28, lineHeight: 36, fontWeight: "700" as const },
  h2: { fontSize: 24, lineHeight: 30, fontWeight: "700" as const },
  h3: { fontSize: 18, lineHeight: 26, fontWeight: "700" as const },
  body: { fontSize: 15, lineHeight: 24, fontWeight: "400" as const },
  bodySmall: { fontSize: 13, lineHeight: 20, fontWeight: "400" as const },
  label: { fontSize: 12, lineHeight: 18, fontWeight: "700" as const },
  caption: { fontSize: 11, lineHeight: 16, fontWeight: "600" as const },
  button: { fontSize: 15, lineHeight: 20, fontWeight: "700" as const, letterSpacing: 0.2 },
};

export const shadows = {
  premium: {
    shadowColor: "#000000",
    shadowOpacity: 0.36,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 18 },
    elevation: 10,
  },
  soft: {
    shadowColor: "#000000",
    shadowOpacity: 0.24,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
};

export const editorial = {
  hairline: palette.dark.border,
  navyOverlay: palette.dark.imageScrim,
  ivoryOverlay: "rgba(250,247,242,0.92)",
  softGold: palette.dark.primaryMuted,
  quietShadow: shadows.soft,
};

export function useResponsiveMetrics() {
  const { width, height, fontScale } = useWindowDimensions();

  return useMemo(() => {
    const isSmall = width < 375;
    const isLarge = width >= 430;
    const isTablet = width >= 700;
    const maxContentWidth = isTablet ? 640 : undefined;
    const horizontalPadding = isSmall ? 16 : isTablet ? 32 : 20;
    const cardPadding = isSmall ? 16 : 20;
    const compact = isSmall || height < 700 || fontScale > 1.12;

    return {
      width,
      height,
      fontScale,
      isSmall,
      isLarge,
      isTablet,
      compact,
      maxContentWidth,
      horizontalPadding,
      cardPadding,
      heroHeight: compact ? 180 : isLarge ? 240 : 210,
      bottomInset: isSmall ? 104 : 116,
    };
  }, [fontScale, height, width]);
}
