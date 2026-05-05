import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { QueryErrorLogsDto, ErrorLogResponseDto } from '../admin/dto';
import { AdminService } from '../admin/admin.service';

@ApiTags('Error Logs')
@Controller('api/admin/error-logs')
export class ErrorLogsController {
  constructor(private readonly svc: AdminService) {}

  @Get()
  list(@Query() q: QueryErrorLogsDto): Promise<ErrorLogResponseDto[]> {
    return this.svc.findErrorLogs(q);
  }
}