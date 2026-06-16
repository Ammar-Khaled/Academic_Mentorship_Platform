import { IsDateString, IsNotEmpty } from 'class-validator';

export class RescheduleSessionDto {
  @IsDateString()
  @IsNotEmpty()
  startTime: string;

  @IsDateString()
  @IsNotEmpty()
  endTime: string;
}