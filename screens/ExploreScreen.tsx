import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import Screen from '../components/Screen';
import GridProfileCard from '../components/GridProfileCard';
import Tag from '../components/Tag';
import BottomNav, { TabKey } from '../components/BottomNav';
import { curatedMatches } from '../data/mock';
import { colors, radius, spacing } from '../theme/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Explore'>;

const TAB_ROUTES: Record<TabKey, keyof RootStackParamList> = {
  home: 'Home',
  explore: 'Explore',
  matches: 'Matches',
  chat: 'ChatList',
  profile: 'MyProfile',
};

const FILTERS = ['All', 'Nearby', 'New', 'Verified', 'Most aligned'];

const ExploreScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [active, setActive] = useState('All');
  const data = [...curatedMatches, ...curatedMatches];
  const rows: (typeof curatedMatches)[] = [];
  for (let i = 0; i < data.length; i += 2) rows.push(data.slice(i, i + 2));

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
        <TouchableOpacity style={styles.filterBtn} onPress={() => navigation.navigate('FiltersSheet')}>
          <Ionicons name="options-outline" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={colors.textMuted} />
        <TextInput placeholder="Search interests, names..." placeholderTextColor={colors.textMuted} style={styles.searchInput} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
        style={styles.filtersWrap}
      >
        {FILTERS.map((f) => (
          <Tag key={f} label={f} selected={active === f} onPress={() => setActive(f)} variant="outline" />
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {rows.map((pair, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {pair.map((profile, i) => (
              <GridProfileCard
                key={`${rowIndex}-${i}`}
                profile={profile}
                onPress={() => navigation.navigate('ProfileDetail', { id: profile.name })}
              />
            ))}
          </View>
        ))}
      </ScrollView>

      <View style={styles.nav}>
        <BottomNav active="explore" onChange={(key) => key !== 'explore' && navigation.navigate(TAB_ROUTES[key] as never)} />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  title: { fontSize: 30, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5 },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginHorizontal: spacing.xl,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  searchInput: { flex: 1, fontSize: 16, color: colors.textPrimary },
  filtersWrap: { maxHeight: 56, marginTop: spacing.lg },
  filters: { paddingHorizontal: spacing.xl, gap: spacing.sm, alignItems: 'center' },
  grid: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm, gap: spacing.lg },
  row: { flexDirection: 'row', gap: spacing.lg },
  nav: { paddingHorizontal: spacing.xl, paddingBottom: spacing.sm },
});

export default ExploreScreen;
