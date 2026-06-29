import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import Screen from '../components/Screen';
import CenteredCard from '../components/CenteredCard';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'IntroSent'>;

const IntroSentScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();

  return (
    <Screen showStatusBar={false}>
      <CenteredCard
        media={
          <View style={styles.circle}>
            <Ionicons name="paper-plane" size={30} color={colors.purple} />
          </View>
        }
        title="Intro sent!"
        subtitle="We'll let you know the moment Priya responds. Good things take a little patience."
      >
        <PrimaryButton label="Back to Matches" variant="purple" onPress={() => navigation.navigate('Main')} />
      </CenteredCard>
    </Screen>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.purpleSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default IntroSentScreen;
