import { ImageSourcePropType } from 'react-native';

/** A user-facing profile shown in swipe cards, explore and matches. */
export type Profile = {
  id: string;
  name: string;
  age: number;
  location: string;
  photo: ImageSourcePropType;
  tags: string[];
  aligned?: number;
  bio?: string;
};

/** The authenticated user. */
export type User = {
  id: string;
  name: string;
  age: number;
  location: string;
  phone: string;
  photo: ImageSourcePropType;
  bio?: string;
  verified: boolean;
  premium: boolean;
};

/** A mutual match. */
export type Match = {
  id: string;
  profile: Profile;
  matchedAt: string;
};

/** A conversation preview shown in the chat list. */
export type Chat = {
  id: string;
  name: string;
  avatar: ImageSourcePropType;
  message: string;
  time: string;
  unread?: boolean;
};

/** A single chat message. */
export type Message = {
  id: string;
  chatId: string;
  text: string;
  fromMe: boolean;
  createdAt: string;
};

export type SwipeDirection = 'pass' | 'like';
