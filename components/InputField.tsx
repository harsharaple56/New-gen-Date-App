import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { colors, radius, spacing } from '../theme/theme';

type InputFieldProps = TextInputProps & {
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

/**
 * White rounded input with an optional label. Supports multiline text areas.
 */
const InputField: React.FC<InputFieldProps> = ({ label, containerStyle, style, multiline, ...rest }) => (
  <View style={containerStyle}>
    {label ? <Text style={styles.label}>{label}</Text> : null}
    <TextInput
      placeholderTextColor={colors.textMuted}
      multiline={multiline}
      style={[styles.input, multiline && styles.multiline, style]}
      {...rest}
    />
  </View>
);

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: 18,
    fontSize: 17,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  multiline: {
    minHeight: 140,
    textAlignVertical: 'top',
    paddingTop: spacing.xl,
  },
});

export default InputField;
