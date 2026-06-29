import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import Screen from '../components/Screen';
import ScreenHeader from '../components/ScreenHeader';
import PrimaryButton from '../components/PrimaryButton';
import { colors, radius, spacing } from '../theme/theme';
import { useVerifyOtp } from '../services/queries';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Otp'>;
type OtpRoute = RouteProp<RootStackParamList, 'Otp'>;

const CODE_LENGTH = 6;

const OtpScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<OtpRoute>();
  const phone = route.params?.phone ?? '';
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const inputs = useRef<(TextInput | null)[]>([]);
  const verifyOtp = useVerifyOtp();

  // On success the store flips `isLoggedIn`, which swaps the navigator to the
  // onboarding flow automatically — no manual navigation needed here.
  const handleVerify = () => {
    const joined = code.join('');
    if (joined.length < CODE_LENGTH) return;
    verifyOtp.mutate({ phone, code: joined });
  };

  const handleChange = (text: string, index: number) => {
    const next = [...code];
    next[index] = text.slice(-1);
    setCode(next);
    if (text && index < CODE_LENGTH - 1) inputs.current[index + 1]?.focus();
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <Screen>
      <ScreenHeader onBack={() => navigation.goBack()} />
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>Enter the code</Text>
          <Text style={styles.subtitle}>We sent a 6-digit code to your phone.</Text>

          <View style={styles.codeRow}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputs.current[index] = ref)}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                keyboardType="number-pad"
                maxLength={1}
                style={[styles.cell, digit ? styles.cellFilled : null]}
              />
            ))}
          </View>

          <Text style={styles.resend}>
            Didn't get it? <Text style={styles.resendLink}>Resend code</Text>
          </Text>
        </View>

        <PrimaryButton label="Verify" variant="black" onPress={handleVerify} />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
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
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xxl,
  },
  cell: {
    width: 48,
    height: 60,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cellFilled: {
    borderColor: colors.purple,
  },
  resend: {
    marginTop: spacing.xl,
    fontSize: 16,
    color: colors.textSecondary,
  },
  resendLink: {
    color: colors.purple,
    fontWeight: '700',
  },
});

export default OtpScreen;
