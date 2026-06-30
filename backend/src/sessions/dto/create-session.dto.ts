import {
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSessionDto {
  @IsMongoId()
  @IsNotEmpty()
  mentor: string;

  @IsOptional()
  @IsMongoId()
  student?: string;

  @IsDateString()
  @IsNotEmpty()
  startTime: string;

  @IsDateString()
  @IsNotEmpty()
  endTime: string;

  @IsOptional()
  @IsString()
  description?: string;
}
