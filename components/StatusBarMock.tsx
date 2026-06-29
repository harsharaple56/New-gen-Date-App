import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/theme';

/**
 * Mock iOS status bar (9:41 + signal / wifi / battery) to match the Figma frames.
 */
type StatusBarMockProps = {
  time?: string;
  tint?: string;
};

const StatusBarMock: React.FC<StatusBarMockProps> = ({ time = '9:41', tint = colors.textPrimary }) => (
  <View style={styles.container}>
    <Text style={[styles.time, { color: tint }]}>{time}</Text>
    <View style={styles.icons}>
      <Ionicons name="cellular" size={17} color={tint} />
      <Ionicons name="wifi" size={17} color={tint} />
      <Ionicons name="battery-full" size={22} color={tint} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    height: 44,
    paddingHorizontal: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  time: {
    fontSize: 17,
    fontWeight: '600',
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});

export default StatusBarMock;
