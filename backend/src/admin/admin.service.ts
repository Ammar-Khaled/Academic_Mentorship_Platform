import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import {
  UserApproval,
  UserApprovalDocument,
  UserApprovalStatus,
} from './schemas/user-approval.schema';
import { ApproveUserDto } from './dto/approve-user.dto';
import { BlockUserDto } from './dto/block-user.dto';
import { UserRole } from '../common/enums/user-role.enum';
import {
  MentorProfile,
  MentorProfileDocument,
} from '../mentors/schemas/mentor-profile.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(UserApproval.name)
    private readonly userApprovalModel: Model<UserApprovalDocument>,
    @InjectModel(MentorProfile.name)
    private readonly mentorProfileModel: Model<MentorProfileDocument>,
  ) {}

  async getPendingUsers() {
    return this.userApprovalModel
      .find({ status: UserApprovalStatus.PENDING })
      .populate('user', 'email role createdAt')
      .lean()
      .exec();
  }

  async getAllUsers(status?: UserApprovalStatus) {
    const query = status ? { status } : {};
    return this.userApprovalModel
      .find(query)
      .populate('user', 'email role createdAt')
      .populate('approvedBy', 'email')
      .populate('blockedBy', 'email')
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  async getUserApprovalStatus(userId: string) {
    const objectId = new Types.ObjectId(userId);
    const approval = await this.userApprovalModel
      .findOne({ user: objectId })
      .populate('user', 'email role createdAt')
      .lean()
      .exec();

    if (!approval) {
      throw new NotFoundException('User approval record not found');
    }

    return approval;
  }

  async approveUser(userId: string, adminId: string, dto: ApproveUserDto) {
    const userObjectId = new Types.ObjectId(userId);
    const adminObjectId = new Types.ObjectId(adminId);

    // Check if user exists
    const user = await this.userModel.findById(userObjectId).lean().exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Find or create approval record
    let approval = await this.userApprovalModel
      .findOne({ user: userObjectId })
      .exec();

    if (!approval) {
      approval = new this.userApprovalModel({
        user: userObjectId,
        status: UserApprovalStatus.APPROVED,
        approvedBy: adminObjectId,
        approvalNotes: dto.approvalNotes,
      });
    } else {
      if (approval.status === UserApprovalStatus.APPROVED) {
        throw new BadRequestException('User is already approved');
      }
      approval.status = UserApprovalStatus.APPROVED;
      approval.approvedBy = adminObjectId;
      approval.approvalNotes = dto.approvalNotes;
      approval.blockReason = undefined;
      approval.blockedBy = undefined;
    }

    await approval.save();

    if (user.role === UserRole.MENTOR) {
      await this.mentorProfileModel
        .updateOne({ user: userObjectId }, { $set: { isVerified: true } })
        .exec();
    }

    return approval.populate('user', 'email role createdAt');
  }

  async blockUser(userId: string, adminId: string, dto: BlockUserDto) {
    const userObjectId = new Types.ObjectId(userId);
    const adminObjectId = new Types.ObjectId(adminId);

    // Check if user exists
    const user = await this.userModel.findById(userObjectId).lean().exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Find or create approval record
    let approval = await this.userApprovalModel
      .findOne({ user: userObjectId })
      .exec();

    if (!approval) {
      approval = new this.userApprovalModel({
        user: userObjectId,
        status: UserApprovalStatus.BLOCKED,
        blockedBy: adminObjectId,
        blockReason: dto.blockReason,
      });
    } else {
      if (approval.status === UserApprovalStatus.BLOCKED) {
        throw new BadRequestException('User is already blocked');
      }
      approval.status = UserApprovalStatus.BLOCKED;
      approval.blockedBy = adminObjectId;
      approval.blockReason = dto.blockReason;
      approval.approvalNotes = undefined;
      approval.approvedBy = undefined;
    }

    await approval.save();

    if (user.role === UserRole.MENTOR) {
      await this.mentorProfileModel
        .updateOne({ user: userObjectId }, { $set: { isVerified: false } })
        .exec();
    }

    return approval.populate('user', 'email role createdAt');
  }

  async unblockUser(userId: string, adminId: string) {
    const userObjectId = new Types.ObjectId(userId);

    const approval = await this.userApprovalModel
      .findOne({ user: userObjectId })
      .exec();

    if (!approval) {
      throw new NotFoundException('User approval record not found');
    }

    if (approval.status !== UserApprovalStatus.BLOCKED) {
      throw new BadRequestException('User is not blocked');
    }

    approval.status = UserApprovalStatus.PENDING;
    approval.blockReason = undefined;
    approval.blockedBy = undefined;

    await approval.save();

    const user = await this.userModel.findById(userObjectId).lean().exec();
    if (user && user.role === UserRole.MENTOR) {
      await this.mentorProfileModel
        .updateOne({ user: userObjectId }, { $set: { isVerified: false } })
        .exec();
    }

    return approval.populate('user', 'email role createdAt');
  }

  async getAdminStatistics() {
    const totalUsers = await this.userModel.countDocuments();
    const pendingApprovals = await this.userApprovalModel.countDocuments({
      status: UserApprovalStatus.PENDING,
    });
    const approvedUsers = await this.userApprovalModel.countDocuments({
      status: UserApprovalStatus.APPROVED,
    });
    const blockedUsers = await this.userApprovalModel.countDocuments({
      status: UserApprovalStatus.BLOCKED,
    });

    return {
      totalUsers,
      pendingApprovals,
      approvedUsers,
      blockedUsers,
      systemHealth: {
        timestamp: new Date(),
        uptime: process.uptime(),
      },
    };
  }
}
