import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import Screen from '../components/Screen';
import Avatar from '../components/Avatar';
import BottomNav, { TabKey } from '../components/BottomNav';
import { LoadingState, ErrorState, EmptyState } from '../components/StateViews';
import { useAppStore } from '../store/useAppStore';
import { useChats } from '../services/queries';
import { Chat } from '../types/models';
import { colors, spacing } from '../theme/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'ChatList'>;

const TAB_ROUTES: Record<TabKey, keyof RootStackParamList> = {
  home: 'Home',
  explore: 'Explore',
  matches: 'Matches',
  chat: 'ChatList',
  profile: 'MyProfile',
};

const ChatListScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { isLoading, isError, refetch } = useChats();
  const chats = useAppStore((s) => s.chats);

  const renderItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      style={styles.row}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('Chat', { chatId: item.id, name: item.name })}
    >
      <Avatar source={item.avatar} size={58} />
      <View style={styles.rowBody}>
        <View style={styles.rowTop}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Text style={[styles.message, item.unread && styles.messageUnread]} numberOfLines={1}>
          {item.message}
        </Text>
      </View>
      {item.unread ? <View style={styles.dot} /> : null}
    </TouchableOpacity>
  );

  const renderBody = () => {
    if (isLoading && chats.length === 0) return <LoadingState label="Loading messages…" />;
    if (isError && chats.length === 0) {
      return <ErrorState message="We couldn't load your messages." onRetry={() => refetch()} />;
    }
    if (chats.length === 0) {
      return (
        <EmptyState
          icon="chatbubbles-outline"
          title="No messages yet"
          subtitle="When you match and say hi, your conversations show up here."
        />
      );
    }
    return (
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <Screen>
      <Text style={styles.title}>Messages</Text>
      <View style={styles.flex}>{renderBody()}</View>
      <View style={styles.nav}>
        <BottomNav active="chat" onChange={(key) => key !== 'chat' && navigation.navigate(TAB_ROUTES[key] as never)} />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.textPrimary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    letterSpacing: -0.5,
  },
  list: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, gap: spacing.lg },
  rowBody: { flex: 1 },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  name: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  time: { fontSize: 14, color: colors.textMuted },
  message: { fontSize: 16, color: colors.textSecondary },
  messageUnread: { color: colors.textPrimary, fontWeight: '600' },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.purple },
  nav: { paddingHorizontal: spacing.xl, paddingBottom: spacing.sm },
});

export default ChatListScreen;
