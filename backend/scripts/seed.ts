import 'reflect-metadata';
import { config } from 'dotenv';
import * as bcrypt from 'bcrypt';
import mongoose, { Types } from 'mongoose';
import { resolve } from 'path';
import { UserRole } from '../src/common/enums/user-role.enum';
import {
  MentorAvailability,
  MentorAvailabilitySchema,
} from '../src/mentors/schemas/mentor-availability.schema';
import {
  MentorProfile,
  MentorProfileSchema,
} from '../src/mentors/schemas/mentor-profile.schema';
import { Stack, StackSchema } from '../src/stacks/schemas/stack.schema';
import {
  StudentProfile,
  StudentProfileSchema,
} from '../src/students/schemas/student-profile.schema';
import { User, UserSchema } from '../src/users/schemas/user.schema';

config({ path: resolve(__dirname, '../.env') });

const SEED_PASSWORD = 'SeedPass123';
const SALT_ROUNDS = 10;

const STACKS = [
  {
    name: 'React Engineering',
    description: 'Frontend architecture, hooks, performance, and component design.',
  },
  {
    name: 'Python Systems',
    description: 'Backend services, APIs, and data pipelines with Python.',
  },
  {
    name: 'System Design',
    description: 'Scalable architecture, trade-offs, and interview preparation.',
  },
  {
    name: 'Node.js Backend',
    description: 'Express, NestJS, REST APIs, and MongoDB integration.',
  },
] as const;

type AvailabilityWindow = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

type MentorSeed = {
  email: string;
  name: string;
  title: string;
  bio: string;
  stackName: (typeof STACKS)[number]['name'];
  isVerified: boolean;
  averageRating: number;
  hourlyRate: number;
  availability: AvailabilityWindow[];
};

