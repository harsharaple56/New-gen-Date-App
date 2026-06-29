import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme/theme';

type StepperProps = {
  label: string;
  value: number;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
};

/**
 * Labelled +/- stepper for numeric preferences like age and distance.
 */
const Stepper: React.FC<StepperProps> = ({
  label,
  value,
  suffix = '',
  min = 0,
  max = 100,
  step = 1,
  onChange,
}) => {
  const dec = () => onChange(Math.max(min, value - step));
  const inc = () => onChange(Math.min(max, value + step));

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.controls}>
        <TouchableOpacity style={styles.btn} onPress={dec} disabled={value <= min}>
          <Ionicons name="remove" size={20} color={value <= min ? colors.textMuted : colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.value}>
          {value}
          {suffix}
        </Text>
        <TouchableOpacity style={styles.btn} onPress={inc} disabled={value >= max}>
          <Ionicons name="add" size={20} color={value >= max ? colors.textMuted : colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.md },
  label: { fontSize: 17, color: colors.textPrimary },
  controls: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  btn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: { fontSize: 17, fontWeight: '700', color: colors.textPrimary, minWidth: 56, textAlign: 'center' },
});

export default Stepper;
