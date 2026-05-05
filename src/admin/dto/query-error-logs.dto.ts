import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * GET /api/admin/error-logs
 * Query parameter 그대로 raw SQL에 삽입됨 → SQL Injection
 * 권한 검사 없음 → Broken Access Control
 */
export class QueryErrorLogsDto {
  @ApiPropertyOptional({ description: 'requestPath 필터', example: "/api/users" })
  requestPath?: string;

  @ApiPropertyOptional({ description: 'errorType 필터', example: "TypeError" })
  errorType?: string;

  @ApiPropertyOptional({ description: 'userId 필터', example: "1" })
  userId?: string;
}