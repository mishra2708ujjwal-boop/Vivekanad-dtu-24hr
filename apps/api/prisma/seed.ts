import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Seva database seed...');

  // 1. Seed Skills Catalog (30 skills)
  const skillsData = [
    { name: 'Web Frontend Development', category: 'tech' },
    { name: 'Backend API Development', category: 'tech' },
    { name: 'UI/UX Design', category: 'tech' },
    { name: 'Mobile App Development', category: 'tech' },
    { name: 'Digital Literacy & Basics', category: 'tech' },
    
    { name: 'Organic Farming', category: 'farming' },
    { name: 'Soil Preparation & Composting', category: 'farming' },
    { name: 'Kitchen Gardening', category: 'farming' },
    { name: 'Rainwater Harvesting', category: 'farming' },
    
    { name: 'Wall Painting & Mural Art', category: 'art' },
    { name: 'Calligraphy & Lettering', category: 'art' },
    { name: 'Storytelling & Drama', category: 'art' },
    { name: 'Traditional Music', category: 'art' },
    
    { name: 'Mathematics Teaching', category: 'teaching' },
    { name: 'English Communication', category: 'teaching' },
    { name: 'Public Speaking', category: 'teaching' },
    { name: 'Science Experiments for Kids', category: 'teaching' },
    
    { name: 'First Aid & Basic Hygiene', category: 'healthcare' },
    { name: 'Mental Wellness & Listening', category: 'healthcare' },
    { name: 'Yoga & Pranayama', category: 'healthcare' },

    { name: 'Content Writing', category: 'communication' },
    { name: 'Video Editing', category: 'communication' },
    { name: 'Community Organizing', category: 'leadership' },
    { name: 'Event Management', category: 'leadership' },
    { name: 'Carpentry & Woodwork', category: 'craft' },
    { name: 'Electrical Repair', category: 'craft' },
    { name: 'Cooking & Meal Prep', category: 'care' },
    { name: 'Elder Care', category: 'care' },
    { name: 'Child Mentorship', category: 'care' },
    { name: 'Waste Management & Recycling', category: 'environment' }
  ];

  for (const s of skillsData) {
    await prisma.skill.upsert({
      where: { name: s.name },
      update: {},
      create: s,
    });
  }
  console.log('✅ Seeded 30 Skills catalog.');

  const hashedPassword = await argon2.hash('Password123!');

  // 2. Seed Users & Profiles
  // Aarav (CS Student)
  const aarav = await prisma.user.upsert({
    where: { email: 'aarav@example.com' },
    update: {},
    create: {
      email: 'aarav@example.com',
      passwordHash: hashedPassword,
      systemRole: 'participant',
      profile: {
        create: {
          displayName: 'Aarav Sharma',
          bio: '20yo CS student passionate about using code for real community impact.',
          areaLabel: 'North Delhi',
          lat: 28.651,
          lng: 77.221,
          languages: ['English', 'Hindi'],
          availability: { weekends: true, evenings: true },
          visibility: 'public',
          onboardingDone: true
        }
      }
    }
  });

  // Meera (UI Designer)
  const meera = await prisma.user.upsert({
    where: { email: 'meera@example.com' },
    update: {},
    create: {
      email: 'meera@example.com',
      passwordHash: hashedPassword,
      systemRole: 'participant',
      profile: {
        create: {
          displayName: 'Meera Patel',
          bio: '24yo UI Designer. Love teaching design and learning traditional arts.',
          areaLabel: 'West Delhi',
          lat: 28.632,
          lng: 77.121,
          languages: ['English', 'Hindi', 'Gujarati'],
          availability: { weekends: true },
          visibility: 'public',
          onboardingDone: true
        }
      }
    }
  });

  // Savita (Community School Lead)
  const savita = await prisma.user.upsert({
    where: { email: 'savita@example.com' },
    update: {},
    create: {
      email: 'savita@example.com',
      passwordHash: hashedPassword,
      systemRole: 'participant',
      profile: {
        create: {
          displayName: 'Savita Devi',
          bio: 'Runs a community school for village kids. Passionate about child education.',
          areaLabel: 'Outer Delhi Village',
          lat: 28.712,
          lng: 77.155,
          languages: ['Hindi'],
          availability: { weekdays: true, weekends: true },
          visibility: 'public',
          onboardingDone: true
        }
      }
    }
  });

  // Ramesh (Retired Farmer)
  const ramesh = await prisma.user.upsert({
    where: { email: 'ramesh@example.com' },
    update: {},
    create: {
      email: 'ramesh@example.com',
      passwordHash: hashedPassword,
      systemRole: 'participant',
      profile: {
        create: {
          displayName: 'Ramesh Kumar',
          bio: '60yo retired organic farmer. Eager to learn smartphone & tech skills.',
          areaLabel: 'Outer Delhi Village',
          lat: 28.715,
          lng: 77.158,
          languages: ['Hindi'],
          availability: { mornings: true },
          visibility: 'public',
          onboardingDone: true
        }
      }
    }
  });

  // Ishita (First-year student)
  const ishita = await prisma.user.upsert({
    where: { email: 'ishita@example.com' },
    update: {},
    create: {
      email: 'ishita@example.com',
      passwordHash: hashedPassword,
      systemRole: 'participant',
      profile: {
        create: {
          displayName: 'Ishita Roy',
          bio: '19yo college freshman starting her Seva journey in neighborhood care.',
          areaLabel: 'South Delhi',
          lat: 28.541,
          lng: 77.201,
          languages: ['English', 'Hindi', 'Bengali'],
          availability: { weekends: true },
          visibility: 'members',
          onboardingDone: true
        }
      }
    }
  });

  // Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash: hashedPassword,
      systemRole: 'admin',
      profile: {
        create: {
          displayName: 'Priya (Platform Moderator)',
          bio: 'Ensuring platform safety, dignity standards, and community support.',
          areaLabel: 'Central Delhi',
          visibility: 'public',
          onboardingDone: true
        }
      }
    }
  });

  console.log('✅ Seeded 6 Core Users & Profiles.');

  // 3. User Sankalps
  await prisma.sankalp.createMany({
    data: [
      { userId: aarav.id, intention: 'humility', note: 'Focusing on process, not self-ego.', active: true },
      { userId: meera.id, intention: 'listening', note: 'Listening deeply to community needs.', active: true },
      { userId: savita.id, intention: 'empowerment', note: 'Ensuring our school stands on its own feet.', active: true },
      { userId: ramesh.id, intention: 'learning', note: 'Embracing modern tools with patience.', active: true }
    ],
    skipDuplicates: true
  });

  // 4. Organization
  const org = await prisma.organization.create({
    data: {
      name: 'Ananda Community School',
      description: 'Providing free holistic education to 80 children in village locality.',
      areaLabel: 'Outer Delhi Village',
      verified: true,
      verifiedBy: admin.id,
      createdBy: savita.id
    }
  });

  // 5. Community Need
  const need = await prisma.community_need.create({
    data: {
      postedBy: savita.id,
      organizationId: org.id,
      rawText: 'Our school needs a simple website to share announcements with parents and show our kids work.',
      title: 'Digital Presence & Website for Ananda Community School',
      structured: {
        requiredContributions: [
          { label: 'Web Frontend Development', count: 1 },
          { label: 'UI/UX Design', count: 1 },
          { label: 'Content Writing', count: 1 }
        ],
        sessions: 4,
        potentialLearning: ['Community school operations', 'Rural education challenges', 'Cross-generational communication']
      },
      empowermentNote: 'Includes a mandatory handover session so school teachers can update text & photos independently.',
      category: 'tech',
      areaLabel: 'Outer Delhi Village',
      lat: 28.712,
      lng: 77.155,
      status: 'open'
    }
  });

  // 6. Seva Opportunity
  const seva = await prisma.sevaOpportunity.create({
    data: {
      createdBy: savita.id,
      needId: need.id,
      organizationId: org.id,
      title: 'Build School Website & Teach Maintenance',
      purpose: 'Design and deploy a simple, lightweight website for Ananda School and train teachers.',
      description: 'Collaborative 4-session Seva project combining UI design, coding, content, and handover.',
      category: 'tech',
      isTech: true,
      requiredContributions: [
        { skill_id: 1, count: 1, description: 'Build responsive web layout' },
        { skill_id: 3, count: 1, description: 'Clean user interface design' },
        { skill_id: 21, count: 1, description: 'Write stories & announcements' }
      ],
      potentialLearning: ['Community school operations', 'Digital literacy handover'],
      capacity: 5,
      empowermentNote: 'Every participant commits to teaching handover so Savita and team maintain the site.',
      status: 'open',
      events: {
        create: [
          {
            startsAt: new Date(Date.now() + 86400000 * 2), // in 2 days
            endsAt: new Date(Date.now() + 86400000 * 2 + 7200000),
            placeLabel: 'Ananda School Hall',
            addressPrivate: 'Plot 12, Village Edge Road, Bawana, New Delhi',
            lat: 28.712,
            lng: 77.155,
            mode: 'in_person'
          }
        ]
      }
    }
  });

  console.log('✅ Seeded Community Need & Seva Opportunity.');
  console.log('🎉 Seva database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
