import { IsEmail, IsIn, IsString, MinLength, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';
import { UserRole } from '../../common/enums/user-role.enum';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsIn([UserRole.STUDENT, UserRole.MENTOR], {
    message: 'role must be one of: student, mentor',
  })
  role: UserRole.STUDENT | UserRole.MENTOR;

  // Common Profile Fields
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  bio?: string;

  // Mentor Profile Fields
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  stack?: string;

  @IsNumber()
  @IsOptional()
  hourlyRate?: number;

  // Student Profile Fields
  @IsString()
  @IsOptional()
  university?: string;

  @IsString()
  @IsOptional()
  major?: string;
}
