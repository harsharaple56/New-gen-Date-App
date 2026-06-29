import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import Segmented from '../components/Segmented';
import Stepper from '../components/Stepper';
import Tag from '../components/Tag';
import PrimaryButton from '../components/PrimaryButton';
import { colors, radius, spacing } from '../theme/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'FiltersSheet'>;

const INTERESTS = ['Travel', 'Art', 'Music', 'Coffee', 'Films', 'Hiking'];

const FiltersSheetScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [sort, setSort] = useState('Most aligned');
  const [distance, setDistance] = useState(25);
  const [active, setActive] = useState<string[]>(['Travel']);

  const toggle = (interest: string) =>
    setActive((prev) => (prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]));

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => navigation.goBack()} />

      <View style={styles.sheet}>
        <View style={styles.handle} />
        <View style={styles.headerRow}>
          <Text style={styles.title}>Filters</Text>
          <TouchableOpacity onPress={() => setActive([])}>
            <Text style={styles.reset}>Reset</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>SORT BY</Text>
        <Segmented options={['Newest', 'Nearby', 'Most aligned']} value={sort} onChange={setSort} />

        <Text style={styles.label}>MAX DISTANCE</Text>
        <View style={styles.card}>
          <Stepper label="Distance" value={distance} suffix=" mi" min={1} max={100} step={5} onChange={setDistance} />
        </View>

        <Text style={styles.label}>INTERESTS</Text>
        <View style={styles.chips}>
          {INTERESTS.map((interest) => (
            <Tag key={interest} label={interest} selected={active.includes(interest)} onPress={() => toggle(interest)} />
          ))}
        </View>

        <PrimaryButton label="Apply Filters" variant="purple" style={styles.apply} onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(17,17,20,0.45)' },
  backdrop: { ...StyleSheet.absoluteFillObject },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.inputBorder,
    marginBottom: spacing.lg,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 24, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.4 },
  reset: { fontSize: 16, fontWeight: '600', color: colors.purple },
  label: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
    color: colors.textSecondary,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, paddingHorizontal: spacing.lg, paddingVertical: spacing.xs },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  apply: { marginTop: spacing.xxl },
});

export default FiltersSheetScreen;
