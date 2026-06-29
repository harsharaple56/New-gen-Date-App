import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import Screen from '../components/Screen';
import ScreenHeader from '../components/ScreenHeader';
import ListRow from '../components/ListRow';
import { useAppStore } from '../store/useAppStore';
import { colors, spacing } from '../theme/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const logout = useAppStore((s) => s.logout);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [pauseAccount, setPauseAccount] = useState(false);

  return (
    <Screen>
      <ScreenHeader title="Settings" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.section}>ACCOUNT</Text>
        <ListRow icon="call-outline" label="Phone Number" value="+1 (555) 012" onPress={() => {}} />
        <ListRow icon="mail-outline" label="Email" value="alex@align.app" onPress={() => {}} />
        <ListRow icon="options-outline" label="Preferences" onPress={() => navigation.navigate('Preferences')} />

        <Text style={styles.section}>NOTIFICATIONS</Text>
        <ListRow icon="notifications-outline" label="Push Notifications" toggle toggleValue={pushEnabled} onToggle={setPushEnabled} />
        <ListRow icon="pause-circle-outline" label="Pause My Account" toggle toggleValue={pauseAccount} onToggle={setPauseAccount} />

        <Text style={styles.section}>SUPPORT & PRIVACY</Text>
        <ListRow icon="lock-closed-outline" label="Privacy" onPress={() => navigation.navigate('Privacy')} />
        <ListRow icon="shield-outline" label="Block & Report" onPress={() => navigation.navigate('BlockReport')} />
        <ListRow icon="help-circle-outline" label="Help Center" onPress={() => {}} />

        <View style={styles.spacer} />
        <ListRow icon="log-out-outline" label="Log Out" danger onPress={() => logout()} />
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
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  spacer: { height: spacing.lg },
});

export default SettingsScreen;
