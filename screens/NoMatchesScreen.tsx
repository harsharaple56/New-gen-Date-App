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

type Nav = NativeStackNavigationProp<RootStackParamList, 'NoMatches'>;

const NoMatchesScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();

  return (
    <Screen>
      <CenteredCard
        media={
          <View style={styles.circle}>
            <Ionicons name="heart-outline" size={34} color={colors.purple} />
          </View>
        }
        title="No matches yet"
        subtitle="Keep sending thoughtful intros — your next connection could be a message away."
      >
        <PrimaryButton label="Explore Profiles" variant="purple" onPress={() => navigation.navigate('Main')} />
      </CenteredCard>
    </Screen>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.purpleSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default NoMatchesScreen;
