import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import SectionCard from '../components/SectionCard';
import PrimaryButton from '../components/PrimaryButton';
import { heroPhoto, galleryPhotos } from '../data/mock';
import { colors, radius, spacing } from '../theme/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'ProfileDetail'>;

const VoiceIntro: React.FC = () => (
  <View style={styles.voice}>
    <View style={styles.playBtn}>
      <Ionicons name="play" size={22} color={colors.textOnDark} />
    </View>
    <View style={styles.waveform}>
      {[10, 18, 26, 14, 22, 12, 20, 16, 24, 12].map((h, i) => (
        <View key={i} style={[styles.bar, { height: h }]} />
      ))}
    </View>
    <Text style={styles.voiceTime}>10s</Text>
  </View>
);

const ProfileDetailScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.heroWrap}>
          <Image source={heroPhoto} style={styles.hero} />
          <SafeAreaView style={styles.heroBar} edges={['top']}>
            <TouchableOpacity style={styles.circleBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={22} color={colors.textOnDark} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.circleBtn}>
              <Ionicons name="share-outline" size={22} color={colors.textOnDark} />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        <View style={styles.content}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>Priya, 26</Text>
            <Ionicons name="checkmark-circle" size={24} color={colors.purple} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Dating</Text>
            </View>
          </View>
          <Text style={styles.location}>Brooklyn, NY</Text>

          <VoiceIntro />

          <SectionCard label="MY SUNDAY" value="Flea markets & old books" style={styles.section} />
          <SectionCard
            label="QUICKEST HEART PATH"
            value="Street tacos & good playlists"
            style={styles.section}
          />

          <View style={styles.gallery}>
            {galleryPhotos.map((photo, i) => (
              <Image key={i} source={photo} style={styles.galleryPhoto} />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label="Send Intro"
          variant="purple"
          onPress={() => navigation.navigate('SendIntro', { name: 'Priya' })}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: spacing.xl },
  heroWrap: { width: '100%' },
  hero: { width: '100%', height: 420, backgroundColor: colors.surfaceAlt },
  heroBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  name: { fontSize: 30, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5 },
  badge: {
    backgroundColor: colors.purpleSoft,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  badgeText: { color: colors.purple, fontWeight: '700', fontSize: 14 },
  location: { fontSize: 18, color: colors.textSecondary, marginTop: 6 },
  voice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.xl,
    gap: spacing.lg,
  },
  playBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveform: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5 },
  bar: { width: 3, borderRadius: 2, backgroundColor: colors.textMuted },
  voiceTime: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  section: { marginTop: spacing.lg },
  gallery: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  galleryPhoto: { flex: 1, height: 160, borderRadius: radius.lg, backgroundColor: colors.surfaceAlt },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    backgroundColor: colors.background,
  },
});

export default ProfileDetailScreen;
