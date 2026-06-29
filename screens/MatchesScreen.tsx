import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import Screen from '../components/Screen';
import GridProfileCard from '../components/GridProfileCard';
import BottomNav, { TabKey } from '../components/BottomNav';
import { LoadingState, ErrorState, EmptyState } from '../components/StateViews';
import { useAppStore } from '../store/useAppStore';
import { useMatches } from '../services/queries';
import { Match } from '../types/models';
import { colors, spacing } from '../theme/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Matches'>;

const TAB_ROUTES: Record<TabKey, keyof RootStackParamList> = {
  home: 'Home',
  explore: 'Explore',
  matches: 'Matches',
  chat: 'ChatList',
  profile: 'MyProfile',
};

const toRows = (items: Match[]) => {
  const out: Match[][] = [];
  for (let i = 0; i < items.length; i += 2) out.push(items.slice(i, i + 2));
  return out;
};

const MatchesScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { isLoading, isError, refetch } = useMatches();
  const matches = useAppStore((s) => s.matches);

  const renderBody = () => {
    if (isLoading && matches.length === 0) return <LoadingState label="Loading matches…" />;
    if (isError && matches.length === 0) {
      return <ErrorState message="We couldn't load your matches." onRetry={() => refetch()} />;
    }
    if (matches.length === 0) {
      return (
        <EmptyState
          icon="people-outline"
          title="No matches yet"
          subtitle="Keep sending intros — your matches will appear here."
        />
      );
    }

    return (
      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {toRows(matches).map((pair, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {pair.map((match) => (
              <GridProfileCard
                key={match.id}
                profile={match.profile}
                onPress={() => navigation.navigate('ProfileDetail', { id: match.profile.id })}
              />
            ))}
            {pair.length === 1 ? <View style={styles.spacer} /> : null}
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <Screen>
      <Text style={styles.title}>Matches</Text>
      <Text style={styles.subtitle}>People excited to connect with you</Text>

      <View style={styles.flex}>{renderBody()}</View>

      <View style={styles.nav}>
        <BottomNav active="matches" onChange={(key) => key !== 'matches' && navigation.navigate(TAB_ROUTES[key] as never)} />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.textPrimary,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    letterSpacing: -0.5,
  },
  subtitle: { fontSize: 16, color: colors.textSecondary, paddingHorizontal: spacing.xl, marginTop: 4 },
  grid: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg, gap: spacing.lg },
  row: { flexDirection: 'row', gap: spacing.lg },
  spacer: { flex: 1 },
  nav: { paddingHorizontal: spacing.xl, paddingBottom: spacing.sm },
});

export default MatchesScreen;
