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

type Nav = NativeStackNavigationProp<RootStackParamList, 'BlockReport'>;

const REASONS = [
  'Inappropriate photos',
  'Fake profile or scam',
  'Harassment or hate speech',
  'Underage user',
  'Something else',
];

const BlockReportScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Screen>
      <ScreenHeader title="Block & Report" onBack={() => navigation.goBack()} />
      <View style={styles.container}>
        <Text style={styles.title}>What's going on?</Text>
        <Text style={styles.subtitle}>
          Your report is anonymous. We review every one to keep Align safe.
        </Text>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
          {REASONS.map((reason) => {
            const isSelected = selected === reason;
            return (
              <TouchableOpacity
                key={reason}
                activeOpacity={0.8}
                style={[styles.option, isSelected && styles.optionSelected]}
                onPress={() => setSelected(reason)}
              >
                <Text style={styles.optionText}>{reason}</Text>
                <Ionicons
                  name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                  size={22}
                  color={isSelected ? colors.purple : colors.textMuted}
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <PrimaryButton
          label="Block & Report"
          variant="black"
          disabled={!selected}
          onPress={() => navigation.goBack()}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: spacing.xl },
  title: { fontSize: 30, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: 17, lineHeight: 24, color: colors.textSecondary, marginTop: spacing.sm },
  list: { paddingVertical: spacing.xl, gap: spacing.md },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.inputBorder,
  },
  optionSelected: { borderColor: colors.purple },
  optionText: { fontSize: 17, color: colors.textPrimary },
});

export default BlockReportScreen;
