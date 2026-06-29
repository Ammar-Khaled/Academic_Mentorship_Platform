import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class BlockUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  blockReason: string;
}
