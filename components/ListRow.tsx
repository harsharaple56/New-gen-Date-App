import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/theme';

type ListRowProps = {
  icon?: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  /** Render a trailing switch instead of a chevron. */
  toggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (value: boolean) => void;
  danger?: boolean;
};

/**
 * Single settings / menu row with an icon, label and trailing chevron or switch.
 */
const ListRow: React.FC<ListRowProps> = ({
  icon,
  label,
  value,
  onPress,
  toggle,
  toggleValue,
  onToggle,
  danger,
}) => (
  <TouchableOpacity
    activeOpacity={toggle ? 1 : 0.7}
    onPress={toggle ? undefined : onPress}
    style={styles.row}
  >
    {icon ? (
      <View style={[styles.iconWrap, danger && styles.iconWrapDanger]}>
        <Ionicons name={icon} size={20} color={danger ? colors.danger : colors.textPrimary} />
      </View>
    ) : null}
    <Text style={[styles.label, danger && styles.labelDanger]}>{label}</Text>
    {toggle ? (
      <Switch
        value={toggleValue}
        onValueChange={onToggle}
        trackColor={{ true: colors.purple, false: colors.surfaceAlt }}
        thumbColor={colors.surface}
      />
    ) : (
      <View style={styles.trailing}>
        {value ? <Text style={styles.value}>{value}</Text> : null}
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      </View>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    marginBottom: spacing.md,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapDanger: { backgroundColor: '#FBE9E9' },
  label: { flex: 1, fontSize: 17, fontWeight: '500', color: colors.textPrimary },
  labelDanger: { color: colors.danger },
  trailing: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  value: { fontSize: 16, color: colors.textSecondary },
});

export default ListRow;
