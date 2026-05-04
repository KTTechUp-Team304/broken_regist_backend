import {
  Controller,
  Get,
  Post,
  Query,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import {
  QueryAuditLogsDto,
  ClearAuditLogsDto,
  QueryErrorLogsDto,
  AuditLogResponseDto,
  ErrorLogResponseDto,
} from './dto';
import { AdminService } from './admin.service';

@ApiTags('Admin AuditLogs')
@Controller('admin/audit-logs')
export class AdminAuditLogsController {
  constructor(private readonly svc: AdminService) {}

  @Get()
  @ApiOperation({ summary: '감사 로그 조회 (권한 검사 없음, SQL Injection)' })
  @ApiResponse({ status: 200, type: [AuditLogResponseDto] })
  async list(
    @Query() query: QueryAuditLogsDto,
  ): Promise<any[]> {
    return this.svc.findAuditLogs(query);
  }

  @Post('clear')
  @ApiOperation({ summary: '감사 로그 삭제 (권한 검사 없음)' })
  @ApiResponse({ status: 204, description: '삭제 완료' })
  async clear(
    @Body() dto: ClearAuditLogsDto,
  ): Promise<void> {
    await this.svc.clearAuditLogs(dto);
  }
}

@ApiTags('Admin ErrorLogs')
@Controller('admin/error-logs')
export class AdminErrorLogsController {
  constructor(private readonly svc: AdminService) {}

  @Get()
  @ApiOperation({ summary: '에러 로그 조회 (권한 검사 없음, SQL Injection)' })
  @ApiResponse({ status: 200, type: [ErrorLogResponseDto] })
  async list(
    @Query() query: QueryErrorLogsDto,
  ): Promise<any[]> {
    return this.svc.findErrorLogs(query);
  }
}