import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStackDto } from './dto/create-stack.dto';
import { UpdateStackDto } from './dto/update-stack.dto';
import { Stack, StackDocument } from './schemas/stack.schema';

@Injectable()
export class StacksService {
  constructor(
    @InjectModel(Stack.name) private readonly stackModel: Model<Stack>,
  ) {}

  create(createStackDto: CreateStackDto): Promise<StackDocument> {
    return this.stackModel.create(createStackDto);
  }

  findAll(): Promise<StackDocument[]> {
    return this.stackModel.find().sort({ name: 1 }).exec();
  }

  async findOne(id: string): Promise<StackDocument> {
    const stack = await this.stackModel.findById(id).exec();
    if (!stack) {
      throw new NotFoundException(`Stack ${id} not found`);
    }
    return stack;
  }

  async update(
    id: string,
    updateStackDto: UpdateStackDto,
  ): Promise<StackDocument> {
    const stack = await this.stackModel
      .findByIdAndUpdate(id, updateStackDto, {
        returnDocument: 'after',
        runValidators: true,
      })
      .exec();

    if (!stack) {
      throw new NotFoundException(`Stack ${id} not found`);
    }

    return stack;
  }

  async remove(id: string): Promise<StackDocument> {
    const stack = await this.stackModel.findByIdAndDelete(id).exec();
    if (!stack) {
      throw new NotFoundException(`Stack ${id} not found`);
    }
    return stack;
  }
}
