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

type Nav = NativeStackNavigationProp<RootStackParamList, 'PromptAnswers'>;

type Prompt = { question: string; answer: string };

const PROMPTS: Prompt[] = [
  { question: 'MY SUNDAY', answer: 'Flea markets & old books' },
  { question: 'QUICKEST HEART PATH', answer: 'Street tacos & good playlists' },
  { question: 'A SHOWER THOUGHT I HAD', answer: '' },
];

const PromptAnswersScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [prompts] = useState(PROMPTS);
  const answered = prompts.filter((p) => p.answer.trim()).length;

  return (
    <Screen>
      <ScreenHeader onBack={() => navigation.goBack()} />
      <View style={styles.container}>
        <Text style={styles.title}>Add some prompts</Text>
        <Text style={styles.subtitle}>Answer at least 2 — they spark the best conversations.</Text>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
          {prompts.map((prompt) => (
            <TouchableOpacity key={prompt.question} activeOpacity={0.8} style={styles.card}>
              <Text style={styles.question}>{prompt.question}</Text>
              {prompt.answer ? (
                <Text style={styles.answer}>{prompt.answer}</Text>
              ) : (
                <View style={styles.addRow}>
                  <Ionicons name="add-circle-outline" size={20} color={colors.purple} />
                  <Text style={styles.addText}>Tap to answer</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        <PrimaryButton
          label="Continue"
          variant="purple"
          disabled={answered < 2}
          onPress={() => navigation.navigate('VoiceIntro')}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: spacing.xl },
  title: { fontSize: 30, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: 17, color: colors.textSecondary, marginTop: spacing.sm },
  list: { paddingVertical: spacing.xl, gap: spacing.lg },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  question: { fontSize: 13, fontWeight: '600', letterSpacing: 1, color: colors.textSecondary, marginBottom: spacing.sm },
  answer: { fontSize: 20, fontWeight: '600', color: colors.textPrimary },
  addRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  addText: { fontSize: 17, color: colors.purple, fontWeight: '500' },
});

export default PromptAnswersScreen;
