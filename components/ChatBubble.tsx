import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme/theme';
import { Message } from '../types/models';

type ChatBubbleProps = {
  message: Message;
};

/**
 * A single chat message bubble. Mine = purple, right aligned; theirs = white,
 * left aligned. Extracted from `ChatScreen` so it can be reused/tested.
 */
const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => (
  <View style={[styles.bubble, message.fromMe ? styles.mine : styles.theirs]}>
    <Text style={[styles.text, message.fromMe && styles.textMine]}>{message.text}</Text>
  </View>
);

const styles = StyleSheet.create({
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
  },
  mine: { alignSelf: 'flex-end', backgroundColor: colors.purple, borderBottomRightRadius: 6 },
  theirs: { alignSelf: 'flex-start', backgroundColor: colors.surface, borderBottomLeftRadius: 6 },
  text: { fontSize: 16, color: colors.textPrimary, lineHeight: 22 },
  textMine: { color: colors.textOnDark },
});

export default ChatBubble;
