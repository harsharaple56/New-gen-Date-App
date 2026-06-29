/* eslint-disable no-console */
import { PrismaClient, Role, SwipeAction } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const INTERESTS = [
  ['Travel', 'Lifestyle'],
  ['Music', 'Arts'],
  ['Foodie', 'Lifestyle'],
  ['Fitness', 'Health'],
  ['Movies', 'Entertainment'],
  ['Reading', 'Arts'],
  ['Photography', 'Arts'],
  ['Gaming', 'Entertainment'],
  ['Hiking', 'Outdoors'],
  ['Cooking', 'Lifestyle'],
  ['Yoga', 'Health'],
  ['Coffee', 'Lifestyle'],
];

const PHOTO = (g: 'men' | 'women', n: number) => `https://randomuser.me/api/portraits/${g}/${n}.jpg`;

const PEOPLE = [
  { name: 'Aarav', gender: 'male', age: 28, city: 'Mumbai', lat: 19.076, lng: 72.8777, g: 'men' as const, n: 11 },
  { name: 'Vivaan', gender: 'male', age: 30, city: 'Delhi', lat: 28.7041, lng: 77.1025, g: 'men' as const, n: 22 },
  { name: 'Ananya', gender: 'female', age: 26, city: 'Mumbai', lat: 19.07, lng: 72.87, g: 'women' as const, n: 33 },
  { name: 'Diya', gender: 'female', age: 27, city: 'Bangalore', lat: 12.9716, lng: 77.5946, g: 'women' as const, n: 44 },
  { name: 'Kabir', gender: 'male', age: 31, city: 'Pune', lat: 18.5204, lng: 73.8567, g: 'men' as const, n: 55 },
  { name: 'Isha', gender: 'female', age: 25, city: 'Delhi', lat: 28.61, lng: 77.23, g: 'women' as const, n: 66 },
  { name: 'Rohan', gender: 'male', age: 29, city: 'Bangalore', lat: 12.97, lng: 77.59, g: 'men' as const, n: 77 },
  { name: 'Meera', gender: 'female', age: 28, city: 'Mumbai', lat: 19.08, lng: 72.88, g: 'women' as const, n: 8 },
  { name: 'Arjun', gender: 'male', age: 33, city: 'Hyderabad', lat: 17.385, lng: 78.4867, g: 'men' as const, n: 9 },
  { name: 'Sara', gender: 'female', age: 24, city: 'Pune', lat: 18.52, lng: 73.85, g: 'women' as const, n: 10 },
];

const GOALS = ['Long-term', 'Casual', 'Friendship', 'Not sure yet'];

async function reset() {
  // Order matters because of FK constraints (children first).
  await prisma.message.deleteMany();
  await prisma.chat.deleteMany();
  await prisma.match.deleteMany();
  await prisma.swipe.deleteMany();
  await prisma.intro.deleteMany();
  await prisma.report.deleteMany();
  await prisma.block.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.userInterest.deleteMany();
  await prisma.userPhoto.deleteMany();
  await prisma.preference.deleteMany();
  await prisma.notificationSetting.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.interest.deleteMany();
  await prisma.user.deleteMany();
}

function orderedPair(a: string, b: string): [string, string] {
  return a < b ? [a, b] : [b, a];
}

