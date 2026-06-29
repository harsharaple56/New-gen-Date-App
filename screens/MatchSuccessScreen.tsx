import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import Screen from '../components/Screen';
import CenteredCard from '../components/CenteredCard';
import Avatar from '../components/Avatar';
import PrimaryButton from '../components/PrimaryButton';
import { curatedMatches } from '../data/mock';
import { colors, spacing } from '../theme/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'MatchSuccess'>;

const MatchSuccessScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();

  return (
    <Screen showStatusBar={false}>
      <CenteredCard
        media={
          <View style={styles.avatars}>
            <Avatar source={curatedMatches[1].photo} size={72} />
            <Avatar source={curatedMatches[0].photo} size={72} ring style={styles.overlap} />
          </View>
        }
        title="You both connected"
        subtitle="You and Priya both said yes. Now's the perfect time to start a conversation."
      >
        <PrimaryButton label="Start Chat" variant="purple" onPress={() => navigation.navigate('Chat', { name: 'Priya' })} />
        <TouchableOpacity onPress={() => navigation.navigate('Main')}>
          <Text style={styles.link}>Keep exploring</Text>
        </TouchableOpacity>
      </CenteredCard>
    </Screen>
  );
};

const styles = StyleSheet.create({
  avatars: { flexDirection: 'row' },
  overlap: { marginLeft: -20 },
  link: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '600',
    color: colors.textSecondary,
    paddingVertical: spacing.xs,
  },
});

export default MatchSuccessScreen;
