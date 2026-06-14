import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
