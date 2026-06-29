import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, radius, spacing } from '../theme/theme';

type SegmentedProps = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

/**
 * Pill segmented control used for choices like "Show me: Women / Men / Everyone".
 */
const Segmented: React.FC<SegmentedProps> = ({ options, value, onChange }) => (
  <View style={styles.container}>
    {options.map((option) => {
      const active = option === value;
      return (
        <TouchableOpacity
          key={option}
          activeOpacity={0.8}
          style={[styles.segment, active && styles.segmentActive]}
          onPress={() => onChange(option)}
        >
          <Text style={[styles.label, active && styles.labelActive]}>{option}</Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: colors.surface,
  },
  label: { fontSize: 16, fontWeight: '600', color: colors.textSecondary },
  labelActive: { color: colors.textPrimary },
});

export default Segmented;
