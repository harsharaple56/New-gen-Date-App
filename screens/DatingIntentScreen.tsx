import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import Screen from '../components/Screen';
import ScreenHeader from '../components/ScreenHeader';
import PrimaryButton from '../components/PrimaryButton';
import { colors, radius, spacing } from '../theme/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'DatingIntent'>;

type Intent = { id: string; icon: keyof typeof Ionicons.glyphMap; label: string; desc: string };
const INTENTS: Intent[] = [
  { id: 'relationship', icon: 'heart', label: 'A relationship', desc: 'Looking for something long-term' },
  { id: 'dating', icon: 'wine', label: 'Dating', desc: 'Open to seeing where things go' },
  { id: 'friends', icon: 'people', label: 'New friends', desc: 'Expanding my circle' },
  { id: 'unsure', icon: 'help-circle', label: 'Still figuring it out', desc: "I'll know it when I see it" },
];

const DatingIntentScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Screen>
      <ScreenHeader onBack={() => navigation.goBack()} />
      <View style={styles.container}>
        <Text style={styles.title}>What are you{'\n'}looking for?</Text>
        <Text style={styles.subtitle}>Be honest — it helps us curate better matches.</Text>

        <View style={styles.options}>
          {INTENTS.map((intent) => {
            const isSelected = selected === intent.id;
            return (
              <TouchableOpacity
                key={intent.id}
                activeOpacity={0.9}
                style={[styles.option, isSelected && styles.optionSelected]}
                onPress={() => setSelected(intent.id)}
              >
                <View style={[styles.iconWrap, isSelected && styles.iconWrapSelected]}>
                  <Ionicons name={intent.icon} size={22} color={isSelected ? colors.textOnDark : colors.purple} />
                </View>
                <View style={styles.optionBody}>
                  <Text style={styles.optionLabel}>{intent.label}</Text>
                  <Text style={styles.optionDesc}>{intent.desc}</Text>
                </View>
                {isSelected ? <Ionicons name="checkmark-circle" size={24} color={colors.purple} /> : null}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.spacer} />

        <PrimaryButton
          label="Continue"
          variant="purple"
          disabled={!selected}
          onPress={() => navigation.navigate('PromptAnswers')}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: spacing.xl },
  title: { fontSize: 32, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: 17, color: colors.textSecondary, marginTop: spacing.sm },
  options: { gap: spacing.md, marginTop: spacing.xl },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.inputBorder,
  },
  optionSelected: { borderColor: colors.purple },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.purpleSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapSelected: { backgroundColor: colors.purple },
  optionBody: { flex: 1 },
  optionLabel: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  optionDesc: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },
  spacer: { flex: 1 },
});

export default DatingIntentScreen;
