import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import Screen from '../components/Screen';
import Avatar from '../components/Avatar';
import ListRow from '../components/ListRow';
import BottomNav, { TabKey } from '../components/BottomNav';
import { useAppStore } from '../store/useAppStore';
import { useMe } from '../services/queries';
import { curatedMatches } from '../data/mock';
import { colors, radius, spacing, shadows } from '../theme/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'MyProfile'>;

const TAB_ROUTES: Record<TabKey, keyof RootStackParamList> = {
  home: 'Home',
  explore: 'Explore',
  matches: 'Matches',
  chat: 'ChatList',
  profile: 'MyProfile',
};

const MyProfileScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  useMe();
  const user = useAppStore((s) => s.user);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.head}>
          <Avatar source={user?.photo ?? curatedMatches[2].photo} size={96} ring />
          <Text style={styles.name}>{user ? `${user.name}, ${user.age}` : 'Alex, 29'}</Text>
          <Text style={styles.location}>{user?.location ?? 'San Francisco, CA'}</Text>
          <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('EditProfile')}>
            <Text style={styles.editText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.premium}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('PremiumSubscription')}
        >
          <View style={styles.premiumIcon}>
            <Ionicons name="sparkles" size={22} color={colors.gold} />
          </View>
          <View style={styles.premiumBody}>
            <Text style={styles.premiumTitle}>Go Premium</Text>
            <Text style={styles.premiumSub}>5 curated profiles a day & priority intros</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={colors.textOnDark} />
        </TouchableOpacity>

        <View style={styles.section}>
          <ListRow icon="person-outline" label="Profile Preview" onPress={() => navigation.navigate('ProfilePreview')} />
          <ListRow icon="options-outline" label="Preferences" onPress={() => navigation.navigate('Preferences')} />
          <ListRow icon="settings-outline" label="Settings" onPress={() => navigation.navigate('Settings')} />
          <ListRow icon="lock-closed-outline" label="Privacy" onPress={() => navigation.navigate('Privacy')} />
        </View>
      </ScrollView>

      <View style={styles.nav}>
        <BottomNav active="profile" onChange={(key) => key !== 'profile' && navigation.navigate(TAB_ROUTES[key] as never)} />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.lg },
  head: { alignItems: 'center', gap: 6 },
  name: { fontSize: 26, fontWeight: '800', color: colors.textPrimary, marginTop: spacing.md, letterSpacing: -0.4 },
  location: { fontSize: 16, color: colors.textSecondary },
  editBtn: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  editText: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  premium: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: colors.black,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginTop: spacing.xl,
    ...shadows.soft,
  },
  premiumIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumBody: { flex: 1 },
  premiumTitle: { fontSize: 18, fontWeight: '700', color: colors.textOnDark },
  premiumSub: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  section: { marginTop: spacing.xl },
  nav: { paddingHorizontal: spacing.xl, paddingBottom: spacing.sm },
});

export default MyProfileScreen;
