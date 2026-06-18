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
import { Stack, StackDocument } from '../stacks/schemas/stack.schema';

export interface AuthResponse {
  access_token: string;
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
    @InjectModel(Stack.name)
    private readonly stackModel: Model<StackDocument>,
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

  private async createMentorProfile(userId: Types.ObjectId): Promise<void> {
    const stackId = await this.ensureDefaultStack();
    await this.mentorProfileModel.create({
      user: userId,
      stack: stackId,
      name: '',
      title: '',
      bio: '',
      hourlyRate: 0,
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
      await this.createMentorProfile(user._id);
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
