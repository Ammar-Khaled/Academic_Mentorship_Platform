import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  SessionAuditLog,
  SessionAuditLogDocument,
} from '../../sessions/schemas/session-audit-log.schema';
import { ReviewSession, ReviewSessionDocument } from '../../sessions/schemas/review-session.schema';
import { AuditLogStatus } from '../../common/enums/audit-log-status.enum';

export interface AuditAnalysisResult {
  predictedTag: string;
  confidenceScore: number;
  status: AuditLogStatus;
  latencyMs: number;
  errorMessage?: string;
}

@Injectable()
export class AiAuditService {
  private readonly logger = new Logger(AiAuditService.name);

  constructor(
    @InjectModel(SessionAuditLog.name)
    private readonly auditLogModel: Model<SessionAuditLogDocument>,
    @InjectModel(ReviewSession.name)
    private readonly reviewSessionModel: Model<ReviewSessionDocument>,
  ) {}

  /**
   * Analyze a review session and generate AI predictions
   * In production, this would call an actual AI service (OpenAI, etc.)
   */
  async analyzeSession(
    sessionId: string,
  ): Promise<AuditAnalysisResult> {
    const startTime = Date.now();

    try {
      // Fetch the session
      const session = await this.reviewSessionModel
        .findById(new Types.ObjectId(sessionId))
        .populate('mentor', 'name')
        .populate('student', 'name')
        .lean()
        .exec();

      if (!session) {
        return this.createErrorResult(
          'Session not found',
          Date.now() - startTime,
        );
      }

      // Simulate AI analysis
      // In production: Call actual AI service with session content/transcript
      const analysisResult = await this.performAiAnalysis(session);

      // Store the audit log
      await this.auditLogModel.findOneAndUpdate(
        { session: new Types.ObjectId(sessionId) },
        {
          session: new Types.ObjectId(sessionId),
          predictedTag: analysisResult.predictedTag,
          confidenceScore: analysisResult.confidenceScore,
          status: analysisResult.status,
          latencyMs: analysisResult.latencyMs,
          errorMessage: undefined,
        },
        { upsert: true, new: true },
      );

      this.logger.log(
        `Session ${sessionId} analyzed successfully. Tag: ${analysisResult.predictedTag}`,
      );

      return analysisResult;
    } catch (error) {
      this.logger.error(`Failed to analyze session ${sessionId}:`, error);
      return this.createErrorResult(
        error.message || 'Unknown error during analysis',
        Date.now() - startTime,
      );
    }
  }

  /**
   * Perform AI analysis on session data
   * Simulates AI predictions. Replace with real AI service call in production.
   */
  private async performAiAnalysis(
    session: any,
  ): Promise<AuditAnalysisResult> {
    // Simulate API latency (50-200ms)
    const latency = Math.random() * 150 + 50;
    await new Promise((resolve) => setTimeout(resolve, latency));

    // Simulate AI predictions based on session characteristics
    const tags = ['excellent', 'good', 'adequate', 'needs-improvement'];
    const randomTag = tags[Math.floor(Math.random() * tags.length)];

    // Confidence based on tag quality
    const confidenceMap = {
      excellent: 0.95,
      good: 0.85,
      adequate: 0.75,
      'needs-improvement': 0.65,
    };

    return {
      predictedTag: randomTag,
      confidenceScore: confidenceMap[randomTag],
      status: AuditLogStatus.SUCCESS,
      latencyMs: Math.round(latency),
    };
  }

  /**
   * Batch analyze multiple sessions
   */
  async analyzeSessions(sessionIds: string[]): Promise<AuditAnalysisResult[]> {
    const results = await Promise.all(
      sessionIds.map((id) => this.analyzeSession(id)),
    );
    return results;
  }

  /**
   * Get audit logs for a specific session
   */
  async getSessionAuditLog(sessionId: string) {
    return this.auditLogModel
      .findOne({ session: new Types.ObjectId(sessionId) })
      .lean()
      .exec();
  }

  /**
   * Get recent audit logs
   */
  async getRecentAuditLogs(limit: number = 50) {
    return this.auditLogModel
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('session', 'mentor student startTime')
      .lean()
      .exec();
  }

  /**
   * Get audit logs by status
   */
  async getAuditLogsByStatus(status: AuditLogStatus, limit: number = 50) {
    return this.auditLogModel
      .find({ status })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('session', 'mentor student startTime')
      .lean()
      .exec();
  }

  /**
   * Get audit statistics
   */
  async getAuditStatistics() {
    const totalAnalyzed = await this.auditLogModel.countDocuments();
    const successCount = await this.auditLogModel.countDocuments({
      status: AuditLogStatus.SUCCESS,
    });
    const failureCount = await this.auditLogModel.countDocuments({
      status: AuditLogStatus.FAILED,
    });
    const pendingCount = await this.auditLogModel.countDocuments({
      status: AuditLogStatus.PENDING,
    });

    // Calculate average confidence score
    const avgConfidence = await this.auditLogModel.aggregate([
      {
        $match: { status: AuditLogStatus.SUCCESS },
      },
      {
        $group: {
          _id: null,
          avgScore: { $avg: '$confidenceScore' },
        },
      },
    ]);

    // Calculate average latency
    const avgLatency = await this.auditLogModel.aggregate([
      {
        $match: { status: AuditLogStatus.SUCCESS },
      },
      {
        $group: {
          _id: null,
          avgMs: { $avg: '$latencyMs' },
        },
      },
    ]);

    // Tag distribution
    const tagDistribution = await this.auditLogModel.aggregate([
      {
        $match: { status: AuditLogStatus.SUCCESS },
      },
      {
        $group: {
          _id: '$predictedTag',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    return {
      totalAnalyzed,
      successCount,
      failureCount,
      pendingCount,
      successRate: (successCount / totalAnalyzed) * 100 || 0,
      averageConfidenceScore: avgConfidence[0]?.avgScore || 0,
      averageLatencyMs: avgLatency[0]?.avgMs || 0,
      tagDistribution: Object.fromEntries(
        tagDistribution.map((item) => [item._id, item.count]),
      ),
    };
  }

  /**
   * Create an error result object
   */
  private createErrorResult(
    errorMessage: string,
    latencyMs: number,
  ): AuditAnalysisResult {
    return {
      predictedTag: 'unknown',
      confidenceScore: 0,
      status: AuditLogStatus.FAILED,
      latencyMs,
      errorMessage,
    };
  }
}
