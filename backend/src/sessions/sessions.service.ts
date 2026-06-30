import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  ReviewSession,
  ReviewSessionDocument,
} from './schemas/review-session.schema';
import {
  SessionAuditLog,
  SessionAuditLogDocument,
} from './schemas/session-audit-log.schema';
import {
  MentorProfile,
  MentorProfileDocument,
} from '../mentors/schemas/mentor-profile.schema';

import { CreateSessionDto } from './dto/create-session.dto';
import { RescheduleSessionDto } from './dto/reschedule-session.dto';
import { EvaluateSessionDto } from './dto/evaluate-session.dto';
import { ReviewSessionStatus } from '../common/enums/review-session-status.enum';
import { AuditLogStatus } from '../common/enums/audit-log-status.enum';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(ReviewSession.name)
    private readonly reviewSessionModel: Model<ReviewSessionDocument>,

    @InjectModel(SessionAuditLog.name)
    private readonly auditLogModel: Model<SessionAuditLogDocument>,

    @InjectModel(MentorProfile.name)
    private readonly mentorProfileModel: Model<MentorProfileDocument>,
  ) {}

  // ─── helpers ──────────────────────────────────────────────────────────────

  private assertValidObjectId(value: string, field: string): void {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(
        `${field} must be a valid MongoDB ObjectId`,
      );
    }
  }

  private simulateAIEvaluation(_description: string): {
    success: boolean;
    tag: string | undefined;
    confidence: number;
    latency: number;
  } {
    const tags = ['React.js', 'Node.js', 'Database', 'Algorithms', 'Security'];
    const success = Math.random() > 0.1;
    return {
      success,
      tag: success ? tags[Math.floor(Math.random() * tags.length)] : undefined,
      confidence: success
        ? parseFloat((Math.random() * (0.99 - 0.6) + 0.6).toFixed(2))
        : 0,
      latency: Math.floor(Math.random() * 500) + 50,
    };
  }

  /**
   * Check for ANY overlapping non-cancelled session for a mentor in the given
   * time range. Overlap condition: existingStart < newEnd AND existingEnd > newStart.
   *
   * Optionally excludes a specific session ID (used by reschedule).
   */
  private async assertNoMentorOverlap(
    mentorObjectId: Types.ObjectId,
    start: Date,
    end: Date,
    excludeSessionId?: string,
  ): Promise<void> {
    const query: Record<string, unknown> = {
      mentor: mentorObjectId,
      status: { $ne: ReviewSessionStatus.CANCELED },
      startTime: { $lt: end },
      endTime: { $gt: start },
    };

    if (excludeSessionId) {
      query._id = { $ne: new Types.ObjectId(excludeSessionId) };
    }

    const overlap = await this.reviewSessionModel.findOne(query).lean().exec();

    if (overlap) {
      throw new ConflictException(
        'This time slot overlaps with an existing booking. Please choose a different time.',
      );
    }
  }

  /**
   * Check for ANY overlapping non-cancelled session for a STUDENT in the
   * given time range. Prevents a student from double-booking themselves.
   *
   * Optionally excludes a specific session ID (used by reschedule).
   */
  private async assertNoStudentOverlap(
    studentObjectId: Types.ObjectId,
    start: Date,
    end: Date,
    excludeSessionId?: string,
  ): Promise<void> {
    const query: Record<string, unknown> = {
      student: studentObjectId,
      status: { $ne: ReviewSessionStatus.CANCELED },
      startTime: { $lt: end },
      endTime: { $gt: start },
    };

    if (excludeSessionId) {
      query._id = { $ne: new Types.ObjectId(excludeSessionId) };
    }

    const overlap = await this.reviewSessionModel.findOne(query).lean().exec();

    if (overlap) {
      throw new ConflictException(
        'You already have a session booked during this time. Please choose a different slot.',
      );
    }
  }

  private validateTimeRange(start: Date, end: Date, fieldPrefix = ''): void {
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException(
        `${fieldPrefix}startTime and endTime must be valid ISO dates`,
      );
    }

    if (start >= end) {
      throw new BadRequestException(
        `${fieldPrefix}startTime must be before endTime`,
      );
    }

    if (start <= new Date()) {
      throw new BadRequestException(
        `${fieldPrefix}startTime must be in the future`,
      );
    }
  }

  // ─── public: mentor booked slots for a given date ─────────────────────────

  async getMentorBookedSlots(
    mentorId: string,
    dateStr: string,
  ): Promise<{ startTime: string; endTime: string }[]> {
    this.assertValidObjectId(mentorId, 'mentorId');

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('date must be a valid ISO date string');
    }

    const dayStart = new Date(date);
    dayStart.setUTCHours(0, 0, 0, 0);

    const dayEnd = new Date(date);
    dayEnd.setUTCHours(23, 59, 59, 999);

    const sessions = await this.reviewSessionModel
      .find({
        mentor: new Types.ObjectId(mentorId),
        status: { $ne: ReviewSessionStatus.CANCELED },
        startTime: { $gte: dayStart, $lte: dayEnd },
      })
      .select('startTime endTime')
      .lean()
      .exec();

    return sessions.map((s) => ({
      startTime: (s.startTime as Date).toISOString(),
      endTime: (s.endTime as Date).toISOString(),
    }));
  }

  // ─── book ─────────────────────────────────────────────────────────────────

  async bookSession(
    dto: CreateSessionDto,
    studentUserId: string,
  ): Promise<ReviewSessionDocument> {
    this.assertValidObjectId(studentUserId, 'student (from JWT)');
    this.assertValidObjectId(dto.mentor, 'mentor');

    const mentorObjectId = new Types.ObjectId(dto.mentor);
    const studentObjectId = new Types.ObjectId(studentUserId);

    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);

    this.validateTimeRange(start, end);

    // Verify mentor exists
    const mentorExists = await this.mentorProfileModel
      .exists({ _id: mentorObjectId })
      .exec();

    if (!mentorExists) {
      throw new NotFoundException('Mentor not found');
    }

    // Check for overlapping bookings — both mentor AND student
    await this.assertNoMentorOverlap(mentorObjectId, start, end);
    await this.assertNoStudentOverlap(studentObjectId, start, end);

    const session = await this.reviewSessionModel.create({
      mentor: mentorObjectId,
      student: studentObjectId,
      startTime: start,
      endTime: end,
      description: dto.description ?? '',
      status: ReviewSessionStatus.SCHEDULED,
    });

    // Fire-and-forget audit log
    this.writeAuditLog(session._id as Types.ObjectId, dto.description).catch(
      (err) => {
        console.error('Audit log write failed (non-critical):', err?.message);
      },
    );

    return session;
  }

  private async writeAuditLog(
    sessionId: Types.ObjectId,
    description?: string,
  ): Promise<void> {
    const evaluation = this.simulateAIEvaluation(description ?? '');

    const auditDoc: {
      session: Types.ObjectId;
      predictedTag?: string;
      confidenceScore: number;
      status: AuditLogStatus;
      latencyMs: number;
    } = {
      session: sessionId,
      confidenceScore: evaluation.confidence,
      status: evaluation.success
        ? AuditLogStatus.SUCCESS
        : AuditLogStatus.FAILED,
      latencyMs: evaluation.latency,
    };

    if (evaluation.tag !== undefined) {
      auditDoc.predictedTag = evaluation.tag;
    }

    await this.auditLogModel.create(auditDoc);
  }

  // ─── student views ────────────────────────────────────────────────────────

  async findStudentUpcoming(
    studentUserId: string,
  ): Promise<ReviewSessionDocument[]> {
    this.assertValidObjectId(studentUserId, 'student');

    return this.reviewSessionModel
      .find({
        student: new Types.ObjectId(studentUserId),
        startTime: { $gte: new Date() },
        status: ReviewSessionStatus.SCHEDULED,
      })
      .populate({ path: 'mentor', select: 'name title hourlyRate' })
      .sort({ startTime: 1 })
      .exec();
  }

  async findStudentHistory(
    studentUserId: string,
  ): Promise<ReviewSessionDocument[]> {
    this.assertValidObjectId(studentUserId, 'student');

    return this.reviewSessionModel
      .find({
        student: new Types.ObjectId(studentUserId),
        $or: [
          {
            status: {
              $in: [
                ReviewSessionStatus.COMPLETED,
                ReviewSessionStatus.CANCELED,
              ],
            },
          },
          { startTime: { $lt: new Date() } },
        ],
      })
      .populate({ path: 'mentor', select: 'name title hourlyRate' })
      .sort({ startTime: -1 })
      .exec();
  }

  // ─── cancel ───────────────────────────────────────────────────────────────

  async cancelSession(
    sessionId: string,
    studentUserId: string,
  ): Promise<ReviewSessionDocument> {
    this.assertValidObjectId(sessionId, 'sessionId');
    this.assertValidObjectId(studentUserId, 'student');

    const session = await this.reviewSessionModel.findById(sessionId).exec();

    if (!session) {
      throw new NotFoundException('Review session not found.');
    }

    if (session.student.toString() !== studentUserId) {
      throw new ConflictException(
        'You are not authorized to cancel this session.',
      );
    }

    if (session.status !== ReviewSessionStatus.SCHEDULED) {
      throw new ConflictException(
        `Cannot cancel a session that is already ${session.status}.`,
      );
    }

    session.status = ReviewSessionStatus.CANCELED;
    return session.save();
  }

  // ─── reschedule ───────────────────────────────────────────────────────────

  async rescheduleSession(
    sessionId: string,
    dto: RescheduleSessionDto,
    studentUserId: string,
  ): Promise<ReviewSessionDocument> {
    this.assertValidObjectId(sessionId, 'sessionId');
    this.assertValidObjectId(studentUserId, 'student');

    const session = await this.reviewSessionModel.findById(sessionId).exec();

    if (!session) {
      throw new NotFoundException('Session not found.');
    }

    if (session.student.toString() !== studentUserId) {
      throw new ConflictException(
        'You are not authorized to reschedule this session.',
      );
    }

    if (session.status !== ReviewSessionStatus.SCHEDULED) {
      throw new ConflictException(
        `Cannot reschedule a ${session.status} session.`,
      );
    }

    const newStart = new Date(dto.startTime);
    const newEnd = new Date(dto.endTime);

    this.validateTimeRange(newStart, newEnd, 'New ');

    // Check both mentor and student overlaps, excluding current session
    await this.assertNoMentorOverlap(
      session.mentor,
      newStart,
      newEnd,
      sessionId,
    );
    await this.assertNoStudentOverlap(
      session.student,
      newStart,
      newEnd,
      sessionId,
    );

    session.startTime = newStart;
    session.endTime = newEnd;
    return session.save();
  }

  // ─── evaluate ─────────────────────────────────────────────────────────────

  async evaluateSession(
    sessionId: string,
    dto: EvaluateSessionDto,
    studentUserId: string,
  ): Promise<ReviewSessionDocument> {
    this.assertValidObjectId(sessionId, 'sessionId');
    this.assertValidObjectId(studentUserId, 'student');

    const session = await this.reviewSessionModel.findById(sessionId).exec();

    if (!session) {
      throw new NotFoundException('Session not found.');
    }

    if (session.student.toString() !== studentUserId) {
      throw new ConflictException(
        'You are not authorized to evaluate this session.',
      );
    }

    if (session.status === ReviewSessionStatus.CANCELED) {
      throw new ConflictException('Cannot evaluate a canceled session.');
    }

    session.status = ReviewSessionStatus.COMPLETED;
    session.evaluationNotes = dto.evaluationNotes || '';
    session.rating = dto.rating;
    session.evaluatedAt = new Date();
    await session.save();

    // Update Mentor Profile stats
    const mentorProfile = await this.mentorProfileModel.findById(session.mentor);
    if (mentorProfile) {
      const oldTotal = mentorProfile.totalReviews || 0;
      const oldAvg = mentorProfile.averageRating || 0;
      
      const newTotal = oldTotal + 1;
      const newAvg = ((oldAvg * oldTotal) + dto.rating) / newTotal;
      
      // Round to 1 decimal place
      mentorProfile.averageRating = Math.round(newAvg * 10) / 10;
      mentorProfile.totalReviews = newTotal;
      await mentorProfile.save();
    }

    return session;
  }

  // ─── update status (internal / admin use) ─────────────────────────────────

  async updateStatus(
    id: string,
    status: ReviewSessionStatus,
  ): Promise<ReviewSessionDocument> {
    this.assertValidObjectId(id, 'sessionId');

    const session = await this.reviewSessionModel
      .findByIdAndUpdate(id, { status }, { new: true, runValidators: true })
      .exec();

    if (!session) {
      throw new NotFoundException(`Review session ${id} not found`);
    }

    return session;
  }
}
