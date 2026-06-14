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
import { MentorsController } from './mentors.controller';
import { MentorsService } from './mentors.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MentorProfile.name, schema: MentorProfileSchema },
      { name: MentorAvailability.name, schema: MentorAvailabilitySchema },
    ]),
  ],
  controllers: [MentorsController],
  providers: [MentorsService],
  exports: [MentorsService, MongooseModule],
})
export class MentorsModule {}
