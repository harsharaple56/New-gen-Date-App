import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, shadows } from '../theme/theme';

type CenteredCardProps = {
  /** Rendered above the title — an icon, avatars or illustration. */
  media?: React.ReactNode;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
};

/**
 * Centered white card on the app background. Powers the success / empty
 * states (match made, premium unlocked, intro sent, no profiles, etc.).
 */
const CenteredCard: React.FC<CenteredCardProps> = ({ media, title, subtitle, children }) => (
  <View style={styles.wrap}>
    <View style={styles.card}>
      {media ? <View style={styles.media}>{media}</View> : null}
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children ? <View style={styles.actions}>{children}</View> : null}
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    ...shadows.card,
  },
  media: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 24,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  actions: {
    alignSelf: 'stretch',
    marginTop: spacing.xl,
    gap: spacing.lg,
  },
});

export default CenteredCard;
