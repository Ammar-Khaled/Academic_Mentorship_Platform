import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
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
import { ReviewSessionStatus } from '../common/enums/review-session-status.enum';

import { MentorDashboardService } from './mentor-dashboard.service';
import { UpdateMentorProfileDto } from './dto/update-mentor-profile.dto';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { UpdateEvaluationDto } from './../sessions/dto/update-evaluation.dto';

// ─── safe union type (covers all common JWT payload shapes) ───────────────────
type CurrentUserDoc = {
  _id?: Types.ObjectId;
  id?: string;
  sub?: string;
  userId?: string;
  email?: string;
  role?: string;
};

// ─── helper: resolve user id regardless of JWT payload shape ──────────────────
function resolveUserId(user: CurrentUserDoc): string {
  const id = user?._id?.toString() ?? user?.id ?? user?.sub ?? user?.userId;

  if (!id) {
    throw new Error(
      `Cannot resolve user id. CurrentUser shape: ${JSON.stringify(user)}`,
    );
  }

  return id;
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.MENTOR)
@Controller('mentor')
export class MentorDashboardController {
  constructor(private readonly dashboardService: MentorDashboardService) {}

  // ─── Profile ─────────────────────────────────────────────────────────────

  @Get('profile')
  getProfile(@CurrentUser() user: CurrentUserDoc) {
    return this.dashboardService.getOwnProfile(resolveUserId(user));
  }

  @Patch('profile')
  updateProfile(
    @CurrentUser() user: CurrentUserDoc,
    @Body() dto: UpdateMentorProfileDto,
  ) {
    return this.dashboardService.updateOwnProfile(resolveUserId(user), dto);
  }

  // ─── Availability ─────────────────────────────────────────────────────────

  @Post('availability')
  @HttpCode(HttpStatus.CREATED)
  createAvailability(
    @CurrentUser() user: CurrentUserDoc,
    @Body() dto: CreateAvailabilityDto,
  ) {
    return this.dashboardService.createAvailability(resolveUserId(user), dto);
  }

  @Get('availability')
  getAvailability(@CurrentUser() user: CurrentUserDoc) {
    return this.dashboardService.getAvailability(resolveUserId(user));
  }

  @Patch('availability/:id')
  updateAvailability(
    @CurrentUser() user: CurrentUserDoc,
    @Param('id') id: string,
    @Body() dto: UpdateAvailabilityDto,
  ) {
    return this.dashboardService.updateAvailability(
      resolveUserId(user),
      id,
      dto,
    );
  }

  @Delete('availability/:id')
  @HttpCode(HttpStatus.OK)
  deleteAvailability(
    @CurrentUser() user: CurrentUserDoc,
    @Param('id') id: string,
  ) {
    return this.dashboardService.deleteAvailability(resolveUserId(user), id);
  }

  // ─── Sessions ─────────────────────────────────────────────────────────────

  @Get('sessions')
  getMentorSessions(
    @CurrentUser() user: CurrentUserDoc,
    @Query('status', new ParseEnumPipe(ReviewSessionStatus, { optional: true }))
    status?: ReviewSessionStatus,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
  ) {
    return this.dashboardService.getMentorSessions(resolveUserId(user), {
      status,
      page,
      limit,
    });
  }

  @Patch('sessions/:id/evaluation')
  evaluateSession(
    @CurrentUser() user: CurrentUserDoc,
    @Param('id') id: string,
    @Body() dto: UpdateEvaluationDto,
  ) {
    return this.dashboardService.evaluateSession(resolveUserId(user), id, dto);
  }
}
