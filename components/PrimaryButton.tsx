import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { colors, radius } from '../theme/theme';

export type ButtonVariant = 'purple' | 'black' | 'white';

type PrimaryButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

const BG: Record<ButtonVariant, string> = {
  purple: colors.purple,
  black: colors.black,
  white: colors.surface,
};

const FG: Record<ButtonVariant, string> = {
  purple: colors.textOnDark,
  black: colors.textOnDark,
  white: colors.textPrimary,
};

/**
 * Pill-shaped CTA used across the app. Three variants match the Figma system.
 */
const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onPress,
  variant = 'purple',
  disabled = false,
  loading = false,
  style,
}) => (
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={onPress}
    disabled={disabled || loading}
    style={[
      styles.base,
      { backgroundColor: BG[variant] },
      variant === 'white' && styles.outlined,
      disabled && styles.disabled,
      style,
    ]}
  >
    {loading ? (
      <ActivityIndicator color={FG[variant]} />
    ) : (
      <Text style={[styles.label, { color: FG[variant] }]}>{label}</Text>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  base: {
    height: 60,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: 17,
    fontWeight: '700',
  },
});

export default PrimaryButton;
