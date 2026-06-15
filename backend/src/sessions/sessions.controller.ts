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

@Controller('sessions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post('book')
  @Roles('student')
  bookSession(
    @Body() createSessionDto: CreateSessionDto,
    @CurrentUser() user: JwtPayload,
  ) {
    // Note: If your JWT payload holds the User ID but your ReviewSession expects 
    // a StudentProfile ID, the service will need to map user.sub to the profile ID.
    return this.sessionsService.bookSession(createSessionDto, user.sub);
  }

  @Get('student/upcoming')
  @Roles('student')
  getUpcomingStudentSessions(@CurrentUser() user: JwtPayload) {
    return this.sessionsService.findStudentUpcoming(user.sub);
  }

  @Get('student/history')
  @Roles('student')
  getStudentSessionHistory(@CurrentUser() user: JwtPayload) {
    return this.sessionsService.findStudentHistory(user.sub);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: ReviewSessionStatus,
  ) {
    return this.sessionsService.updateStatus(id, status);
  }


  @Patch(':id/reschedule')
  @Roles('student')
  reschedule(
    @Param('id') id: string,
    @Body() rescheduleDto: RescheduleSessionDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.sessionsService.rescheduleSession(id, rescheduleDto, user.sub);
  }
}