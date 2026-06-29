import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import Screen from '../components/Screen';
import CenteredCard from '../components/CenteredCard';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'PremiumSuccess'>;

const PremiumSuccessScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();

  return (
    <Screen showStatusBar={false}>
      <CenteredCard
        media={<Ionicons name="sparkles" size={44} color={colors.gold} />}
        title="You're Premium now ✦"
        subtitle="Enjoy 5 curated profiles every day and priority intro sorting."
      >
        <PrimaryButton label="Explore Matches" variant="black" onPress={() => navigation.navigate('Main')} />
      </CenteredCard>
    </Screen>
  );
};

export default PremiumSuccessScreen;
