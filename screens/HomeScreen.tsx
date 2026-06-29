import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import Screen from '../components/Screen';
import ProfileCard from '../components/ProfileCard';
import PrimaryButton from '../components/PrimaryButton';
import BottomNav, { TabKey } from '../components/BottomNav';
import { LoadingState, ErrorState, EmptyState } from '../components/StateViews';
import { useAppStore } from '../store/useAppStore';
import { useProfiles, useSwipe } from '../services/queries';
import { colors, spacing } from '../theme/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const TAB_ROUTES: Record<TabKey, keyof RootStackParamList> = {
  home: 'Home',
  explore: 'Explore',
  matches: 'Matches',
  chat: 'ChatList',
  profile: 'MyProfile',
};

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { isLoading, isError, refetch } = useProfiles();
  const profiles = useAppStore((s) => s.profiles);
  const swipe = useSwipe();

  // Remember the original deck size so the "x of y" counter stays stable as
  // swiped profiles are removed from the store.
  const [total, setTotal] = useState(0);
  useEffect(() => {
    if (profiles.length > 0 && total === 0) setTotal(profiles.length);
  }, [profiles.length, total]);

  const profile = profiles[0];
  const position = Math.min(total - profiles.length + 1, total);

  const handlePass = () => {
    if (!profile) return;
    swipe.mutate({ profileId: profile.id, direction: 'pass' });
  };

  const handleSendIntro = () => {
    if (!profile) return;
    const name = profile.name;
    swipe.mutate(
      { profileId: profile.id, direction: 'like' },
      {
        onSuccess: (result) =>
          navigation.navigate(result.matched ? 'MatchSuccess' : 'SendIntro', { name }),
      },
    );
  };

  const renderBody = () => {
    if (isLoading && profiles.length === 0) return <LoadingState label="Finding your match…" />;
    if (isError && profiles.length === 0) {
      return <ErrorState message="We couldn't load your matches." onRetry={() => refetch()} />;
    }
    if (!profile) {
      return (
        <EmptyState
          icon="heart-outline"
          title="You're all caught up"
          subtitle="No more profiles right now. Check back soon for new matches."
        />
      );
    }

    return (
      <>
        <ProfileCard profile={profile} />

        <View style={styles.actions}>
          <PrimaryButton label="Pass" variant="white" style={styles.action} onPress={handlePass} />
          <PrimaryButton
            label="Send Intro"
            variant="purple"
            style={styles.action}
            onPress={handleSendIntro}
          />
        </View>
      </>
    );
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Today's Curated Match</Text>
        {profile ? (
          <Text style={styles.counter}>
            {position} of {total}
          </Text>
        ) : null}
      </View>

      <View style={styles.body}>{renderBody()}</View>

      <View style={styles.nav}>
        <BottomNav
          active="home"
          onChange={(key) => key !== 'home' && navigation.navigate(TAB_ROUTES[key] as never)}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  counter: {
    position: 'absolute',
    right: spacing.xl,
    fontSize: 16,
    color: colors.textMuted,
  },
  body: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  action: {
    flex: 1,
  },
  nav: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.sm,
  },
});

export default HomeScreen;
