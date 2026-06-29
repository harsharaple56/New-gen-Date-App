import { ImageSourcePropType } from 'react-native';
import { Profile, User } from '../types/models';

/**
 * Mock user profiles used to populate the swipe deck, explore, matches and
 * profile screens while there is no backend. Shapes match `types/models`.
 *
 * Image URIs are Unsplash placeholders — swap for real API data in production.
 */

const img = (seed: string): ImageSourcePropType => ({
  uri: `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=800&q=80`,
});

export const mockUsers: Profile[] = [
  {
    id: 'profile_1',
    name: 'Priya',
    age: 26,
    location: 'Brooklyn, NY',
    photo: img('photo-1531123897727-8f129e1688ce'),
    tags: ['Art Director', 'Leo'],
    aligned: 87,
    bio: 'Gallery hopper, flea-market regular, always chasing good light.',
  },
  {
    id: 'profile_2',
    name: 'Maya',
    age: 28,
    location: 'Manhattan, NY',
    photo: img('photo-1488426862026-3ee34a7d66df'),
    tags: ['Photographer', 'Libra'],
    aligned: 81,
    bio: 'Shooting film on weekends and over-ordering at brunch.',
  },
  {
    id: 'profile_3',
    name: 'Sofia',
    age: 25,
    location: 'Queens, NY',
    photo: img('photo-1494790108377-be9c29b29330'),
    tags: ['Writer', 'Pisces'],
    aligned: 79,
    bio: 'Poetry, playlists and long walks with no destination.',
  },
  {
    id: 'profile_4',
    name: 'Daniel',
    age: 30,
    location: 'Jersey City, NJ',
    photo: img('photo-1500648767791-00dcc994a43e'),
    tags: ['Engineer', 'Aries'],
    aligned: 74,
    bio: 'Climbing on Saturdays, cooking experiments on Sundays.',
  },
  {
    id: 'profile_5',
    name: 'Elena',
    age: 27,
    location: 'Hoboken, NJ',
    photo: img('photo-1438761681033-6461ffad8d80'),
    tags: ['Designer', 'Gemini'],
    aligned: 90,
    bio: 'Vinyl collector and ramen enthusiast. Dog person.',
  },
  {
    id: 'profile_6',
    name: 'Marcus',
    age: 31,
    location: 'Brooklyn, NY',
    photo: img('photo-1507003211169-0a1dd7228f2d'),
    tags: ['Musician', 'Scorpio'],
    aligned: 68,
    bio: 'Gigging around the city. Will out-trivia you on music.',
  },
];

/** The signed-in user (returned by mock auth + `getMe`). */
export const mockCurrentUser: User = {
  id: 'me',
  name: 'Alex',
  age: 29,
  location: 'San Francisco, CA',
  phone: '+1 (555) 012-0199',
  photo: mockUsers[2].photo,
  bio: 'Designer who collects vinyl and chases good light.',
  verified: true,
  premium: false,
};

export default mockUsers;
