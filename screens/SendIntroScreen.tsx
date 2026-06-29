import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import Screen from '../components/Screen';
import Avatar from '../components/Avatar';
import Tag from '../components/Tag';
import PrimaryButton from '../components/PrimaryButton';
import { curatedMatches } from '../data/mock';
import { colors, radius, spacing } from '../theme/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'SendIntro'>;
type Rt = RouteProp<RootStackParamList, 'SendIntro'>;

const SendIntroScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const name = route.params?.name ?? 'Priya';
  const [message, setMessage] = useState('');
  const [voice, setVoice] = useState(false);

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>Send {name} an intro</Text>

        <View style={styles.avatars}>
          <Avatar source={curatedMatches[0].photo} size={64} />
          <Avatar source={curatedMatches[1].photo} size={64} style={styles.overlap} />
        </View>

        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Say something genuine..."
          placeholderTextColor={colors.textMuted}
          multiline
          style={styles.input}
        />

        <View style={styles.suggestions}>
          <Tag label="Mention travel" variant="outline" onPress={() => setMessage('I noticed you love to travel — where to next?')} />
          <Tag label="Ask about startups" variant="outline" onPress={() => setMessage('What are you building these days?')} />
        </View>

        <View style={styles.voiceRow}>
          <View style={styles.voiceLeft}>
            <Ionicons name="mic-outline" size={22} color={colors.textPrimary} />
            <Text style={styles.voiceText}>Or send a voice intro</Text>
          </View>
          <Switch
            value={voice}
            onValueChange={setVoice}
            trackColor={{ true: colors.purple, false: colors.surfaceAlt }}
            thumbColor={colors.surface}
          />
        </View>

        <View style={styles.spacer} />

        <PrimaryButton
          label="Send Intro"
          variant="purple"
          onPress={() => navigation.navigate('IntroSent')}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.sm },
  title: { fontSize: 30, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5 },
  avatars: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: spacing.xl,
  },
  overlap: { marginLeft: -18 },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    minHeight: 150,
    fontSize: 18,
    color: colors.textPrimary,
    textAlignVertical: 'top',
    fontStyle: 'italic',
  },
  suggestions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl },
  voiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
  },
  voiceLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  voiceText: { fontSize: 18, color: colors.textSecondary },
  spacer: { flex: 1 },
});

export default SendIntroScreen;
