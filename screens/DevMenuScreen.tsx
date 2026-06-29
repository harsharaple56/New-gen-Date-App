import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { navigate } from '../navigation/navigationRef';
import { useAppStore } from '../store/useAppStore';
import { mockCurrentUser } from '../data/mockUsers';
import { colors, radius, spacing } from '../theme/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'DevMenu'>;
type Flow = 'auth' | 'onboarding' | 'main';

type Item = {
  label: string;
  route: keyof RootStackParamList;
  flow: Flow;
  params?: object;
};

/** Every screen in the app, grouped by the flow it belongs to. */
const ITEMS: Item[] = [
  // Auth
  { label: 'Splash', route: 'Splash', flow: 'auth' },
  { label: 'Welcome', route: 'Welcome', flow: 'auth' },
  { label: 'Login', route: 'Login', flow: 'auth' },
  { label: 'OTP', route: 'Otp', flow: 'auth', params: { phone: '+1 (555) 012-0199' } },
  // Onboarding
  { label: 'Location Permission', route: 'LocationPermission', flow: 'onboarding' },
  { label: 'Notification Permission', route: 'NotificationPermission', flow: 'onboarding' },
  { label: 'Add Photos', route: 'AddPhotos', flow: 'onboarding' },
  { label: 'Bio', route: 'Bio', flow: 'onboarding' },
  { label: 'Interest Selection', route: 'InterestSelection', flow: 'onboarding' },
  { label: 'Dating Intent', route: 'DatingIntent', flow: 'onboarding' },
  { label: 'Prompt Answers', route: 'PromptAnswers', flow: 'onboarding' },
  { label: 'Voice Intro', route: 'VoiceIntro', flow: 'onboarding' },
  { label: 'Verification', route: 'Verification', flow: 'onboarding' },
  // Main – tabs
  { label: 'Home (deck)', route: 'Home', flow: 'main' },
  { label: 'Explore', route: 'Explore', flow: 'main' },
  { label: 'Matches', route: 'Matches', flow: 'main' },
  { label: 'Chat List', route: 'ChatList', flow: 'main' },
  { label: 'My Profile', route: 'MyProfile', flow: 'main' },
  // Main – details & flows
  { label: 'Chat', route: 'Chat', flow: 'main', params: { chatId: '1', name: 'Priya' } },
  { label: 'Profile Detail', route: 'ProfileDetail', flow: 'main', params: { id: 'profile_1' } },
  { label: 'Profile Preview', route: 'ProfilePreview', flow: 'main' },
  { label: 'Send Intro', route: 'SendIntro', flow: 'main', params: { name: 'Priya' } },
  { label: 'Intro Sent', route: 'IntroSent', flow: 'main' },
  { label: 'Match Success', route: 'MatchSuccess', flow: 'main' },
  { label: 'Edit Profile', route: 'EditProfile', flow: 'main' },
  { label: 'Preferences', route: 'Preferences', flow: 'main' },
  { label: 'Filters Sheet', route: 'FiltersSheet', flow: 'main' },
  { label: 'Settings', route: 'Settings', flow: 'main' },
  { label: 'Privacy', route: 'Privacy', flow: 'main' },
  { label: 'Block / Report', route: 'BlockReport', flow: 'main' },
  { label: 'Premium Subscription', route: 'PremiumSubscription', flow: 'main' },
  { label: 'Payment Confirmation', route: 'PaymentConfirmation', flow: 'main' },
  { label: 'Premium Success', route: 'PremiumSuccess', flow: 'main' },
  { label: 'No Matches', route: 'NoMatches', flow: 'main' },
  { label: 'No Profiles', route: 'NoProfiles', flow: 'main' },
];

const FLOW_STATE: Record<Flow, { isLoggedIn: boolean; onboardingComplete: boolean }> = {
  auth: { isLoggedIn: false, onboardingComplete: false },
  onboarding: { isLoggedIn: true, onboardingComplete: false },
  main: { isLoggedIn: true, onboardingComplete: true },
};

/** Switch the app to the flow a screen belongs to, then navigate to it. */
function jumpTo(item: Item) {
  const cur = useAppStore.getState();
  const target = FLOW_STATE[item.flow];
  const needsSwitch =
    cur.isLoggedIn !== target.isLoggedIn || cur.onboardingComplete !== target.onboardingComplete;

  if (needsSwitch) {
    useAppStore.setState({ ...target, user: cur.user ?? mockCurrentUser });
    // Let the root navigator swap flow groups before navigating.
    setTimeout(() => navigate(item.route as never, item.params as never), 60);
  } else {
    navigate(item.route as never, item.params as never);
  }
}

const FLOW_LABEL: Record<Flow, string> = {
  auth: '1 · Auth flow',
  onboarding: '2 · Onboarding flow',
  main: '3 · Main app',
};

const DevMenuScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);
  const onboardingComplete = useAppStore((s) => s.onboardingComplete);
  const setProfiles = useAppStore((s) => s.setProfiles);
  const setMatches = useAppStore((s) => s.setMatches);
  const setChats = useAppStore((s) => s.setChats);
  const logout = useAppStore((s) => s.logout);

  const flows: Flow[] = ['auth', 'onboarding', 'main'];

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Dev Menu</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
          <Ionicons name="close" size={26} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.state}>
          session: {isLoggedIn ? 'logged in' : 'logged out'} ·{' '}
          {onboardingComplete ? 'onboarded' : 'not onboarded'}
        </Text>

        {/* Session shortcuts */}
        <Text style={styles.section}>Session</Text>
        <View style={styles.grid}>
          <DevButton label="Reset to Auth" tone="danger" onPress={() => logout()} />
          <DevButton
            label="Skip to Onboarding"
            onPress={() => jumpTo(ITEMS.find((i) => i.route === 'LocationPermission')!)}
          />
          <DevButton
            label="Skip to Main"
            onPress={() => jumpTo(ITEMS.find((i) => i.route === 'Home')!)}
          />
          <DevButton label="Empty: profiles" onPress={() => setProfiles([])} />
          <DevButton label="Empty: matches" onPress={() => setMatches([])} />
          <DevButton label="Empty: chats" onPress={() => setChats([])} />
        </View>

        {/* All screens, grouped by flow */}
        {flows.map((flow) => (
          <View key={flow}>
            <Text style={styles.section}>{FLOW_LABEL[flow]}</Text>
            <View style={styles.grid}>
              {ITEMS.filter((i) => i.flow === flow).map((item) => (
                <DevButton key={item.route} label={item.label} onPress={() => jumpTo(item)} />
              ))}
            </View>
          </View>
        ))}

        <Text style={styles.note}>
          Tapping a screen switches to its flow automatically. This menu is a temporary testing
          helper.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const DevButton: React.FC<{ label: string; onPress: () => void; tone?: 'default' | 'danger' }> = ({
  label,
  onPress,
  tone = 'default',
}) => (
  <TouchableOpacity
    style={[styles.btn, tone === 'danger' && styles.btnDanger]}
    activeOpacity={0.8}
    onPress={onPress}
  >
    <Text style={[styles.btnText, tone === 'danger' && styles.btnTextDanger]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
  },
  title: { fontSize: 24, fontWeight: '800', color: colors.textPrimary },
  body: { padding: spacing.xl, paddingTop: 0, gap: spacing.sm },
  state: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    fontWeight: '600',
  },
  section: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  btn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  btnDanger: { backgroundColor: colors.danger, borderColor: colors.danger },
  btnText: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  btnTextDanger: { color: colors.textOnDark },
  note: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.xl,
    lineHeight: 18,
  },
});

export default DevMenuScreen;
