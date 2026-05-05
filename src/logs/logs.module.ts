import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogsController } from './audit-logs.controller';
import { ErrorLogsController } from './error-logs.controller';
import { SecurityEventsController } from './security-events.controller';
import { AdminService } from '../admin/admin.service';
import { SecurityEventsService } from '../security-events/security-events.service';
import { AuditLog } from './entities/audit-log.entity';
import { ErrorLog } from './entities/error-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuditLog, ErrorLog]), // 🔥 핵심 추가
  ],
  controllers: [
    AuditLogsController,
    ErrorLogsController,
    SecurityEventsController,
  ],
  providers: [
    AdminService,
    SecurityEventsService,
  ],
  exports: [
    TypeOrmModule, // 🔥 다른 모듈에서 쓰면 필요
  ],
})
export class LogsModule {}