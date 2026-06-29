import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import Screen from '../components/Screen';
import ScreenHeader from '../components/ScreenHeader';
import PrimaryButton from '../components/PrimaryButton';
import { colors, radius, spacing } from '../theme/theme';
import { useLogin } from '../services/queries';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [phone, setPhone] = useState('');
  const loginMutation = useLogin();

  const handleContinue = () => {
    const trimmed = phone.trim();
    if (!trimmed) return;
    loginMutation.mutate(trimmed, {
      onSettled: () => navigation.navigate('Otp', { phone: trimmed }),
    });
  };

  return (
    <Screen>
      <ScreenHeader onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <View>
            <Text style={styles.title}>What's your number?</Text>
            <Text style={styles.subtitle}>
              We'll text a code to verify it's really you. Standard rates may apply.
            </Text>

            <View style={styles.inputRow}>
              <View style={styles.country}>
                <Text style={styles.countryText}>🇺🇸 +1</Text>
              </View>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="(555) 000-0000"
                placeholderTextColor={colors.textMuted}
                keyboardType="phone-pad"
                style={styles.input}
              />
            </View>
          </View>

          <PrimaryButton
            label="Continue"
            variant="black"
            onPress={handleContinue}
          />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    justifyContent: 'space-between',
    paddingBottom: spacing.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 24,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xxl,
  },
  country: {
    height: 60,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countryText: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  input: {
    flex: 1,
    height: 60,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    fontSize: 17,
    color: colors.textPrimary,
  },
});

export default LoginScreen;
