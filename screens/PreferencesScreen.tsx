import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import Screen from '../components/Screen';
import ScreenHeader from '../components/ScreenHeader';
import Segmented from '../components/Segmented';
import Stepper from '../components/Stepper';
import ListRow from '../components/ListRow';
import { colors, radius, spacing } from '../theme/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Preferences'>;

const PreferencesScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [showMe, setShowMe] = useState('Everyone');
  const [ageMin, setAgeMin] = useState(24);
  const [ageMax, setAgeMax] = useState(34);
  const [distance, setDistance] = useState(25);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  return (
    <Screen>
      <ScreenHeader title="Preferences" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.section}>SHOW ME</Text>
        <Segmented options={['Women', 'Men', 'Everyone']} value={showMe} onChange={setShowMe} />

        <Text style={styles.section}>AGE RANGE</Text>
        <View style={styles.card}>
          <Stepper label="Minimum" value={ageMin} min={18} max={ageMax} onChange={setAgeMin} />
          <View style={styles.divider} />
          <Stepper label="Maximum" value={ageMax} min={ageMin} max={70} onChange={setAgeMax} />
        </View>

        <Text style={styles.section}>DISTANCE</Text>
        <View style={styles.card}>
          <Stepper label="Maximum distance" value={distance} suffix=" mi" min={1} max={100} step={5} onChange={setDistance} />
        </View>

        <Text style={styles.section}>FILTERS</Text>
        <ListRow icon="shield-checkmark-outline" label="Verified profiles only" toggle toggleValue={verifiedOnly} onToggle={setVerifiedOnly} />
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.xl },
  section: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
    color: colors.textSecondary,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  divider: { height: 1, backgroundColor: colors.divider },
});

export default PreferencesScreen;
