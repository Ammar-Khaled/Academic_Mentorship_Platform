import { IsEmail, IsIn, IsString, MinLength } from 'class-validator';
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
}
