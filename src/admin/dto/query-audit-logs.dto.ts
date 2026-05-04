import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * GET /api/admin/audit-logs
 * Query parameter 그대로 raw SQL에 삽입됨 → SQL Injection
 * 권한 검사 없음 → Broken Access Control
 */
export class QueryAuditLogsDto {
  @ApiPropertyOptional({ description: 'requestPath 필터', example: "/api/users" })
  path?: string;

  @ApiPropertyOptional({ description: 'userId 필터', example: "1" })
  userId?: string;

  @ApiPropertyOptional({ description: 'resourceType 필터', example: "USER" })
  resourceType?: string;
}