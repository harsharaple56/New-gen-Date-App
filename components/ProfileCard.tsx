import React from 'react';
import { View, Text, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, shadows } from '../theme/theme';
import Tag from './Tag';

export type ProfileCardData = {
  name: string;
  age: number;
  location: string;
  photo: ImageSourcePropType;
  tags: string[];
  aligned?: number;
};

type ProfileCardProps = {
  profile: ProfileCardData;
};

/**
 * The hero match card on the Home screen: large photo with an info footer
 * containing name/age, location, attribute chips and an "aligned" score.
 */
const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => (
  <View style={styles.card}>
    <Image source={profile.photo} style={styles.photo} />
    <View style={styles.info}>
      <View style={styles.nameRow}>
        <Text style={styles.name}>
          {profile.name}, {profile.age}
        </Text>
        <Text style={styles.location}>{profile.location}</Text>
      </View>

      <View style={styles.tags}>
        {profile.tags.map((tag) => (
          <Tag key={tag} label={tag} />
        ))}
      </View>

      {profile.aligned != null ? (
        <View style={styles.alignedRow}>
          <Text style={styles.aligned}>{profile.aligned}% aligned</Text>
          <Ionicons name="sparkles" size={15} color={colors.gold} />
        </View>
      ) : null}
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    ...shadows.card,
  },
  photo: {
    width: '100%',
    aspectRatio: 0.92,
    backgroundColor: colors.surfaceAlt,
  },
  info: {
    padding: spacing.xl,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  name: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  location: {
    fontSize: 17,
    color: colors.textSecondary,
    marginBottom: 3,
  },
  tags: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  alignedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.lg,
  },
  aligned: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.gold,
  },
});

export default ProfileCard;
