import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateEvaluationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  evaluationNotes: string;
}
