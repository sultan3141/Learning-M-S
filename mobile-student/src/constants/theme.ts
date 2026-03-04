export const COLORS_LIGHT = {
  primary: '#4F46E5',
  primaryLight: '#EEF2FF',
  primaryDark: '#3730A3',
  secondary: '#10B981',
  secondaryGhost: '#F0FDF4',
  secondaryGhostText: '#059669',
  danger: '#EF4444',
  warning: '#F59E0B',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  text: {
    primary: '#0F172A',
    secondary: '#475569',
    muted: '#94A3B8',
    light: '#CBD5E1',
    inverse: '#FFFFFF',
  },
  border: '#F1F5F9',
  progressBg: '#F1F5F9',
};

export const COLORS_DARK = {
  primary: '#818CF8', // Brighter indigo for better visibility
  primaryLight: '#312E81', // Deeper indigo-blue for ghost backgrounds
  primaryDark: '#4F46E5',
  secondary: '#10B981',
  secondaryGhost: '#064E3B',
  secondaryGhostText: '#34D399',
  danger: '#EF4444',
  warning: '#F59E0B',
  background: '#0F172A',
  surface: '#1E293B',
  card: '#1E293B',
  text: {
    primary: '#F8FAFC',
    secondary: '#94A3B8',
    muted: '#64748B', // Lightened from #475569 for better placeholder visibility
    light: '#475569', // Lightened from #334155
    inverse: '#FFFFFF',
  },
  border: '#334155',
  progressBg: '#334155',
};

// Default export for backward compatibility
export const COLORS = COLORS_LIGHT;

export const SPACING = {
  tiny: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  huge: 64,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
  },
};

export const TYPOGRAPHY = {
  h1: { fontSize: 32, fontWeight: '700' as const, letterSpacing: -0.5 },
  h2: { fontSize: 24, fontWeight: '700' as const, letterSpacing: -0.3 },
  h3: { fontSize: 20, fontWeight: '600' as const },
  body1: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  body2: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  meta: { fontSize: 13, fontWeight: '500' as const, color: '#475569' }, // Fallback color
  tag: { fontSize: 12, fontWeight: '600' as const, textTransform: 'uppercase' as const, letterSpacing: 0.5 },
};
