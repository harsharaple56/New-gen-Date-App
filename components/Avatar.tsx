import React from 'react';
import { Image, View, StyleSheet, StyleProp, ViewStyle, ImageSourcePropType } from 'react-native';
import { colors } from '../theme/theme';

type AvatarProps = {
  source: ImageSourcePropType;
  size?: number;
  ring?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * Circular avatar with an optional purple selection ring.
 */
const Avatar: React.FC<AvatarProps> = ({ source, size = 56, ring = false, style }) => (
  <View
    style={[
      {
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: ring ? 3 : 0,
        borderColor: colors.purple,
      },
      styles.wrapper,
      style,
    ]}
  >
    <Image source={source} style={[styles.image, { borderRadius: size / 2 }]} />
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.surfaceAlt,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default Avatar;
