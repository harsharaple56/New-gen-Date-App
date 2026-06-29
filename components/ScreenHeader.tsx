import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme/theme';

type ScreenHeaderProps = {
  title?: string;
  onBack?: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
  rightLabel?: string;
};

/**
 * Standard top bar: optional back chevron, centered title and an optional action.
 */
const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  onBack,
  rightIcon,
  onRightPress,
  rightLabel,
}) => (
  <View style={styles.container}>
    <View style={styles.side}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} hitSlop={12} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={26} color={colors.textPrimary} />
        </TouchableOpacity>
      ) : null}
    </View>

    {title ? (
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
    ) : (
      <View />
    )}

    <View style={[styles.side, styles.sideRight]}>
      {rightLabel ? (
        <TouchableOpacity onPress={onRightPress} hitSlop={12}>
          <Text style={styles.rightLabel}>{rightLabel}</Text>
        </TouchableOpacity>
      ) : rightIcon ? (
        <TouchableOpacity onPress={onRightPress} hitSlop={12} style={styles.iconBtn}>
          <Ionicons name={rightIcon} size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      ) : null}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    height: 48,
  },
  side: {
    width: 60,
    justifyContent: 'center',
  },
  sideRight: {
    alignItems: 'flex-end',
  },
  iconBtn: {
    height: 40,
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  rightLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.purple,
  },
});

export default ScreenHeader;
