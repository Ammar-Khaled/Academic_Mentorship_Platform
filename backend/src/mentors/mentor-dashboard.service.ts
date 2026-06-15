import {
  BadRequestException,
  ForbiddenException,
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
import {
  ReviewSession,
  ReviewSessionDocument,
} from '../sessions/schemas/review-session.schema';

import { UpdateMentorProfileDto } from './dto/update-mentor-profile.dto';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { UpdateEvaluationDto } from '../sessions/dto/update-evaluation.dto';
import { ReviewSessionStatus } from '../common/enums/review-session-status.enum';

function isMongoDuplicateKeyError(err: unknown): err is { code: number } {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code: number }).code === 11000
  );
}

export interface SessionsFilter {
  status?: ReviewSessionStatus;
  page?: number;
  limit?: number;
}

export interface PaginatedSessions {
  data: ReviewSessionDocument[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class MentorDashboardService {
  constructor(
    @InjectModel(MentorProfile.name)
    private readonly mentorProfileModel: Model<MentorProfileDocument>,

    @InjectModel(MentorAvailability.name)
    private readonly mentorAvailabilityModel: Model<MentorAvailabilityDocument>,

    @InjectModel(ReviewSession.name)
    private readonly reviewSessionModel: Model<ReviewSessionDocument>,
  ) {}

  private assertValidObjectId(value: string, fieldName: string) {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(
        `${fieldName} must be a valid MongoDB ObjectId`,
      );
    }
  }

  // ─────────────────────────────────────────────
  // Profile
  // ─────────────────────────────────────────────

  async getOwnProfile(userId: string): Promise<MentorProfileDocument> {
    const profile = await this.mentorProfileModel
      .findOne({ user: new Types.ObjectId(userId) })
      .populate('user', 'email role')
      .populate('stack', 'name description')
      .exec();

    if (!profile) {
      throw new NotFoundException('Mentor profile not found for this user');
    }

    return profile;
  }

  async updateOwnProfile(
    userId: string,
    updateDto: UpdateMentorProfileDto,
  ): Promise<MentorProfileDocument> {
    // Defense-in-depth: only allow these fields to be updated even if whitelist is not enabled globally.
    const update: Record<string, unknown> = {};

    if (updateDto.stack !== undefined) {
      this.assertValidObjectId(updateDto.stack, 'stack');
      update.stack = new Types.ObjectId(updateDto.stack);
    }
    if (updateDto.name !== undefined) update.name = updateDto.name;
    if (updateDto.title !== undefined) update.title = updateDto.title;
    if (updateDto.bio !== undefined) update.bio = updateDto.bio;
    if (updateDto.hourlyRate !== undefined)
      update.hourlyRate = updateDto.hourlyRate;

    const profile = await this.mentorProfileModel
      .findOneAndUpdate(
        { user: new Types.ObjectId(userId) },
        { $set: update },
        { returnDocument: 'after', runValidators: true },
      )
      .populate('user', 'email role')
      .populate('stack', 'name description')
      .exec();

    if (!profile) {
      throw new NotFoundException('Mentor profile not found for this user');
    }

    return profile;
  }

  // ─────────────────────────────────────────────
  // Availability
  // ─────────────────────────────────────────────

  private async resolveMentorProfileId(
    userId: string,
  ): Promise<Types.ObjectId> {
    const profile = await this.mentorProfileModel
      .findOne({ user: new Types.ObjectId(userId) })
      .select('_id')
      .lean<{ _id: Types.ObjectId }>()
      .exec();

    if (!profile) {
      throw new NotFoundException('Mentor profile not found for this user');
    }

    return profile._id;
  }

  private async assertNoAvailabilityOverlap(params: {
    mentorId: Types.ObjectId;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    excludeAvailabilityId?: string;
  }): Promise<void> {
    const { mentorId, dayOfWeek, startTime, endTime, excludeAvailabilityId } =
      params;

    const query: Record<string, unknown> = {
      mentor: mentorId,
      dayOfWeek,
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    };

    if (excludeAvailabilityId) {
      this.assertValidObjectId(excludeAvailabilityId, 'availabilityId');
      query._id = { $ne: new Types.ObjectId(excludeAvailabilityId) };
    }

    const conflict = await this.mentorAvailabilityModel
      .findOne(query)
      .select('_id')
      .lean()
      .exec();

    if (conflict) {
      throw new BadRequestException(
        'Availability slot overlaps with an existing slot',
      );
    }
  }

  async createAvailability(
    userId: string,
    dto: CreateAvailabilityDto,
  ): Promise<MentorAvailabilityDocument> {
    const mentorId = await this.resolveMentorProfileId(userId);

    if (dto.startTime >= dto.endTime) {
      throw new BadRequestException('startTime must be earlier than endTime');
    }

    await this.assertNoAvailabilityOverlap({
      mentorId,
      dayOfWeek: dto.dayOfWeek,
      startTime: dto.startTime,
      endTime: dto.endTime,
    });

    try {
      return await this.mentorAvailabilityModel.create({
        mentor: mentorId,
        dayOfWeek: dto.dayOfWeek,
        startTime: dto.startTime,
        endTime: dto.endTime,
      });
    } catch (err: unknown) {
      if (isMongoDuplicateKeyError(err)) {
        throw new BadRequestException(
          'An availability slot with the same day and time already exists',
        );
      }
      throw err;
    }
  }

  async getAvailability(userId: string): Promise<MentorAvailabilityDocument[]> {
    const mentorId = await this.resolveMentorProfileId(userId);

    return this.mentorAvailabilityModel
      .find({ mentor: mentorId })
      .sort({ dayOfWeek: 1, startTime: 1 })
      .exec();
  }

  async updateAvailability(
    userId: string,
    availabilityId: string,
    dto: UpdateAvailabilityDto,
  ): Promise<MentorAvailabilityDocument> {
    this.assertValidObjectId(availabilityId, 'availabilityId');
    const mentorId = await this.resolveMentorProfileId(userId);

    const slot = await this.mentorAvailabilityModel
      .findById(availabilityId)
      .exec();

    if (!slot) {
      throw new NotFoundException(
        `Availability slot ${availabilityId} not found`,
      );
    }

    if (slot.mentor.toString() !== mentorId.toString()) {
      throw new ForbiddenException(
        'You are not allowed to edit this availability slot',
      );
    }

    const newDay = dto.dayOfWeek ?? slot.dayOfWeek;
    const newStart = dto.startTime ?? slot.startTime;
    const newEnd = dto.endTime ?? slot.endTime;

    if (newStart >= newEnd) {
      throw new BadRequestException('startTime must be earlier than endTime');
    }

    await this.assertNoAvailabilityOverlap({
      mentorId,
      dayOfWeek: newDay,
      startTime: newStart,
      endTime: newEnd,
      excludeAvailabilityId: availabilityId,
    });

    Object.assign(slot, dto);

    try {
      return await slot.save();
    } catch (err: unknown) {
      if (isMongoDuplicateKeyError(err)) {
        throw new BadRequestException(
          'An availability slot with the same day and time already exists',
        );
      }
      throw err;
    }
  }

  async deleteAvailability(
    userId: string,
    availabilityId: string,
  ): Promise<{ message: string }> {
    this.assertValidObjectId(availabilityId, 'availabilityId');
    const mentorId = await this.resolveMentorProfileId(userId);

    const slot = await this.mentorAvailabilityModel
      .findById(availabilityId)
      .exec();

    if (!slot) {
      throw new NotFoundException(
        `Availability slot ${availabilityId} not found`,
      );
    }

    if (slot.mentor.toString() !== mentorId.toString()) {
      throw new ForbiddenException(
        'You are not allowed to delete this availability slot',
      );
    }

    await slot.deleteOne();
    return { message: 'Availability slot deleted successfully' };
  }

  // ─────────────────────────────────────────────
  // Sessions
  // ─────────────────────────────────────────────

  async getMentorSessions(
    userId: string,
    filter: SessionsFilter = {},
  ): Promise<PaginatedSessions> {
    const mentorId = await this.resolveMentorProfileId(userId);

    const { status, page = 1, limit = 10 } = filter;

    if (page < 1) {
      throw new BadRequestException('page must be >= 1');
    }
    if (limit < 1 || limit > 100) {
      throw new BadRequestException('limit must be between 1 and 100');
    }

    const query: Record<string, unknown> = { mentor: mentorId };

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.reviewSessionModel
        .find(query)
        .populate('student', 'name')
        .sort({ startTime: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.reviewSessionModel.countDocuments(query).exec(),
    ]);

    return { data, total, page, limit };
  }

  // ─────────────────────────────────────────────
  // Evaluation Notes
  // ─────────────────────────────────────────────

  async evaluateSession(
    userId: string,
    sessionId: string,
    dto: UpdateEvaluationDto,
  ): Promise<ReviewSessionDocument> {
    this.assertValidObjectId(sessionId, 'sessionId');
    const mentorId = await this.resolveMentorProfileId(userId);

    const session = await this.reviewSessionModel.findById(sessionId).exec();

    if (!session) {
      throw new NotFoundException(`Review session ${sessionId} not found`);
    }

    if (session.mentor.toString() !== mentorId.toString()) {
      throw new ForbiddenException(
        'You are not allowed to evaluate this session',
      );
    }

    if (session.status !== ReviewSessionStatus.COMPLETED) {
      throw new BadRequestException(
        'Evaluation notes can only be added when the session status is Completed',
      );
    }

    session.evaluationNotes = dto.evaluationNotes;
    session.evaluatedAt = new Date();

    return session.save();
  }
}
