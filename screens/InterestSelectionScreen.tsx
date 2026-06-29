import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import Screen from '../components/Screen';
import ScreenHeader from '../components/ScreenHeader';
import Tag from '../components/Tag';
import PrimaryButton from '../components/PrimaryButton';
import { interests } from '../data/mock';
import { colors, spacing } from '../theme/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'InterestSelection'>;

const MIN_SELECTION = 5;

const InterestSelectionScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (interest: string) => {
    setSelected((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest],
    );
  };

  const enough = selected.length >= MIN_SELECTION;

  return (
    <Screen>
      <ScreenHeader onBack={() => navigation.goBack()} />
      <View style={styles.container}>
        <Text style={styles.title}>What are you into?</Text>
        <Text style={styles.subtitle}>
          Pick at least {MIN_SELECTION}. We'll use these to find people you align with.
        </Text>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {interests.map((interest) => (
            <Tag
              key={interest}
              label={interest}
              selected={selected.includes(interest)}
              onPress={() => toggle(interest)}
            />
          ))}
        </ScrollView>

        <PrimaryButton
          label={enough ? 'Continue' : `Select ${MIN_SELECTION - selected.length} more`}
          variant="purple"
          disabled={!enough}
          onPress={() => navigation.navigate('DatingIntent')}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: spacing.xl },
  title: { fontSize: 30, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: 17, lineHeight: 24, color: colors.textSecondary, marginTop: spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, paddingVertical: spacing.xl },
});

export default InterestSelectionScreen;
