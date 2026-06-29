/**
 * Central design tokens for the Align dating app.
 * Derived 1:1 from the Figma source files.
 */

export const colors = {
  // Surfaces
  background: '#F4F5F7',
  surface: '#FFFFFF',
  surfaceAlt: '#ECECEF',
  inputBorder: '#ECECEF',

  // Text
  textPrimary: '#111114',
  textSecondary: '#6E6E78',
  textMuted: '#9A9AA2',
  textOnDark: '#FFFFFF',

  // Brand
  purple: '#6C5CE7',
  purpleSoft: '#E9E6FB',
  black: '#111114',
  gold: '#BD9A4E',

  // Utility
  chipBg: '#ECECEF',
  chipText: '#2A2A2E',
  danger: '#E5484D',
  success: '#3DBA6B',
  divider: '#ECECEF',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 28,
  pill: 999,
} as const;

export const typography = {
  h1: { fontSize: 32, fontWeight: '800' as const, color: colors.textPrimary, letterSpacing: -0.5 },
  h2: { fontSize: 24, fontWeight: '700' as const, color: colors.textPrimary, letterSpacing: -0.3 },
  h3: { fontSize: 20, fontWeight: '700' as const, color: colors.textPrimary },
  title: { fontSize: 18, fontWeight: '600' as const, color: colors.textPrimary },
  body: { fontSize: 17, fontWeight: '400' as const, color: colors.textPrimary },
  bodySecondary: { fontSize: 17, fontWeight: '400' as const, color: colors.textSecondary },
  label: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  caption: { fontSize: 14, fontWeight: '400' as const, color: colors.textSecondary },
  button: { fontSize: 17, fontWeight: '700' as const },
} as const;

export const shadows = {
  card: {
    shadowColor: '#1B1B2A',
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  soft: {
    shadowColor: '#1B1B2A',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
} as const;

export const theme = { colors, spacing, radius, typography, shadows };
export default theme;