const MENTORS: MentorSeed[] = [
  {
    email: 'sara.mentor@seed.dev',
    name: 'Sara Ahmed',
    title: 'Senior React Engineer',
    bio: 'Helps teams ship accessible UIs with React, TypeScript, and modern tooling.',
    stackName: 'React Engineering',
    isVerified: true,
    averageRating: 4.8,
    hourlyRate: 45,
    availability: [
      { dayOfWeek: 1, startTime: '09:00', endTime: '12:00' },
      { dayOfWeek: 1, startTime: '14:00', endTime: '17:00' },
      { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 5, startTime: '10:00', endTime: '16:00' },
    ],
  },
  {
    email: 'omar.mentor@seed.dev',
    name: 'Omar Hassan',
    title: 'Python Backend Lead',
    bio: 'Reviews FastAPI and Django codebases with a focus on reliability and testing.',
    stackName: 'Python Systems',
    isVerified: true,
    averageRating: 4.6,
    hourlyRate: 50,
    availability: [
      { dayOfWeek: 2, startTime: '10:00', endTime: '18:00' },
      { dayOfWeek: 4, startTime: '10:00', endTime: '18:00' },
    ],
  },
  {
    email: 'lina.mentor@seed.dev',
    name: 'Lina Farouk',
    title: 'Staff System Designer',
    bio: 'Guides engineers through distributed systems, caching, and interview loops.',
    stackName: 'System Design',
    isVerified: true,
    averageRating: 4.9,
    hourlyRate: 65,
    availability: [
      { dayOfWeek: 1, startTime: '11:00', endTime: '15:00' },
      { dayOfWeek: 4, startTime: '11:00', endTime: '15:00' },
      { dayOfWeek: 6, startTime: '09:00', endTime: '13:00' },
    ],
  },
  {
    email: 'karim.mentor@seed.dev',
    name: 'Karim Nabil',
    title: 'Node.js Platform Engineer',
    bio: 'Specializes in NestJS, MongoDB schema design, and production API hardening.',
    stackName: 'Node.js Backend',
    isVerified: true,
    averageRating: 4.5,
    hourlyRate: 48,
    availability: [
      { dayOfWeek: 0, startTime: '13:00', endTime: '17:00' },
      { dayOfWeek: 2, startTime: '09:00', endTime: '13:00' },
      { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' },
    ],
  },
  {
    email: 'yasmin.mentor@seed.dev',
    name: 'Yasmin Ali',
    title: 'Frontend Mentor',
    bio: 'Pairs on React refactors, state management, and portfolio-ready project reviews.',
    stackName: 'React Engineering',
    isVerified: true,
    averageRating: 4.7,
    hourlyRate: 40,
    availability: [
      { dayOfWeek: 1, startTime: '16:00', endTime: '20:00' },
      { dayOfWeek: 3, startTime: '16:00', endTime: '20:00' },
      { dayOfWeek: 5, startTime: '14:00', endTime: '18:00' },
    ],
  },
];

const DEV_STUDENT = {
  email: 'student@seed.dev',
  name: 'Alex Rivera',
};

const SEED_EMAILS = [
  ...MENTORS.map((m) => m.email),
  DEV_STUDENT.email,
];

function getModel<T>(name: string, schema: mongoose.Schema): mongoose.Model<T> {
  return (mongoose.models[name] as mongoose.Model<T>) ?? mongoose.model<T>(name, schema);
}

async function clearSeedData(
  userModel: mongoose.Model<User>,
  stackModel: mongoose.Model<Stack>,
  mentorProfileModel: mongoose.Model<MentorProfile>,
  mentorAvailabilityModel: mongoose.Model<MentorAvailability>,
  studentProfileModel: mongoose.Model<StudentProfile>,
) {
  const seedUsers = await userModel.find({ email: { $in: SEED_EMAILS } }).exec();
  const seedUserIds = seedUsers.map((u) => u._id);

  const seedProfiles = await mentorProfileModel
    .find({ user: { $in: seedUserIds } })
    .exec();
  const seedProfileIds = seedProfiles.map((p) => p._id);

  await mentorAvailabilityModel.deleteMany({ mentor: { $in: seedProfileIds } });
  await mentorProfileModel.deleteMany({ user: { $in: seedUserIds } });
  await studentProfileModel.deleteMany({ user: { $in: seedUserIds } });
  await userModel.deleteMany({ email: { $in: SEED_EMAILS } });
  await stackModel.deleteMany({ name: { $in: STACKS.map((s) => s.name) } });
}

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set. Copy backend/.env.example to backend/.env');
  }

  const fresh = process.argv.includes('--fresh');

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });

  const userModel = getModel<User>(User.name, UserSchema);
  const stackModel = getModel<Stack>(Stack.name, StackSchema);
  const mentorProfileModel = getModel<MentorProfile>(
    MentorProfile.name,
    MentorProfileSchema,
  );
  const mentorAvailabilityModel = getModel<MentorAvailability>(
    MentorAvailability.name,
    MentorAvailabilitySchema,
  );
  const studentProfileModel = getModel<StudentProfile>(
    StudentProfile.name,
    StudentProfileSchema,
  );

  if (fresh) {
    console.log('Clearing previous seed data…');
    await clearSeedData(
      userModel,
      stackModel,
      mentorProfileModel,
      mentorAvailabilityModel,
      studentProfileModel,
    );
  }

  const passwordHash = await bcrypt.hash(SEED_PASSWORD, SALT_ROUNDS);

  console.log('Seeding stacks…');
  const stackByName = new Map<string, Types.ObjectId>();
  for (const stack of STACKS) {
    const doc = await stackModel
      .findOneAndUpdate({ name: stack.name }, stack, {
        upsert: true,
        returnDocument: 'after',
      })
      .exec();
    stackByName.set(stack.name, doc._id);
  }

  console.log('Seeding mentors…');
  for (const mentor of MENTORS) {
    let user = await userModel.findOne({ email: mentor.email }).exec();
    if (!user) {
      user = await userModel.create({
        email: mentor.email,
        passwordHash,
        role: UserRole.MENTOR,
      });
    }

    const stackId = stackByName.get(mentor.stackName);
    if (!stackId) {
      throw new Error(`Stack not found: ${mentor.stackName}`);
    }

    const profile = await mentorProfileModel
      .findOneAndUpdate(
        { user: user._id },
        {
          user: user._id,
          stack: stackId,
          name: mentor.name,
          title: mentor.title,
          bio: mentor.bio,
          isVerified: mentor.isVerified,
          averageRating: mentor.averageRating,
          hourlyRate: mentor.hourlyRate,
        },
        { upsert: true, returnDocument: 'after' },
      )
      .exec();

    await mentorAvailabilityModel.deleteMany({ mentor: profile._id }).exec();
    await mentorAvailabilityModel.insertMany(
      mentor.availability.map((window) => ({
        mentor: profile._id,
        ...window,
      })),
    );

    console.log(`  ✓ ${mentor.name} (${mentor.stackName})`);
  }

  console.log('Seeding dev student account…');
  let studentUser = await userModel.findOne({ email: DEV_STUDENT.email }).exec();
  if (!studentUser) {
    studentUser = await userModel.create({
      email: DEV_STUDENT.email,
      passwordHash,
      role: UserRole.STUDENT,
    });
  }

  await studentProfileModel
    .findOneAndUpdate(
      { user: studentUser._id },
      { user: studentUser._id, name: DEV_STUDENT.name },
      { upsert: true, returnDocument: 'after' },
    )
    .exec();

  console.log('\nSeed complete.');
  console.log(`  Password for all seed accounts: ${SEED_PASSWORD}`);
  console.log('  Mentor logins:');
  for (const mentor of MENTORS) {
    console.log(`    - ${mentor.email}`);
  }
  console.log(`  Student login: ${DEV_STUDENT.email}`);
}

seed()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
