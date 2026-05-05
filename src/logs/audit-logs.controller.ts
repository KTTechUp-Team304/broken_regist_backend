import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  QueryAuditLogsDto,
  ClearAuditLogsDto,
  AuditLogResponseDto,
} from '../admin/dto';
import { AdminService } from '../admin/admin.service';

@ApiTags('Audit Logs')
@Controller('api/admin/audit-logs')
export class AuditLogsController {
  constructor(private readonly svc: AdminService) {}

  @Get()
  list(@Query() q: QueryAuditLogsDto): Promise<AuditLogResponseDto[]> {
    return this.svc.findAuditLogs(q);
  }

  @Post('clear')
  clear(@Body() dto: ClearAuditLogsDto): Promise<void> {
    return this.svc.clearAuditLogs(dto);
  }
}