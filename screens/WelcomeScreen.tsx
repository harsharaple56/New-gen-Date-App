import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import { colors, spacing } from '../theme/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.hero}>
          <View style={styles.mark}>
            <Ionicons name="sparkles" size={28} color={colors.purple} />
          </View>
          <Text style={styles.title}>Meaningful{'\n'}connections, curated.</Text>
          <Text style={styles.subtitle}>
            Five hand-picked profiles a day. No endless swiping — just people you
            actually <Text style={styles.aligned}>align</Text> with.
          </Text>
        </View>

        <View style={styles.actions}>
          <PrimaryButton label="Get Started" variant="purple" onPress={() => navigation.navigate('Login')} />
          <View style={styles.signinRow}>
            <Text style={styles.signinText}>Already have an account? </Text>
            <Text style={styles.signinLink} onPress={() => navigation.navigate('Login')}>
              Sign in
            </Text>
          </View>
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'space-between',
    paddingBottom: spacing.xl,
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.lg,
  },
  mark: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.purpleSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.8,
    lineHeight: 42,
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 26,
    color: colors.textSecondary,
  },
  aligned: {
    color: colors.gold,
    fontWeight: '700',
  },
  actions: {
    gap: spacing.lg,
  },
  signinRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signinText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  signinLink: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.purple,
  },
});

export default WelcomeScreen;
