import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import {
  ReviewSession,
  ReviewSessionDocument,
} from './schemas/review-session.schema';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(ReviewSession.name)
    private readonly reviewSessionModel: Model<ReviewSession>,
  ) {}

  create(createSessionDto: CreateSessionDto): Promise<ReviewSessionDocument> {
    return this.reviewSessionModel.create(createSessionDto);
  }

  findAll(): Promise<ReviewSessionDocument[]> {
    return this.reviewSessionModel
      .find()
      .populate('mentor', 'name title stack')
      .populate('student', 'name')
      .sort({ startTime: -1 })
      .exec();
  }

  async findOne(id: string): Promise<ReviewSessionDocument> {
    const session = await this.reviewSessionModel
      .findById(id)
      .populate('mentor', 'name title stack')
      .populate('student', 'name')
      .exec();

    if (!session) {
      throw new NotFoundException(`Review session ${id} not found`);
    }

    return session;
  }

  async update(
    id: string,
    updateSessionDto: UpdateSessionDto,
  ): Promise<ReviewSessionDocument> {
    const session = await this.reviewSessionModel
      .findByIdAndUpdate(id, updateSessionDto, {
        returnDocument: 'after',
        runValidators: true,
      })
      .populate('mentor', 'name title stack')
      .populate('student', 'name')
      .exec();

    if (!session) {
      throw new NotFoundException(`Review session ${id} not found`);
    }

    return session;
  }

  async remove(id: string): Promise<ReviewSessionDocument> {
    const session = await this.reviewSessionModel.findByIdAndDelete(id).exec();
    if (!session) {
      throw new NotFoundException(`Review session ${id} not found`);
    }
    return session;
  }
}
