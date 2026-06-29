import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { colors } from '../theme/theme';
import { useAppStore } from '../store/useAppStore';
import TabNavigator from './TabNavigator';
import {
  SplashScreen,
  WelcomeScreen,
  LoginScreen,
  OtpScreen,
  VerificationScreen,
  AddPhotosScreen,
  BioScreen,
  PromptAnswersScreen,
  InterestSelectionScreen,
  DatingIntentScreen,
  VoiceIntroScreen,
  LocationPermissionScreen,
  NotificationPermissionScreen,
  ChatScreen,
  ProfileDetailScreen,
  ProfilePreviewScreen,
  SendIntroScreen,
  IntroSentScreen,
  MatchSuccessScreen,
  EditProfileScreen,
  PreferencesScreen,
  FiltersSheetScreen,
  SettingsScreen,
  PrivacyScreen,
  BlockReportScreen,
  PremiumSubscriptionScreen,
  PaymentConfirmationScreen,
  PremiumSuccessScreen,
  NoMatchesScreen,
  NoProfilesScreen,
  DevMenuScreen,
} from '../screens';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Root stack. Three flows are swapped declaratively based on session state:
 *
 *   1. Auth        — Splash → Welcome → Login → OTP            (!isLoggedIn)
 *   2. Onboarding  — Permissions → photos → … → Verification  (logged in, not onboarded)
 *   3. Main        — bottom tabs + all detail / modal screens (logged in + onboarded)
 *
 * Flipping `isLoggedIn` / `onboardingComplete` in the store animates between
 * flows automatically, so screens never have to manually reset the stack.
 * The five tab destinations live inside `TabNavigator`; every other screen is
 * a sibling on the root stack so navigation from a tab "bubbles up" here.
 */
const RootNavigator: React.FC = () => {
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);
  const onboardingComplete = useAppStore((s) => s.onboardingComplete);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      {!isLoggedIn ? (
        <Stack.Group>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Otp" component={OtpScreen} />
          <Stack.Screen name="DevMenu" component={DevMenuScreen} />
        </Stack.Group>
      ) : !onboardingComplete ? (
        <Stack.Group>
          <Stack.Screen name="LocationPermission" component={LocationPermissionScreen} />
          <Stack.Screen name="NotificationPermission" component={NotificationPermissionScreen} />
          <Stack.Screen name="AddPhotos" component={AddPhotosScreen} />
          <Stack.Screen name="Bio" component={BioScreen} />
          <Stack.Screen name="InterestSelection" component={InterestSelectionScreen} />
          <Stack.Screen name="DatingIntent" component={DatingIntentScreen} />
          <Stack.Screen name="PromptAnswers" component={PromptAnswersScreen} />
          <Stack.Screen name="VoiceIntro" component={VoiceIntroScreen} />
          <Stack.Screen name="Verification" component={VerificationScreen} />
          <Stack.Screen name="DevMenu" component={DevMenuScreen} />
        </Stack.Group>
      ) : (
        <Stack.Group>
          {/* Bottom-tab container */}
          <Stack.Screen name="Main" component={TabNavigator} />

          {/* Profiles & intros */}
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen} />
          <Stack.Screen name="ProfilePreview" component={ProfilePreviewScreen} />
          <Stack.Screen name="SendIntro" component={SendIntroScreen} />
          <Stack.Screen name="IntroSent" component={IntroSentScreen} />
          <Stack.Screen name="MatchSuccess" component={MatchSuccessScreen} />

          {/* Account */}
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="Preferences" component={PreferencesScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Privacy" component={PrivacyScreen} />
          <Stack.Screen name="BlockReport" component={BlockReportScreen} />

          {/* Premium */}
          <Stack.Screen name="PremiumSubscription" component={PremiumSubscriptionScreen} />
          <Stack.Screen name="PaymentConfirmation" component={PaymentConfirmationScreen} />
          <Stack.Screen name="PremiumSuccess" component={PremiumSuccessScreen} />

          {/* Empty states */}
          <Stack.Screen name="NoMatches" component={NoMatchesScreen} />
          <Stack.Screen name="NoProfiles" component={NoProfilesScreen} />

          {/* Modal sheet */}
          <Stack.Screen
            name="FiltersSheet"
            component={FiltersSheetScreen}
            options={{ presentation: 'transparentModal', animation: 'slide_from_bottom' }}
          />

          {/* Dev-only helper */}
          <Stack.Screen name="DevMenu" component={DevMenuScreen} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
