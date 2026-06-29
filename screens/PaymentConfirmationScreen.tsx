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

type Nav = NativeStackNavigationProp<RootStackParamList, 'PaymentConfirmation'>;

const SummaryRow: React.FC<{ label: string; value: string; bold?: boolean }> = ({ label, value, bold }) => (
  <View style={styles.summaryRow}>
    <Text style={[styles.summaryLabel, bold && styles.bold]}>{label}</Text>
    <Text style={[styles.summaryValue, bold && styles.bold]}>{value}</Text>
  </View>
);

const PaymentConfirmationScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();

  return (
    <Screen>
      <ScreenHeader title="Confirm Purchase" onBack={() => navigation.goBack()} />
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <Ionicons name="sparkles" size={28} color={colors.gold} />
          </View>
          <Text style={styles.plan}>Align Premium · Yearly</Text>
          <Text style={styles.renew}>Renews automatically. Cancel anytime.</Text>

          <View style={styles.divider} />

          <SummaryRow label="Subscription" value="$99.00" />
          <SummaryRow label="Taxes" value="$8.20" />
          <View style={styles.divider} />
          <SummaryRow label="Total due today" value="$107.20" bold />
        </View>

        <View style={styles.payment}>
          <Ionicons name="card-outline" size={22} color={colors.textPrimary} />
          <Text style={styles.paymentText}>Apple Pay · •••• 4242</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </View>

        <View style={styles.spacer} />

        <PrimaryButton label="Pay $107.20" variant="black" onPress={() => navigation.navigate('PremiumSuccess')} />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.xl },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#F6EEDD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plan: { fontSize: 20, fontWeight: '700', color: colors.textPrimary, marginTop: spacing.md },
  renew: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  divider: { height: 1, backgroundColor: colors.divider, alignSelf: 'stretch', marginVertical: spacing.lg },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'stretch', paddingVertical: 4 },
  summaryLabel: { fontSize: 16, color: colors.textSecondary },
  summaryValue: { fontSize: 16, color: colors.textPrimary },
  bold: { fontWeight: '800', color: colors.textPrimary, fontSize: 18 },
  payment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  paymentText: { flex: 1, fontSize: 16, fontWeight: '500', color: colors.textPrimary },
  spacer: { flex: 1 },
});

export default PaymentConfirmationScreen;
