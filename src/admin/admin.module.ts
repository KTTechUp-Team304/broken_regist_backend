import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from '../logs/entities/audit-log.entity';
import { ErrorLog } from '../logs/entities/error-log.entity';
import {
  AdminAuditLogsController,
  AdminErrorLogsController,
} from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuditLog, ErrorLog]),
  ],
  controllers: [
    AdminAuditLogsController,
    AdminErrorLogsController,
  ],
  providers: [AdminService],
})
export class AdminModule {}