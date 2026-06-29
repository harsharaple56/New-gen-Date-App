import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import Screen from '../components/Screen';
import ScreenHeader from '../components/ScreenHeader';
import PrimaryButton from '../components/PrimaryButton';
import { curatedMatches, heroPhoto } from '../data/mock';
import { colors, radius, spacing } from '../theme/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'AddPhotos'>;

const SLOTS = 6;
const initial = [curatedMatches[0].photo, heroPhoto, null, null, null, null];

const AddPhotosScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [photos, setPhotos] = useState<(typeof initial)[number][]>(initial);

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.map((p, i) => (i === index ? null : p)));
  };

  const count = photos.filter(Boolean).length;

  return (
    <Screen>
      <ScreenHeader onBack={() => navigation.goBack()} />
      <View style={styles.container}>
        <Text style={styles.title}>Add your photos</Text>
        <Text style={styles.subtitle}>Add at least 2. Your first photo is your main one.</Text>

        <View style={styles.grid}>
          {Array.from({ length: SLOTS }).map((_, index) => {
            const photo = photos[index];
            return (
              <View key={index} style={styles.cell}>
                {photo ? (
                  <>
                    <Image source={photo} style={styles.photo} />
                    <TouchableOpacity style={styles.remove} onPress={() => removePhoto(index)}>
                      <Ionicons name="close" size={16} color={colors.textOnDark} />
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity style={styles.empty} activeOpacity={0.7}>
                    <Ionicons name="add" size={28} color={colors.purple} />
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>

        <View style={styles.spacer} />

        <PrimaryButton
          label="Continue"
          variant="purple"
          disabled={count < 2}
          onPress={() => navigation.navigate('Bio')}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: spacing.xl },
  title: { fontSize: 30, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: 17, color: colors.textSecondary, marginTop: spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.xl },
  cell: { width: '31%', aspectRatio: 0.8 },
  photo: { width: '100%', height: '100%', borderRadius: radius.lg, backgroundColor: colors.surfaceAlt },
  empty: {
    width: '100%',
    height: '100%',
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.inputBorder,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  remove: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacer: { flex: 1 },
});

export default AddPhotosScreen;
