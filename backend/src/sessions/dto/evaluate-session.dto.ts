import { IsString, IsNotEmpty, MaxLength, IsNumber, Min, Max, IsOptional } from 'class-validator';

export class EvaluateSessionDto {
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  evaluationNotes?: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;
}
