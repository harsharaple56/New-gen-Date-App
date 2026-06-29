import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import Screen from '../components/Screen';
import ScreenHeader from '../components/ScreenHeader';
import SectionCard from '../components/SectionCard';
import Tag from '../components/Tag';
import { curatedMatches, galleryPhotos } from '../data/mock';
import { colors, radius, spacing } from '../theme/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'ProfilePreview'>;

const ProfilePreviewScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();

  return (
    <Screen>
      <ScreenHeader title="Preview" onBack={() => navigation.goBack()} />
      <View style={styles.banner}>
        <Ionicons name="eye-outline" size={18} color={colors.purple} />
        <Text style={styles.bannerText}>This is how others see your profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Image source={curatedMatches[2].photo} style={styles.hero} />

        <View style={styles.nameRow}>
          <Text style={styles.name}>Alex, 29</Text>
          <Ionicons name="checkmark-circle" size={22} color={colors.purple} />
        </View>
        <Text style={styles.location}>San Francisco, CA</Text>

        <View style={styles.chips}>
          {['Designer', 'Aquarius'].map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </View>

        <SectionCard label="MY SUNDAY" value="Vinyl crates & long walks" style={styles.section} />
        <SectionCard label="QUICKEST HEART PATH" value="Good coffee & honest talks" style={styles.section} />

        <View style={styles.gallery}>
          {galleryPhotos.map((photo, i) => (
            <Image key={i} source={photo} style={styles.galleryPhoto} />
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.purpleSoft,
    marginHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },
  bannerText: { fontSize: 14, fontWeight: '600', color: colors.purple },
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.xl },
  hero: { width: '100%', height: 380, borderRadius: radius.xl, backgroundColor: colors.surfaceAlt },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.lg },
  name: { fontSize: 28, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5 },
  location: { fontSize: 17, color: colors.textSecondary, marginTop: 4 },
  chips: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  section: { marginTop: spacing.lg },
  gallery: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  galleryPhoto: { flex: 1, height: 160, borderRadius: radius.lg, backgroundColor: colors.surfaceAlt },
});

export default ProfilePreviewScreen;
