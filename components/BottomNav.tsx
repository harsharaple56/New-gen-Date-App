import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadows } from '../theme/theme';

export type TabKey = 'home' | 'explore' | 'matches' | 'chat' | 'profile';

type TabConfig = { key: TabKey; icon: keyof typeof Ionicons.glyphMap };

const TABS: TabConfig[] = [
  { key: 'home', icon: 'home' },
  { key: 'explore', icon: 'compass-outline' },
  { key: 'matches', icon: 'heart-outline' },
  { key: 'chat', icon: 'chatbubble-outline' },
  { key: 'profile', icon: 'person-outline' },
];

type BottomNavProps = {
  active?: TabKey;
  onChange?: (key: TabKey) => void;
};

/**
 * Floating pill-style bottom navigation. The active tab gets a soft purple chip.
 */
const BottomNav: React.FC<BottomNavProps> = ({ active = 'home', onChange }) => (
  <View style={styles.container}>
    {TABS.map((tab) => {
      const isActive = tab.key === active;
      return (
        <TouchableOpacity
          key={tab.key}
          activeOpacity={0.7}
          onPress={() => onChange?.(tab.key)}
          style={[styles.tab, isActive && styles.tabActive]}
        >
          <Ionicons
            name={isActive && tab.icon.endsWith('-outline')
              ? (tab.icon.replace('-outline', '') as keyof typeof Ionicons.glyphMap)
              : tab.icon}
            size={24}
            color={isActive ? colors.purple : colors.textSecondary}
          />
        </TouchableOpacity>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: 18,
    paddingVertical: 12,
    ...shadows.soft,
  },
  tab: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: colors.purpleSoft,
  },
});

export default BottomNav;
