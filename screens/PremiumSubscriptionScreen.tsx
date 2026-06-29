import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import Screen from '../components/Screen';
import ScreenHeader from '../components/ScreenHeader';
import PrimaryButton from '../components/PrimaryButton';
import { colors, radius, spacing } from '../theme/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'PremiumSubscription'>;

const BENEFITS = [
  '5 curated profiles every day',
  'Priority intro sorting',
  'See everyone who likes you',
  'Unlimited rewinds & boosts',
];

type Plan = { id: string; label: string; price: string; note?: string; badge?: string };
const PLANS: Plan[] = [
  { id: 'yearly', label: 'Yearly', price: '$8.33/mo', note: 'Billed $99/year', badge: 'Best value' },
  { id: 'monthly', label: 'Monthly', price: '$14.99/mo', note: 'Billed monthly' },
];

const PremiumSubscriptionScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [selected, setSelected] = useState('yearly');

  return (
    <Screen>
      <ScreenHeader onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.crown}>
          <Ionicons name="sparkles" size={34} color={colors.gold} />
        </View>
        <Text style={styles.title}>Align Premium</Text>
        <Text style={styles.subtitle}>Date with intention. Connect with the people who matter most.</Text>

        <View style={styles.benefits}>
          {BENEFITS.map((b) => (
            <View key={b} style={styles.benefitRow}>
              <View style={styles.check}>
                <Ionicons name="checkmark" size={16} color={colors.purple} />
              </View>
              <Text style={styles.benefitText}>{b}</Text>
            </View>
          ))}
        </View>

        <View style={styles.plans}>
          {PLANS.map((plan) => {
            const isSelected = selected === plan.id;
            return (
              <TouchableOpacity
                key={plan.id}
                activeOpacity={0.9}
                style={[styles.plan, isSelected && styles.planSelected]}
                onPress={() => setSelected(plan.id)}
              >
                <View>
                  <Text style={styles.planLabel}>{plan.label}</Text>
                  {plan.note ? <Text style={styles.planNote}>{plan.note}</Text> : null}
                </View>
                <View style={styles.planRight}>
                  {plan.badge ? (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{plan.badge}</Text>
                    </View>
                  ) : null}
                  <Text style={styles.planPrice}>{plan.price}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton label="Continue" variant="black" onPress={() => navigation.navigate('PaymentConfirmation')} />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: spacing.xl, alignItems: 'center' },
  crown: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: '#F6EEDD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 30, fontWeight: '800', color: colors.textPrimary, marginTop: spacing.lg, letterSpacing: -0.5 },
  subtitle: { fontSize: 17, lineHeight: 24, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm },
  benefits: { alignSelf: 'stretch', marginTop: spacing.xl, gap: spacing.lg },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  check: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.purpleSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitText: { fontSize: 17, color: colors.textPrimary },
  plans: { alignSelf: 'stretch', marginTop: spacing.xl, gap: spacing.md },
  plan: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.inputBorder,
  },
  planSelected: { borderColor: colors.purple },
  planLabel: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  planNote: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },
  planRight: { alignItems: 'flex-end', gap: 4 },
  badge: { backgroundColor: colors.purpleSoft, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText: { fontSize: 12, fontWeight: '700', color: colors.purple },
  planPrice: { fontSize: 17, fontWeight: '700', color: colors.textPrimary },
  footer: { paddingHorizontal: spacing.xl, paddingBottom: spacing.sm, paddingTop: spacing.md },
});

export default PremiumSubscriptionScreen;
