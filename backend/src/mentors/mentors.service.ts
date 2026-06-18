import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  MentorProfile,
  MentorProfileDocument,
} from './schemas/mentor-profile.schema';

import {
  MentorAvailability,
  MentorAvailabilityDocument,
} from './schemas/mentor-availability.schema';

import { FindMentorsDto } from './dto/find-mentors.dto';

@Injectable()
export class MentorsService {
  constructor(
    @InjectModel(MentorProfile.name)
    private readonly mentorProfileModel: Model<MentorProfileDocument>,

    @InjectModel(MentorAvailability.name)
    private readonly mentorAvailabilityModel: Model<MentorAvailabilityDocument>,
  ) {}

  private generateSlots(
    startTime: string,
    endTime: string,
    duration = 45,
    ): string[] {
    const slots: string[] = [];

    const [startHour, startMinute] = startTime
        .split(':')
        .map(Number);

    const [endHour, endMinute] = endTime
        .split(':')
        .map(Number);

    let current =
        startHour * 60 + startMinute;

    const end =
        endHour * 60 + endMinute;

    while (current + duration <= end) {
        const hours = Math.floor(current / 60)
        .toString()
        .padStart(2, '0');

        const minutes = (current % 60)
        .toString()
        .padStart(2, '0');

        slots.push(`${hours}:${minutes}`);

        current += duration;
    }

    return slots;
    }

  async findAll(filter: FindMentorsDto) {
    const {
      page = 1,
      limit = 10,
      keyword,
      stack,
      sortBy,
    } = filter;

    const query: any = {
      isVerified: true,
    };

    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { title: { $regex: keyword, $options: 'i' } },
        { bio: { $regex: keyword, $options: 'i' } },
      ];
    }

    if (stack) {
      if (!Types.ObjectId.isValid(stack)) {
        throw new BadRequestException('Invalid stack id');
      }

      query.stack = new Types.ObjectId(stack);
    }

    let sort: any = {};

    switch (sortBy) {
      case 'rating':
        sort = { averageRating: -1 };
        break;

      case 'price':
        sort = { hourlyRate: 1 };
        break;

      default:
        sort = { averageRating: -1 };
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.mentorProfileModel
        .find(query)
        .populate('stack', 'name description')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),

      this.mentorProfileModel.countDocuments(query),
    ]);

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid mentor id');
    }

    const mentor = await this.mentorProfileModel
      .findById(id)
      .populate('stack', 'name description')
      .populate('user', 'email')
      .exec();

    if (!mentor) {
      throw new NotFoundException('Mentor not found');
    }

    return mentor;
  }

  async getAvailability(id: string) {
    if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(
        'Invalid mentor id',
        );
    }

    const availabilities =
        await this.mentorAvailabilityModel
        .find({
            mentor: new Types.ObjectId(id),
        })
        .sort({
            dayOfWeek: 1,
            startTime: 1,
        })
        .exec();

    return availabilities.map((item) => ({
        dayOfWeek: item.dayOfWeek,
        slots: this.generateSlots(
        item.startTime,
        item.endTime,
        ),
    }));
    }
}