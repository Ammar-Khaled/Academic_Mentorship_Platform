import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Types } from 'mongoose';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../common/enums/user-role.enum';

import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { RescheduleSessionDto } from './dto/reschedule-session.dto';

import { EvaluateSessionDto } from './dto/evaluate-session.dto';

type CurrentUserDoc = {
  _id?: Types.ObjectId;
  id?: string;
  sub?: string;
  userId?: string;
  email?: string;
  role?: string;
};

function resolveUserId(user: CurrentUserDoc): string {
  const id = user?._id?.toString() ?? user?.id ?? user?.sub ?? user?.userId;

  if (!id) {
    throw new Error(
      `Cannot resolve user id. CurrentUser payload: ${JSON.stringify(user)}`,
    );
  }

  return id;
}

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  /**
   * Public endpoint — returns booked time ranges for a mentor on a given date.
   * Used by the frontend slot picker to disable already-taken slots.
   * No auth required so the booking dialog works before login too (discovery).
   */
  @Get('mentor-slots')
  getMentorBookedSlots(
    @Query('mentorId') mentorId: string,
    @Query('date') date: string,
  ) {
    return this.sessionsService.getMentorBookedSlots(mentorId, date);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('book')
  @Roles(UserRole.STUDENT)
  @HttpCode(HttpStatus.CREATED)
  bookSession(
    @Body() dto: CreateSessionDto,
    @CurrentUser() user: CurrentUserDoc,
  ) {
    return this.sessionsService.bookSession(dto, resolveUserId(user));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('student/upcoming')
  @Roles(UserRole.STUDENT)
  getUpcomingStudentSessions(@CurrentUser() user: CurrentUserDoc) {
    return this.sessionsService.findStudentUpcoming(resolveUserId(user));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('student/history')
  @Roles(UserRole.STUDENT)
  getStudentSessionHistory(@CurrentUser() user: CurrentUserDoc) {
    return this.sessionsService.findStudentHistory(resolveUserId(user));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/cancel')
  @Roles(UserRole.STUDENT)
  @HttpCode(HttpStatus.OK)
  cancelSession(@Param('id') id: string, @CurrentUser() user: CurrentUserDoc) {
    return this.sessionsService.cancelSession(id, resolveUserId(user));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/reschedule')
  @Roles(UserRole.STUDENT)
  @HttpCode(HttpStatus.OK)
  reschedule(
    @Param('id') id: string,
    @Body() dto: RescheduleSessionDto,
    @CurrentUser() user: CurrentUserDoc,
  ) {
    return this.sessionsService.rescheduleSession(id, dto, resolveUserId(user));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/evaluate')
  @Roles(UserRole.STUDENT)
  @HttpCode(HttpStatus.OK)
  evaluate(
    @Param('id') id: string,
    @Body() dto: EvaluateSessionDto,
    @CurrentUser() user: CurrentUserDoc,
  ) {
    return this.sessionsService.evaluateSession(id, dto, resolveUserId(user));
  }
}
