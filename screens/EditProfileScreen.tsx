import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import Screen from '../components/Screen';
import ScreenHeader from '../components/ScreenHeader';
import InputField from '../components/InputField';
import Tag from '../components/Tag';
import { curatedMatches, heroPhoto } from '../data/mock';
import { colors, radius, spacing } from '../theme/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'EditProfile'>;

const photos = [curatedMatches[2].photo, heroPhoto, null, null];
const myInterests = ['Travel', 'Art', 'Coffee', 'Hiking', 'Films'];

const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [name, setName] = useState('Alex');
  const [bio, setBio] = useState('Designer who collects vinyl and chases good light.');

  return (
    <Screen>
      <ScreenHeader title="Edit Profile" onBack={() => navigation.goBack()} rightLabel="Save" onRightPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.section}>PHOTOS</Text>
        <View style={styles.photoRow}>
          {photos.map((photo, index) => (
            <View key={index} style={styles.photoCell}>
              {photo ? (
                <Image source={photo} style={styles.photo} />
              ) : (
                <TouchableOpacity style={styles.photoEmpty} activeOpacity={0.7}>
                  <Ionicons name="add" size={24} color={colors.purple} />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        <Text style={styles.section}>ABOUT</Text>
        <InputField label="Name" value={name} onChangeText={setName} containerStyle={styles.field} />
        <InputField label="Bio" value={bio} onChangeText={setBio} multiline containerStyle={styles.field} />

        <Text style={styles.section}>INTERESTS</Text>
        <View style={styles.chips}>
          {myInterests.map((interest) => (
            <Tag key={interest} label={interest} selected />
          ))}
          <Tag label="+ Add" variant="outline" onPress={() => navigation.navigate('Preferences')} />
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
  section: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
    color: colors.textSecondary,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  photoRow: { flexDirection: 'row', gap: spacing.md },
  photoCell: { flex: 1, aspectRatio: 0.78 },
  photo: { width: '100%', height: '100%', borderRadius: radius.md, backgroundColor: colors.surfaceAlt },
  photoEmpty: {
    width: '100%',
    height: '100%',
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.inputBorder,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  field: { marginBottom: spacing.lg },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
});

export default EditProfileScreen;
