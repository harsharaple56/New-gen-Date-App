import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme/theme';
import PrimaryButton from './PrimaryButton';

const base = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    gap: spacing.lg,
  },
  title: { fontSize: 20, fontWeight: '700', color: colors.textPrimary, textAlign: 'center' },
  subtitle: { fontSize: 16, lineHeight: 23, color: colors.textSecondary, textAlign: 'center' },
});

/** Full-screen loading spinner. */
export const LoadingState: React.FC<{ label?: string }> = ({ label }) => (
  <View style={base.center}>
    <ActivityIndicator size="large" color={colors.purple} />
    {label ? <Text style={base.subtitle}>{label}</Text> : null}
  </View>
);

/** Full-screen error with a retry button. */
export const ErrorState: React.FC<{ message?: string; onRetry?: () => void }> = ({
  message = "Something went wrong.",
  onRetry,
}) => (
  <View style={base.center}>
    <View style={styles.iconWrap}>
      <Ionicons name="cloud-offline-outline" size={32} color={colors.danger} />
    </View>
    <Text style={base.title}>We hit a snag</Text>
    <Text style={base.subtitle}>{message}</Text>
    {onRetry ? <PrimaryButton label="Try Again" variant="purple" onPress={onRetry} style={styles.retry} /> : null}
  </View>
);

/** Inline empty placeholder for lists. */
export const EmptyState: React.FC<{
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
}> = ({ icon = 'sparkles-outline', title, subtitle }) => (
  <View style={base.center}>
    <View style={styles.iconWrap}>
      <Ionicons name={icon} size={32} color={colors.purple} />
    </View>
    <Text style={base.title}>{title}</Text>
    {subtitle ? <Text style={base.subtitle}>{subtitle}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retry: { alignSelf: 'stretch', marginTop: spacing.sm },
});

export default { LoadingState, ErrorState, EmptyState };
