import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import Screen from '../components/Screen';
import ScreenHeader from '../components/ScreenHeader';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { colors, spacing } from '../theme/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Bio'>;

const MAX = 300;

const BioScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [bio, setBio] = useState('');

  return (
    <Screen>
      <ScreenHeader onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.container}>
          <Text style={styles.title}>Tell your story</Text>
          <Text style={styles.subtitle}>A genuine bio gets 3x more intros. Keep it real.</Text>

          <InputField
            value={bio}
            onChangeText={(text) => text.length <= MAX && setBio(text)}
            placeholder="I'm happiest when..."
            multiline
            containerStyle={styles.field}
          />
          <Text style={styles.counter}>
            {bio.length}/{MAX}
          </Text>

          <View style={styles.spacer} />

          <PrimaryButton
            label="Continue"
            variant="purple"
            disabled={bio.trim().length === 0}
            onPress={() => navigation.navigate('InterestSelection')}
          />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: spacing.xl },
  title: { fontSize: 30, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: 17, color: colors.textSecondary, marginTop: spacing.sm },
  field: { marginTop: spacing.xl },
  counter: { alignSelf: 'flex-end', marginTop: spacing.sm, fontSize: 14, color: colors.textMuted },
  spacer: { flex: 1 },
});

export default BioScreen;
