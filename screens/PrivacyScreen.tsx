import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import Screen from '../components/Screen';
import ScreenHeader from '../components/ScreenHeader';
import ListRow from '../components/ListRow';
import { colors, spacing } from '../theme/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Privacy'>;

const PrivacyScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [incognito, setIncognito] = useState(false);
  const [readReceipts, setReadReceipts] = useState(true);
  const [showDistance, setShowDistance] = useState(true);
  const [showActive, setShowActive] = useState(false);

  return (
    <Screen>
      <ScreenHeader title="Privacy" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>Control who can see you and how your activity is shared.</Text>

        <Text style={styles.section}>VISIBILITY</Text>
        <ListRow icon="eye-off-outline" label="Incognito Mode" toggle toggleValue={incognito} onToggle={setIncognito} />
        <ListRow icon="navigate-outline" label="Show My Distance" toggle toggleValue={showDistance} onToggle={setShowDistance} />
        <ListRow icon="radio-outline" label="Show When Active" toggle toggleValue={showActive} onToggle={setShowActive} />

        <Text style={styles.section}>MESSAGING</Text>
        <ListRow icon="checkmark-done-outline" label="Read Receipts" toggle toggleValue={readReceipts} onToggle={setReadReceipts} />

        <Text style={styles.section}>DATA</Text>
        <ListRow icon="download-outline" label="Download My Data" onPress={() => {}} />
        <ListRow icon="trash-outline" label="Delete Account" danger onPress={() => {}} />
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.xl },
  intro: { fontSize: 16, lineHeight: 23, color: colors.textSecondary, marginBottom: spacing.sm },
  section: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
    color: colors.textSecondary,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
});

export default PrivacyScreen;
