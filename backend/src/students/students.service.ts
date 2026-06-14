import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import {
  StudentProfile,
  StudentProfileDocument,
} from './schemas/student-profile.schema';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(StudentProfile.name)
    private readonly studentProfileModel: Model<StudentProfile>,
  ) {}

  create(createStudentDto: CreateStudentDto): Promise<StudentProfileDocument> {
    return this.studentProfileModel.create(createStudentDto);
  }

  findAll(): Promise<StudentProfileDocument[]> {
    return this.studentProfileModel
      .find()
      .populate('user', 'email role')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<StudentProfileDocument> {
    const student = await this.studentProfileModel
      .findById(id)
      .populate('user', 'email role')
      .exec();

    if (!student) {
      throw new NotFoundException(`Student profile ${id} not found`);
    }

    return student;
  }

  async update(
    id: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<StudentProfileDocument> {
    const student = await this.studentProfileModel
      .findByIdAndUpdate(id, updateStudentDto, {
        returnDocument: 'after',
        runValidators: true,
      })
      .populate('user', 'email role')
      .exec();

    if (!student) {
      throw new NotFoundException(`Student profile ${id} not found`);
    }

    return student;
  }

  async remove(id: string): Promise<StudentProfileDocument> {
    const student = await this.studentProfileModel.findByIdAndDelete(id).exec();

    if (!student) {
      throw new NotFoundException(`Student profile ${id} not found`);
    }

    return student;
  }
}
