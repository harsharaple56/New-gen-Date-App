/**
 * Navigation param list. Every screen is registered here so `useNavigation`
 * and route params are fully typed across the app.
 */
export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  Otp: { phone?: string } | undefined;
  Verification: undefined;
  AddPhotos: undefined;
  Bio: undefined;
  PromptAnswers: undefined;
  InterestSelection: undefined;
  DatingIntent: undefined;
  VoiceIntro: undefined;
  LocationPermission: undefined;
  NotificationPermission: undefined;

  // Main bottom-tab container
  Main: undefined;

  // Tab routes (also reachable directly via the in-screen BottomNav)
  Home: undefined;
  Explore: undefined;
  Matches: undefined;
  ChatList: undefined;
  MyProfile: undefined;

  Chat: { chatId?: string; name?: string } | undefined;

  ProfileDetail: { id?: string } | undefined;
  ProfilePreview: undefined;
  SendIntro: { name?: string } | undefined;
  IntroSent: undefined;
  MatchSuccess: undefined;

  EditProfile: undefined;
  Preferences: undefined;
  FiltersSheet: undefined;
  Settings: undefined;
  Privacy: undefined;
  BlockReport: undefined;

  PremiumSubscription: undefined;
  PaymentConfirmation: undefined;
  PremiumSuccess: undefined;

  NoMatches: undefined;
  NoProfiles: undefined;

  // Development-only helper screen for jumping between any screen.
  DevMenu: undefined;
};

/** Bottom-tab routes nested under the `Main` stack route. */
export type TabParamList = {
  Home: undefined;
  Explore: undefined;
  Matches: undefined;
  ChatList: undefined;
  MyProfile: undefined;
};
