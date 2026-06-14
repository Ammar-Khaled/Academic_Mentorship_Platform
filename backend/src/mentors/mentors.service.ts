import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMentorDto } from './dto/create-mentor.dto';
import { UpdateMentorDto } from './dto/update-mentor.dto';
import {
  MentorProfile,
  MentorProfileDocument,
} from './schemas/mentor-profile.schema';

@Injectable()
export class MentorsService {
  constructor(
    @InjectModel(MentorProfile.name)
    private readonly mentorProfileModel: Model<MentorProfile>,
  ) {}

  create(createMentorDto: CreateMentorDto): Promise<MentorProfileDocument> {
    return this.mentorProfileModel.create(createMentorDto);
  }

  findAll(): Promise<MentorProfileDocument[]> {
    return this.mentorProfileModel
      .find()
      .populate('user', 'email role')
      .populate('stack', 'name description')
      .sort({ averageRating: -1 })
      .exec();
  }

  async findOne(id: string): Promise<MentorProfileDocument> {
    const mentor = await this.mentorProfileModel
      .findById(id)
      .populate('user', 'email role')
      .populate('stack', 'name description')
      .exec();

    if (!mentor) {
      throw new NotFoundException(`Mentor profile ${id} not found`);
    }

    return mentor;
  }

  async update(
    id: string,
    updateMentorDto: UpdateMentorDto,
  ): Promise<MentorProfileDocument> {
    const mentor = await this.mentorProfileModel
      .findByIdAndUpdate(id, updateMentorDto, {
        returnDocument: 'after',
        runValidators: true,
      })
      .populate('user', 'email role')
      .populate('stack', 'name description')
      .exec();

    if (!mentor) {
      throw new NotFoundException(`Mentor profile ${id} not found`);
    }

    return mentor;
  }

  async remove(id: string): Promise<MentorProfileDocument> {
    const mentor = await this.mentorProfileModel.findByIdAndDelete(id).exec();
    if (!mentor) {
      throw new NotFoundException(`Mentor profile ${id} not found`);
    }
    return mentor;
  }
}
