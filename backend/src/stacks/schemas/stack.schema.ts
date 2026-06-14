import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StackDocument = HydratedDocument<Stack>;

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class Stack {
  @Prop({ required: true, unique: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  description: string;

  createdAt: Date;
  updatedAt: Date;
}

export const StackSchema = SchemaFactory.createForClass(Stack);