async function main() {
  console.log('🌱 Seeding database...');
  await reset();

  // Interests
  const interests = await Promise.all(
    INTERESTS.map(([name, category]) => prisma.interest.create({ data: { name, category } })),
  );

  const passwordHash = bcrypt.hashSync('password123', 10);

  // Admin + moderator
  await prisma.user.create({
    data: {
      phone: '+910000000001',
      email: 'admin@align.app',
      passwordHash: bcrypt.hashSync('admin123', 10),
      role: Role.ADMIN,
      isVerified: true,
      profile: { create: { name: 'Align Admin', age: 35, gender: 'other' } },
    },
  });
  await prisma.user.create({
    data: {
      phone: '+910000000002',
      email: 'mod@align.app',
      passwordHash: bcrypt.hashSync('mod123', 10),
      role: Role.MODERATOR,
      isVerified: true,
      profile: { create: { name: 'Align Moderator', age: 32, gender: 'other' } },
    },
  });

  // Normal users
  const users = [];
  for (let i = 0; i < PEOPLE.length; i++) {
    const p = PEOPLE[i];
    const interestSlice = [interests[i % interests.length], interests[(i + 3) % interests.length], interests[(i + 6) % interests.length]];

    const user = await prisma.user.create({
      data: {
        phone: `+9198765000${(10 + i).toString()}`,
        email: `${p.name.toLowerCase()}@example.com`,
        passwordHash,
        role: Role.USER,
        isVerified: true,
        profile: {
          create: {
            name: p.name,
            age: p.age,
            gender: p.gender,
            bio: `Hi, I'm ${p.name}. Lover of life in ${p.city}.`,
            location: p.city,
            latitude: p.lat,
            longitude: p.lng,
            occupation: ['Engineer', 'Designer', 'Doctor', 'Teacher', 'Artist'][i % 5],
            education: ['IIT', 'NID', 'AIIMS', 'DU', 'NIFT'][i % 5],
            height: 160 + (i % 25),
            drinking: i % 2 === 0 ? 'Socially' : 'Never',
            smoking: i % 3 === 0 ? 'Sometimes' : 'Never',
            relationshipGoal: GOALS[i % GOALS.length],
          },
        },
        photos: {
          create: [
            { imageUrl: PHOTO(p.g, p.n), isPrimary: true },
            { imageUrl: PHOTO(p.g, (p.n + 1) % 99), isPrimary: false },
          ],
        },
        preference: {
          create: {
            minAge: 22,
            maxAge: 40,
            distanceKm: 100,
            genderPreference: p.gender === 'male' ? 'female' : 'male',
          },
        },
        notificationSetting: { create: {} },
        interests: {
          create: interestSlice.map((it) => ({ interestId: it.id })),
        },
      },
    });
    users.push(user);
  }

  // Swipes — create a couple of mutual likes that become matches.
  const mutualPairs: Array<[number, number]> = [
    [0, 2],
    [4, 3],
    [6, 5],
  ];
  for (const [a, b] of mutualPairs) {
    await prisma.swipe.create({ data: { swiperId: users[a].id, swipedUserId: users[b].id, action: SwipeAction.LIKE } });
    await prisma.swipe.create({ data: { swiperId: users[b].id, swipedUserId: users[a].id, action: SwipeAction.LIKE } });
  }
  // A few one-directional likes (pending matches).
  await prisma.swipe.create({ data: { swiperId: users[1].id, swipedUserId: users[7].id, action: SwipeAction.SUPERLIKE } });
  await prisma.swipe.create({ data: { swiperId: users[8].id, swipedUserId: users[9].id, action: SwipeAction.PASS } });

  // Matches + chats + messages for the mutual pairs.
  for (const [a, b] of mutualPairs) {
    const [one, two] = orderedPair(users[a].id, users[b].id);
    const match = await prisma.match.create({
      data: { userOneId: one, userTwoId: two, status: 'ACTIVE', chat: { create: {} } },
      include: { chat: true },
    });
    const chatId = match.chat!.id;
    await prisma.message.createMany({
      data: [
        { chatId, senderId: users[a].id, text: 'Hey! Loved your profile 😊', isRead: true },
        { chatId, senderId: users[b].id, text: 'Thank you! How is your day going?', isRead: true },
        { chatId, senderId: users[a].id, text: 'Pretty good! Want to grab coffee this weekend?', isRead: false },
      ],
    });
  }

  // A report.
  await prisma.report.create({
    data: {
      reporterId: users[3].id,
      reportedUserId: users[8].id,
      reason: 'Inappropriate messages',
      description: 'Sent offensive content in chat.',
      status: 'PENDING',
    },
  });

  // Subscriptions.
  const now = new Date();
  const in30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  await prisma.subscription.create({
    data: { userId: users[0].id, plan: 'PREMIUM', status: 'ACTIVE', provider: 'razorpay', paymentId: 'pay_demo_1', startDate: now, endDate: in30 },
  });
  await prisma.subscription.create({
    data: { userId: users[4].id, plan: 'GOLD', status: 'ACTIVE', provider: 'razorpay', paymentId: 'pay_demo_2', startDate: now, endDate: in30 },
  });
  await prisma.subscription.create({
    data: { userId: users[6].id, plan: 'PLATINUM', status: 'PENDING', provider: 'razorpay' },
  });

  console.log(`✅ Seed complete: ${users.length} users, ${mutualPairs.length} matches.`);
  console.log('   Admin login: admin@align.app / admin123');
  console.log('   User login:  aarav@example.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
