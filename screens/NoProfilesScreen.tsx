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

type Nav = NativeStackNavigationProp<RootStackParamList, 'NoProfiles'>;

const NoProfilesScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();

  return (
    <Screen>
      <CenteredCard
        media={
          <View style={styles.circle}>
            <Ionicons name="checkmark-done" size={34} color={colors.gold} />
          </View>
        }
        title="You're all caught up"
        subtitle="Check back tomorrow for 5 new curated profiles, hand-picked just for you."
      >
        <PrimaryButton label="Upgrade for More" variant="black" onPress={() => navigation.navigate('PremiumSubscription')} />
      </CenteredCard>
    </Screen>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F6EEDD',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default NoProfilesScreen;
