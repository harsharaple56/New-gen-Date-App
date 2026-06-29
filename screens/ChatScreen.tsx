import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import StatusBarMock from '../components/StatusBarMock';
import Avatar from '../components/Avatar';
import ChatBubble from '../components/ChatBubble';
import { LoadingState } from '../components/StateViews';
import { useAppStore } from '../store/useAppStore';
import { useMessages, useSendMessage } from '../services/queries';
import { chatSocket } from '../services/socket';
import { Message } from '../types/models';
import { curatedMatches } from '../data/mock';
import { colors, radius, spacing } from '../theme/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Chat'>;
type Rt = RouteProp<RootStackParamList, 'Chat'>;

const ChatScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const chatId = route.params?.chatId ?? 'chat_1';
  const name = route.params?.name ?? 'Priya';
  const [draft, setDraft] = useState('');

  const { isLoading } = useMessages(chatId);
  const messages = useAppStore((s) => s.messagesByChat[chatId] ?? []);
  const addMessage = useAppStore((s) => s.addMessage);
  const sendMessage = useSendMessage(chatId);

  // Connect to the realtime channel and append inbound messages to the store.
  useEffect(() => {
    chatSocket.connect();
    chatSocket.joinChat(chatId);
    const unsubscribe = chatSocket.onMessage((message) => {
      if (message.chatId === chatId) addMessage(chatId, message);
    });
    return () => {
      unsubscribe();
      chatSocket.leaveChat(chatId);
    };
  }, [chatId, addMessage]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    sendMessage.mutate(text, {
      onSuccess: (saved) => {
        addMessage(chatId, saved);
        chatSocket.send(chatId, saved);
      },
    });
  };

  const renderItem = ({ item }: { item: Message }) => <ChatBubble message={item} />;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBarMock />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
          <Ionicons name="chevron-back" size={26} color={colors.textPrimary} />
        </TouchableOpacity>
        <Avatar source={curatedMatches[0].photo} size={40} />
        <Text style={styles.headerName}>{name}</Text>
      </View>

      {isLoading && messages.length === 0 ? (
        <LoadingState label="Loading conversation…" />
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.inputBar}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Message..."
            placeholderTextColor={colors.textMuted}
            style={styles.input}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={send}>
            <Ionicons name="arrow-up" size={22} color={colors.textOnDark} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  headerName: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  list: { padding: spacing.xl, gap: spacing.md },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  input: {
    flex: 1,
    height: 52,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    fontSize: 16,
    color: colors.textPrimary,
  },
  sendBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChatScreen;
