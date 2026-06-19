import { IsString, IsOptional, MaxLength } from 'class-validator';

export class ApproveUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  approvalNotes?: string;
}
