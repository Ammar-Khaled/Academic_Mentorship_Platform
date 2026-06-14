import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ReviewSessionStatus } from '../../common/enums/review-session-status.enum';

export class CreateSessionDto {
  @IsMongoId()
  mentor: string;

  @IsMongoId()
  student: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsEnum(ReviewSessionStatus)
  status?: ReviewSessionStatus;
}
