import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { navigate } from '../navigation/navigationRef';
import { colors, radius, shadows } from '../theme/theme';

declare const __DEV__: boolean;

/**
 * Floating "DEV" button rendered above the whole app (development only).
 * Tapping it opens the Dev Menu, from which any screen can be reached.
 * Remove by deleting this component + its usage in `App.tsx`.
 */
const DevFab: React.FC = () => {
  if (!__DEV__) return null;

  return (
    <TouchableOpacity
      style={styles.fab}
      activeOpacity={0.85}
      onPress={() => navigate('DevMenu')}
      accessibilityLabel="Open developer menu"
    >
      <Text style={styles.label}>DEV</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    left: 16,
    bottom: 110,
    width: 52,
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    ...shadows.card,
  },
  label: { color: colors.textOnDark, fontSize: 12, fontWeight: '800', letterSpacing: 1 },
});

export default DevFab;
