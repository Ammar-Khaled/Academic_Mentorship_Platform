import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateStudentDto {
  @IsMongoId()
  user: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
