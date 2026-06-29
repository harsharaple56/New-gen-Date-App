import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import Screen from '../components/Screen';
import ScreenHeader from '../components/ScreenHeader';
import PrimaryButton from '../components/PrimaryButton';
import { colors, radius, spacing } from '../theme/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'VoiceIntro'>;

const VoiceIntroScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [recording, setRecording] = useState(false);
  const [recorded, setRecorded] = useState(false);

  const handlePress = () => {
    if (recording) {
      setRecording(false);
      setRecorded(true);
    } else {
      setRecording(true);
    }
  };

  return (
    <Screen>
      <ScreenHeader onBack={() => navigation.goBack()} />
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Add a voice intro</Text>
          <Text style={styles.subtitle}>
            Record up to 10 seconds. A real voice builds real connection.
          </Text>

          <View style={styles.waveform}>
            {[14, 28, 40, 22, 34, 18, 44, 26, 36, 20, 30, 16].map((h, i) => (
              <View
                key={i}
                style={[styles.bar, { height: recording || recorded ? h : 8 }]}
              />
            ))}
          </View>

          <Text style={styles.timer}>{recorded ? '0:10' : recording ? 'Recording…' : '0:00'}</Text>
        </View>

        <View style={styles.controls}>
          <View style={styles.recordWrap}>
            <View style={styles.recordOuter}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handlePress}
                style={[styles.recordBtn, recording && styles.recordBtnActive]}
              >
                <Ionicons
                  name={recording ? 'stop' : recorded ? 'play' : 'mic'}
                  size={32}
                  color={colors.textOnDark}
                />
              </TouchableOpacity>
            </View>
          </View>

          <PrimaryButton
            label={recorded ? 'Use this intro' : 'Skip for now'}
            variant={recorded ? 'purple' : 'white'}
            onPress={() => navigation.navigate('Verification')}
          />
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
  title: { fontSize: 30, fontWeight: '800', color: colors.textPrimary, textAlign: 'center', letterSpacing: -0.5 },
  subtitle: { fontSize: 17, lineHeight: 24, color: colors.textSecondary, textAlign: 'center' },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 60,
    marginTop: spacing.xl,
  },
  bar: { width: 5, borderRadius: 3, backgroundColor: colors.purple },
  timer: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  controls: { alignItems: 'center', gap: spacing.xl },
  recordWrap: { alignItems: 'center' },
  recordOuter: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.purpleSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordBtnActive: { backgroundColor: colors.danger },
});

export default VoiceIntroScreen;
