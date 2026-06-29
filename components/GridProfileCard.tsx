import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, shadows } from '../theme/theme';
import { ProfileCardData } from './ProfileCard';

type GridProfileCardProps = {
  profile: ProfileCardData;
  onPress?: () => void;
};

/**
 * Compact two-up tile used in the Explore and Matches grids.
 */
const GridProfileCard: React.FC<GridProfileCardProps> = ({ profile, onPress }) => (
  <TouchableOpacity activeOpacity={0.85} style={styles.card} onPress={onPress}>
    <Image source={profile.photo} style={styles.photo} />
    <View style={styles.info}>
      <Text style={styles.name} numberOfLines={1}>
        {profile.name}, {profile.age}
      </Text>
      {profile.aligned != null ? (
        <View style={styles.alignedRow}>
          <Ionicons name="sparkles" size={12} color={colors.gold} />
          <Text style={styles.aligned}>{profile.aligned}% aligned</Text>
        </View>
      ) : (
        <Text style={styles.location} numberOfLines={1}>
          {profile.location}
        </Text>
      )}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadows.soft,
  },
  photo: { width: '100%', aspectRatio: 0.82, backgroundColor: colors.surfaceAlt },
  info: { padding: spacing.md },
  name: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  alignedRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  aligned: { fontSize: 13, fontWeight: '600', color: colors.gold },
  location: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
});

export default GridProfileCard;
