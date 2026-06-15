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
import type { UserDocument } from '../users/schemas/user.schema';
import { ReviewSessionStatus } from '../common/enums/review-session-status.enum';

import { MentorDashboardService } from './mentor-dashboard.service';
import { UpdateMentorProfileDto } from './dto/update-mentor-profile.dto';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { UpdateEvaluationDto } from './../sessions/dto/update-evaluation.dto';

type CurrentUserDoc = UserDocument & { _id: Types.ObjectId };

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.MENTOR)
@Controller('mentor')
export class MentorDashboardController {
  constructor(private readonly dashboardService: MentorDashboardService) {}

  // ─────────────────────────────────────────────
  // Profile
  // ─────────────────────────────────────────────

  @Get('profile')
  getProfile(@CurrentUser() user: CurrentUserDoc) {
    return this.dashboardService.getOwnProfile(user._id.toString());
  }

  @Patch('profile')
  updateProfile(
    @CurrentUser() user: CurrentUserDoc,
    @Body() dto: UpdateMentorProfileDto,
  ) {
    return this.dashboardService.updateOwnProfile(user._id.toString(), dto);
  }

  // ─────────────────────────────────────────────
  // Availability
  // ─────────────────────────────────────────────

  @Post('availability')
  @HttpCode(HttpStatus.CREATED)
  createAvailability(
    @CurrentUser() user: CurrentUserDoc,
    @Body() dto: CreateAvailabilityDto,
  ) {
    return this.dashboardService.createAvailability(user._id.toString(), dto);
  }

  @Get('availability')
  getAvailability(@CurrentUser() user: CurrentUserDoc) {
    return this.dashboardService.getAvailability(user._id.toString());
  }

  @Patch('availability/:id')
  updateAvailability(
    @CurrentUser() user: CurrentUserDoc,
    @Param('id') id: string,
    @Body() dto: UpdateAvailabilityDto,
  ) {
    return this.dashboardService.updateAvailability(
      user._id.toString(),
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
    return this.dashboardService.deleteAvailability(user._id.toString(), id);
  }

  // ─────────────────────────────────────────────
  // Sessions
  // ─────────────────────────────────────────────

  @Get('sessions')
  getMentorSessions(
    @CurrentUser() user: CurrentUserDoc,
    @Query('status', new ParseEnumPipe(ReviewSessionStatus, { optional: true }))
    status?: ReviewSessionStatus,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
  ) {
    return this.dashboardService.getMentorSessions(user._id.toString(), {
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
    return this.dashboardService.evaluateSession(user._id.toString(), id, dto);
  }
}
