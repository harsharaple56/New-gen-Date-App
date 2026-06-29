import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import Screen from '../components/Screen';
import ScreenHeader from '../components/ScreenHeader';
import PrimaryButton from '../components/PrimaryButton';
import { colors, radius, spacing } from '../theme/theme';
import { useAppStore } from '../store/useAppStore';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Verification'>;

const STEPS = [
  'Take a quick selfie matching the pose',
  'Our team confirms it\'s really you',
  'Get a verified badge on your profile',
];

const VerificationScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);

  return (
    <Screen>
      <ScreenHeader onBack={() => navigation.goBack()} />
      <View style={styles.container}>
        <View style={styles.poseWrap}>
          <View style={styles.pose}>
            <Ionicons name="person" size={70} color={colors.purple} />
            <View style={styles.badge}>
              <Ionicons name="checkmark" size={18} color={colors.textOnDark} />
            </View>
          </View>
        </View>

        <Text style={styles.title}>Get verified</Text>
        <Text style={styles.subtitle}>
          Verified profiles build trust and get more intros. It only takes a moment.
        </Text>

        <View style={styles.steps}>
          {STEPS.map((step, index) => (
            <View key={step} style={styles.step}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        <View style={styles.spacer} />

        <PrimaryButton label="Start Verification" variant="purple" onPress={() => completeOnboarding()} />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: spacing.xl },
  poseWrap: { alignItems: 'center', marginTop: spacing.lg },
  pose: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.purpleSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.background,
  },
  title: { fontSize: 30, fontWeight: '800', color: colors.textPrimary, textAlign: 'center', marginTop: spacing.xl, letterSpacing: -0.5 },
  subtitle: { fontSize: 17, lineHeight: 24, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm },
  steps: { marginTop: spacing.xl, gap: spacing.lg },
  step: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  stepNum: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.purpleSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: { fontSize: 15, fontWeight: '700', color: colors.purple },
  stepText: { flex: 1, fontSize: 16, color: colors.textPrimary },
  spacer: { flex: 1 },
});

export default VerificationScreen;
