import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import Screen from '../components/Screen';
import { colors } from '../theme/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();

  useEffect(() => {
    const timer = setTimeout(() => navigation.replace('Welcome'), 1600);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <Screen showStatusBar={false}>
      <View style={styles.container}>
        <View style={styles.mark}>
          <Ionicons name="sparkles" size={34} color={colors.purple} />
        </View>
        <Text style={styles.wordmark}>Align</Text>
        <Text style={styles.tagline}>Dating, intentionally</Text>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  mark: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: colors.purpleSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  wordmark: {
    fontSize: 40,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});

export default SplashScreen;
