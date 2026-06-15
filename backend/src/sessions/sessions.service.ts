import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { CreateSessionDto } from './dto/create-session.dto';
import { ReviewSession, ReviewSessionDocument } from './schemas/review-session.schema';
import { SessionAuditLog, SessionAuditLogDocument } from './schemas/session-audit-log.schema';
import { ReviewSessionStatus } from '../../common/enums/review-session-status.enum';
import { AuditLogStatus } from '../../common/enums/audit-log-status.enum';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(ReviewSession.name)
    private readonly reviewSessionModel: Model<ReviewSessionDocument>,
    @InjectModel(SessionAuditLog.name)
    private readonly auditLogModel: Model<SessionAuditLogDocument>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async bookSession(createSessionDto: CreateSessionDto, studentUserId: string) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const start = new Date(createSessionDto.startTime);
      const end = new Date(createSessionDto.endTime);

      // 1. Concurrency Overlap Check
      const overlappingSession = await this.reviewSessionModel.findOne({
        mentor: createSessionDto.mentor,
        status: { $ne: ReviewSessionStatus.CANCELED },
        $or: [
          {
            startTime: { $lt: end },
            endTime: { $gt: start },
          },
        ],
      }).session(session);

      if (overlappingSession) {
        throw new ConflictException('The mentor is already booked for this time slot.');
      }

      // 2. Create the Review Session
      const newReviewSession = new this.reviewSessionModel({
        ...createSessionDto,
        student: studentUserId, // Assume this is resolved to Profile ID if needed
        status: ReviewSessionStatus.SCHEDULED,
      });
      const savedSession = await newReviewSession.save({ session });

      // 3. Simulate External Code Evaluation Helper
      const evaluationResult = this.simulateAIEvaluation(createSessionDto.description);

      // 4. Create the Session Audit Log
      const auditLog = new this.auditLogModel({
        session: savedSession._id,
        predictedTag: evaluationResult.tag,
        confidenceScore: evaluationResult.confidence,
        status: evaluationResult.success ? AuditLogStatus.SUCCESS : AuditLogStatus.FAILED,
        latencyMs: evaluationResult.latency,
      });
      await auditLog.save({ session });

      // 5. Commit Transaction
      await session.commitTransaction();
      return savedSession;

    } catch (error) {
      await session.abortTransaction();
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException('Booking failed. Transaction rolled back.');
    } finally {
      session.endSession();
    }
  }

  async findStudentUpcoming(studentId: string) {
    const now = new Date();
    return this.reviewSessionModel
      .find({
        student: studentId,
        startTime: { $gte: now },
        status: ReviewSessionStatus.SCHEDULED,
      })
      .populate('mentor', 'name title')
      .sort({ startTime: 1 })
      .exec();
  }

  async findStudentHistory(studentId: string) {
    const now = new Date();
    return this.reviewSessionModel
      .find({
        student: studentId,
        $or: [
          { status: { $in: [ReviewSessionStatus.COMPLETED, ReviewSessionStatus.CANCELED] } },
          { startTime: { $lt: now } }
        ]
      })
      .populate('mentor', 'name title')
      .sort({ startTime: -1 })
      .exec();
  }

  async updateStatus(id: string, status: ReviewSessionStatus) {
    const session = await this.reviewSessionModel.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).exec();

    if (!session) {
      throw new NotFoundException(`Review session ${id} not found`);
    }
    return session;
  }

  // --- Helper Methods ---

  private simulateAIEvaluation(description: string) {
    // Simulating external API latency and prediction
    const isSuccess = Math.random() > 0.1; // 90% success rate
    const tags = ['React.js', 'Node.js', 'Database', 'Algorithms', 'Security'];
    
    return {
      success: isSuccess,
      tag: isSuccess ? tags[Math.floor(Math.random() * tags.length)] : null,
      confidence: isSuccess ? parseFloat((Math.random() * (0.99 - 0.60) + 0.60).toFixed(2)) : 0,
      latency: Math.floor(Math.random() * 500) + 50,
    };
  }
}