import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/strategies/jwt.strategy';
import { ReviewSessionStatus } from '../common/enums/review-session-status.enum';
import { RescheduleSessionDto } from './dto/reschedule-session.dto';
import { UserRole } from '../common/enums/user-role.enum'; 
@Controller('sessions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post('book')
  @Roles(UserRole.STUDENT) 
  bookSession(
    @Body() createSessionDto: CreateSessionDto,
    @CurrentUser() user: any,
  ) {
    // Note: If your JWT payload holds the User ID but your ReviewSession expects 
    // a StudentProfile ID, the service will need to map user.sub to the profile ID.
    return this.sessionsService.bookSession(createSessionDto, user.sub);
  }

  @Get('student/upcoming')
  @Roles(UserRole.STUDENT)
  getUpcomingStudentSessions(@CurrentUser() user: any) {
    return this.sessionsService.findStudentUpcoming(user.sub);
  }

  @Get('student/history')
  @Roles(UserRole.STUDENT)
  getStudentSessionHistory(@CurrentUser() user: any) {
    return this.sessionsService.findStudentHistory(user.sub);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: ReviewSessionStatus,
  ) {
    return this.sessionsService.updateStatus(id, status);
  }

@Patch(':id/cancel')
  @Roles(UserRole.STUDENT)
  cancelSession(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.sessionsService.cancelSession(id, user.sub);
  }
  @Patch(':id/reschedule')
  @Roles(UserRole.STUDENT)
  reschedule(
    @Param('id') id: string,
    @Body() rescheduleDto: RescheduleSessionDto,
    @CurrentUser() user: any,
  ) {
    return this.sessionsService.rescheduleSession(id, rescheduleDto, user.sub);
  }
}