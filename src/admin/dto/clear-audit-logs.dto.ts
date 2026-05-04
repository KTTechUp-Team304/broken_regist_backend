import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * POST /api/admin/audit-logs/clear
 * Body parameter 그대로 DELETE 문에 삽입됨 → SQL Injection
 * 권한 검사 없음 → Broken Access Control
 */
export class ClearAuditLogsDto {
  @ApiPropertyOptional({ description: 'userId 조건', example: "1" })
  userId?: string;

  @ApiPropertyOptional({ description: 'resourceType 조건', example: "USER" })
  resourceType?: string;

  @ApiPropertyOptional({ description: 'requestPath 조건', example: "/api/users" })
  requestPath?: string;
}