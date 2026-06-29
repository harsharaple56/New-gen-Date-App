import { ImageSourcePropType } from 'react-native';
import { ProfileCardData } from '../components/ProfileCard';

/**
 * Mock data used to populate the prototype screens.
 * Remote image URIs are placeholders — swap for real API data in production.
 */

const img = (seed: string): ImageSourcePropType => ({
  uri: `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=800&q=80`,
});

export const curatedMatches: ProfileCardData[] = [
  {
    name: 'Priya',
    age: 26,
    location: 'Brooklyn, NY',
    photo: img('photo-1531123897727-8f129e1688ce'),
    tags: ['Art Director', 'Leo'],
    aligned: 87,
  },
  {
    name: 'Maya',
    age: 28,
    location: 'Manhattan, NY',
    photo: img('photo-1488426862026-3ee34a7d66df'),
    tags: ['Photographer', 'Libra'],
    aligned: 81,
  },
  {
    name: 'Sofia',
    age: 25,
    location: 'Queens, NY',
    photo: img('photo-1494790108377-be9c29b29330'),
    tags: ['Writer', 'Pisces'],
    aligned: 79,
  },
];

export type ChatPreview = {
  id: string;
  name: string;
  message: string;
  time: string;
  avatar: ImageSourcePropType;
  unread?: boolean;
};

export const chatPreviews: ChatPreview[] = [
  {
    id: '1',
    name: 'Priya',
    message: "Loved your take on flea markets!",
    time: '2m',
    avatar: img('photo-1531123897727-8f129e1688ce'),
    unread: true,
  },
  {
    id: '2',
    name: 'Maya',
    message: 'Coffee this weekend?',
    time: '1h',
    avatar: img('photo-1488426862026-3ee34a7d66df'),
  },
  {
    id: '3',
    name: 'Sofia',
    message: 'That playlist is unreal 🎧',
    time: '3h',
    avatar: img('photo-1494790108377-be9c29b29330'),
  },
];

export type ChatMessage = {
  id: string;
  text: string;
  fromMe: boolean;
};

export const chatMessages: ChatMessage[] = [
  { id: '1', text: 'Hey! Your intro made me smile 😊', fromMe: false },
  { id: '2', text: 'Glad it landed — your gallery photos are stunning', fromMe: true },
  { id: '3', text: 'Thank you! Do you visit galleries often?', fromMe: false },
  { id: '4', text: 'Every other Sunday. The Whitney is my favourite', fromMe: true },
];

export const interests: string[] = [
  'Travel', 'Cooking', 'Photography', 'Hiking', 'Art', 'Music',
  'Reading', 'Coffee', 'Yoga', 'Startups', 'Films', 'Wine',
  'Running', 'Design', 'Gaming', 'Dogs',
];

export const galleryPhotos: ImageSourcePropType[] = [
  img('photo-1554080353-a576cf803bda'),
  img('photo-1517841905240-472988babdf9'),
];

export const heroPhoto = img('photo-1469334031218-e382a71b716b');
