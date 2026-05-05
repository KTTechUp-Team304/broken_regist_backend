import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../logs/entities/audit-log.entity';
import { ErrorLog } from '../logs/entities/error-log.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepo: Repository<AuditLog>,
    @InjectRepository(ErrorLog)
    private readonly errorRepo: Repository<ErrorLog>,
  ) {}

  async findAuditLogs(query: {
    path?: string;
    userId?: string;
    resourceType?: string;
  }): Promise<any[]> {
    let cond = '1=1';
    if (query.path) {
      cond += ` AND request_path LIKE '%${query.path}%'`;
    }
    if (query.userId) {
      cond += ` AND user_id = ${query.userId}`;
    }
    if (query.resourceType) {
      cond += ` AND resource_type = '${query.resourceType}'`;
    }
    const sql = `
      SELECT
        id,
        user_id        AS "userId",
        action,
        resource_type  AS "resourceType",
        resource_id    AS "resourceId",
        ip_address     AS "ipAddress",
        request_method AS "requestMethod",
        request_path   AS "requestPath",
        response_status AS "responseStatus",
        created_at     AS "createdAt"
      FROM audit_logs
      WHERE ${cond}
    `;
    return this.auditRepo.query(sql);
  }

  async clearAuditLogs(filters: {
    userId?: string;
    resourceType?: string;
    requestPath?: string;
  }): Promise<void> {
    let cond = '1=1';
    if (filters.userId) {
      cond += ` AND user_id = ${filters.userId}`;
    }
    if (filters.resourceType) {
      cond += ` AND resource_type = '${filters.resourceType}'`;
    }
    if (filters.requestPath) {
      cond += ` AND request_path LIKE '%${filters.requestPath}%'`;
    }
    const sql = `DELETE FROM audit_logs WHERE ${cond}`;
    await this.auditRepo.query(sql);
  }

  async findErrorLogs(query: {
    requestPath?: string;
    errorType?: string;
    userId?: string;
  }): Promise<any[]> {
    let cond = '1=1';
    if (query.requestPath) {
      cond += ` AND request_path LIKE '%${query.requestPath}%'`;
    }
    if (query.errorType) {
      cond += ` AND error_type = '${query.errorType}'`;
    }
    if (query.userId) {
      cond += ` AND user_id = ${query.userId}`;
    }
    const sql = `
      SELECT
        id,
        error_type   AS "errorType",
        message,
        stack_trace  AS "stackTrace",
        request_path AS "requestPath",
        request_method AS "requestMethod",
        request_body AS "requestBody",
        user_id      AS "userId",
        created_at   AS "createdAt"
      FROM error_logs
      WHERE ${cond}
    `;
    return this.errorRepo.query(sql);
  }
}