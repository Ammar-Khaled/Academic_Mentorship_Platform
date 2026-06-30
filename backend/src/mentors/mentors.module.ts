import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  MentorAvailability,
  MentorAvailabilitySchema,
} from './schemas/mentor-availability.schema';
import {
  MentorProfile,
  MentorProfileSchema,
} from './schemas/mentor-profile.schema';
import {
  ReviewSession,
  ReviewSessionSchema,
} from '../sessions/schemas/review-session.schema';
import {
  SessionAuditLog,
  SessionAuditLogSchema,
} from '../sessions/schemas/session-audit-log.schema';

import { MentorsController } from './mentors.controller';
import { MentorsService } from './mentors.service';
import { MentorDashboardController } from './mentor-dashboard.controller';
import { MentorDashboardService } from './mentor-dashboard.service';
import { StudentsModule } from '../students/students.module';

@Module({
  imports: [
    StudentsModule,
    MongooseModule.forFeature([
      { name: MentorProfile.name, schema: MentorProfileSchema },
      { name: MentorAvailability.name, schema: MentorAvailabilitySchema },
      { name: ReviewSession.name, schema: ReviewSessionSchema },
      { name: SessionAuditLog.name, schema: SessionAuditLogSchema },
    ]),
  ],
  controllers: [MentorDashboardController, MentorsController],
  providers: [MentorDashboardService, MentorsService],
  exports: [MentorDashboardService, MentorsService, MongooseModule],
})
export class MentorsModule {}
