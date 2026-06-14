import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Stack, StackSchema } from './schemas/stack.schema';
import { StacksController } from './stacks.controller';
import { StacksService } from './stacks.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Stack.name, schema: StackSchema }]),
  ],
  controllers: [StacksController],
  providers: [StacksService],
  exports: [StacksService, MongooseModule],
})
export class StacksModule {}
