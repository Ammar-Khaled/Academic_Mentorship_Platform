import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AiAuditService } from './services/ai-audit.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { ApproveUserDto } from './dto/approve-user.dto';
import { BlockUserDto } from './dto/block-user.dto';
import { UserApprovalStatus } from './schemas/user-approval.schema';
import { AuditLogStatus } from '../common/enums/audit-log-status.enum';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly aiAuditService: AiAuditService,
  ) {}

  @Get('users/pending')
  async getPendingUsers() {
    return this.adminService.getPendingUsers();
  }

  @Get('users')
  async getAllUsers(
    @Query('status') status?: UserApprovalStatus,
  ) {
    return this.adminService.getAllUsers(status);
  }

  @Get('users/:userId')
  async getUserApprovalStatus(@Param('userId') userId: string) {
    return this.adminService.getUserApprovalStatus(userId);
  }

  @Post('users/:userId/approve')
  async approveUser(
    @Param('userId') userId: string,
    @Body() dto: ApproveUserDto,
    @CurrentUser() admin: any,
  ) {
    return this.adminService.approveUser(userId, admin.sub, dto);
  }

  @Post('users/:userId/block')
  async blockUser(
    @Param('userId') userId: string,
    @Body() dto: BlockUserDto,
    @CurrentUser() admin: any,
  ) {
    return this.adminService.blockUser(userId, admin.sub, dto);
  }

  @Post('users/:userId/unblock')
  async unblockUser(
    @Param('userId') userId: string,
    @CurrentUser() admin: any,
  ) {
    return this.adminService.unblockUser(userId, admin.sub);
  }

  @Get('statistics')

  // AI Audit Endpoints
  @Post('audit/analyze/:sessionId')
  async analyzeSession(@Param('sessionId') sessionId: string) {
    return this.aiAuditService.analyzeSession(sessionId);
  }

  @Post('audit/analyze-batch')
  async analyzeSessions(@Body() dto: { sessionIds: string[] }) {
    return this.aiAuditService.analyzeSessions(dto.sessionIds);
  }

  @Get('audit/logs/recent')
  async getRecentAuditLogs(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 50;
    return this.aiAuditService.getRecentAuditLogs(limitNum);
  }

  @Get('audit/logs/by-status/:status')
  async getAuditLogsByStatus(
    @Param('status') status: AuditLogStatus,
    @Query('limit') limit?: string,
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 50;
    return this.aiAuditService.getAuditLogsByStatus(status, limitNum);
  }

  @Get('audit/logs/:sessionId')
  async getSessionAuditLog(@Param('sessionId') sessionId: string) {
    return this.aiAuditService.getSessionAuditLog(sessionId);
  }

  @Get('audit/statistics')
  async getAuditStatistics() {
    return this.aiAuditService.getAuditStatistics();
  }
  async getAdminStatistics() {
    return this.adminService.getAdminStatistics();
  }
}
