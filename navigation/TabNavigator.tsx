import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabParamList } from './types';
import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import MatchesScreen from '../screens/MatchesScreen';
import ChatListScreen from '../screens/ChatListScreen';
import MyProfileScreen from '../screens/MyProfileScreen';

const Tab = createBottomTabNavigator<TabParamList>();

/**
 * Bottom-tab navigator for the five main destinations.
 *
 * The default tab bar is hidden (`tabBar={() => null}`) because every screen
 * already renders the app's custom floating pill `BottomNav`, which switches
 * tabs by name. This keeps the exact original UI while using a real tab
 * navigator under the hood.
 */
const TabNavigator: React.FC = () => (
  <Tab.Navigator
    initialRouteName="Home"
    screenOptions={{ headerShown: false }}
    tabBar={() => null}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Explore" component={ExploreScreen} />
    <Tab.Screen name="Matches" component={MatchesScreen} />
    <Tab.Screen name="ChatList" component={ChatListScreen} />
    <Tab.Screen name="MyProfile" component={MyProfileScreen} />
  </Tab.Navigator>
);

export default TabNavigator;
