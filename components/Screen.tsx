import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StatusBarMock from './StatusBarMock';
import { colors } from '../theme/theme';

type ScreenProps = {
  children: React.ReactNode;
  showStatusBar?: boolean;
  background?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Base screen wrapper: safe-area aware, applies the app background and a mock
 * status bar so previews match the Figma frames.
 */
const Screen: React.FC<ScreenProps> = ({
  children,
  showStatusBar = true,
  background = colors.background,
  style,
}) => (
  <SafeAreaView style={[styles.safe, { backgroundColor: background }]} edges={['top', 'bottom']}>
    {showStatusBar ? <StatusBarMock /> : null}
    <View style={[styles.body, style]}>{children}</View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
});

export default Screen;
