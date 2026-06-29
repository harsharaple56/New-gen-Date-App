import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import { colors, spacing } from '../theme/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'NotificationPermission'>;

const NotificationPermissionScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconWrap}>
            <Ionicons name="notifications" size={44} color={colors.purple} />
          </View>
          <Text style={styles.title}>Never miss a connection</Text>
          <Text style={styles.subtitle}>
            Get notified the moment someone sends you an intro or your daily matches
            are ready. No spam — only what matters.
          </Text>
        </View>

        <View style={styles.actions}>
          <PrimaryButton label="Turn On Notifications" variant="purple" onPress={() => navigation.navigate('AddPhotos')} />
          <TouchableOpacity onPress={() => navigation.navigate('AddPhotos')}>
            <Text style={styles.skip}>Maybe later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.xl, paddingBottom: spacing.xl, justifyContent: 'space-between' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: 32,
    backgroundColor: colors.purpleSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: { fontSize: 30, fontWeight: '800', color: colors.textPrimary, textAlign: 'center', letterSpacing: -0.5 },
  subtitle: { fontSize: 17, lineHeight: 25, color: colors.textSecondary, textAlign: 'center' },
  actions: { gap: spacing.md },
  skip: { textAlign: 'center', fontSize: 17, fontWeight: '600', color: colors.textSecondary, paddingVertical: spacing.sm },
});

export default NotificationPermissionScreen;
