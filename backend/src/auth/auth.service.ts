import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../common/enums/user-role.enum';
import { UserDocument } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { MentorProfile, MentorProfileDocument } from '../mentors/schemas/mentor-profile.schema';
import { StudentProfile, StudentProfileDocument } from '../students/schemas/student-profile.schema';
import { Stack, StackDocument } from '../stacks/schemas/stack.schema';
import { UserApproval, UserApprovalDocument, UserApprovalStatus } from '../admin/schemas/user-approval.schema';

export interface AuthResponse {
  access_token?: string;
  status?: string;
  user: {
    id: string;
    email: string;
    role: UserRole;
    createdAt: Date;
  };
}

@Injectable()
export class AuthService {
  private readonly saltRounds = 10;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectModel(MentorProfile.name)
    private readonly mentorProfileModel: Model<MentorProfileDocument>,
    @InjectModel(StudentProfile.name)
    private readonly studentProfileModel: Model<StudentProfileDocument>,
    @InjectModel(Stack.name)
    private readonly stackModel: Model<StackDocument>,
    @InjectModel(UserApproval.name)
    private readonly userApprovalModel: Model<UserApprovalDocument>,
  ) {}

  private async ensureDefaultStack(): Promise<Types.ObjectId> {
    let stack = await this.stackModel.findOne().select('_id').lean().exec();
    if (!stack) {
      stack = await this.stackModel.create({
        name: 'General',
        description: 'General mentoring stack',
      });
    }
    return stack._id;
  }

  private async createMentorProfile(userId: Types.ObjectId, dto: RegisterDto): Promise<void> {
    let stackId: Types.ObjectId;
    if (dto.stack && Types.ObjectId.isValid(dto.stack)) {
      stackId = new Types.ObjectId(dto.stack);
    } else {
      stackId = await this.ensureDefaultStack();
    }

    await this.mentorProfileModel.create({
      user: userId,
      stack: stackId,
      name: dto.name || '',
      title: dto.title || '',
      bio: dto.bio || '',
      hourlyRate: dto.hourlyRate || 0,
      isVerified: false,
    });
  }

  private async createStudentProfile(userId: Types.ObjectId, dto: RegisterDto): Promise<void> {
    await this.studentProfileModel.create({
      user: userId,
      name: dto.name || '',
      bio: dto.bio || '',
      university: dto.university || '',
      major: dto.major || '',
    });
  }

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, this.saltRounds);
    const user = await this.usersService.create(
      dto.email,
      passwordHash,
      dto.role,
    );

    if (dto.role === UserRole.MENTOR) {
      await this.createMentorProfile(user._id, dto);
      await this.userApprovalModel.create({
        user: user._id,
        status: UserApprovalStatus.PENDING,
      });

      return {
        status: 'pending',
        user: {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      };
    } else {
      await this.createStudentProfile(user._id, dto);
      await this.userApprovalModel.create({
        user: user._id,
        status: UserApprovalStatus.APPROVED,
      });
    }

    return this.buildAuthResponse(user);
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findByEmailWithPassword(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const approval = await this.userApprovalModel.findOne({ user: user._id }).lean().exec();
    if (approval) {
      if (approval.status === UserApprovalStatus.PENDING) {
        throw new UnauthorizedException('Your account is pending admin approval.');
      }
      if (approval.status === UserApprovalStatus.BLOCKED) {
        throw new UnauthorizedException('Your account is blocked.');
      }
      if (approval.status === UserApprovalStatus.REJECTED) {
        throw new UnauthorizedException('Your account application was rejected.');
      }
    } else if (user.role === UserRole.MENTOR) {
      // If no approval record exists for a mentor (legacy data), deny access for safety
      throw new UnauthorizedException('Your account is pending admin approval.');
    }

    return this.buildAuthResponse(user);
  }

  private buildAuthResponse(user: UserDocument): AuthResponse {
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    };
  }
}
