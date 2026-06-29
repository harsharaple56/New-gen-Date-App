import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { colors, radius } from '../theme/theme';

type TagProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  variant?: 'solid' | 'outline';
  style?: StyleProp<ViewStyle>;
};

/**
 * Rounded chip used for interests, attributes and quick-reply suggestions.
 */
const Tag: React.FC<TagProps> = ({ label, selected = false, onPress, variant = 'solid', style }) => {
  const content = <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>;
  const containerStyle = [
    styles.base,
    variant === 'outline' && styles.outline,
    selected && styles.selected,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={containerStyle}>
        {content}
      </TouchableOpacity>
    );
  }
  return <View style={containerStyle}>{content}</View>;
};

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: radius.pill,
    backgroundColor: colors.chipBg,
  },
  outline: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  selected: {
    backgroundColor: colors.purple,
    borderColor: colors.purple,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.chipText,
  },
  labelSelected: {
    color: colors.textOnDark,
  },
});

export default Tag;
