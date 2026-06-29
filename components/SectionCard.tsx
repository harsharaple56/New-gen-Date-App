import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../theme/theme';

type SectionCardProps = {
  label: string;
  value?: string;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * Light gray rounded card with an uppercase label and a value.
 * Used for prompt answers like "MY SUNDAY" / "Flea markets & old books".
 */
const SectionCard: React.FC<SectionCardProps> = ({ label, value, children, style }) => (
  <View style={[styles.card, style]}>
    <Text style={styles.label}>{label}</Text>
    {value ? <Text style={styles.value}>{value}</Text> : children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.lg,
    padding: spacing.xl,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  value: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});

export default SectionCard;
