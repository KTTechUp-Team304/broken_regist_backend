import { ApiProperty } from '@nestjs/swagger';

export class SecurityEventDto {
  @ApiProperty({ example: 123, description: '이벤트 고유 ID' })
  id: number = 0;

  @ApiProperty({ example: 'audit', description: '이벤트 종류 (audit | error)' })
  type: 'audit' | 'error' = 'audit';

  @ApiProperty({ example: 45, description: '유저 ID' })
  userId: number = 0;

  @ApiProperty({ example: 'GET', description: '요청 HTTP 메서드' })
  requestMethod: string = '';

  @ApiProperty({ example: '/api/admin/audit-logs', description: '요청 경로' })
  requestPath: string = '';

  @ApiProperty({ example: 'DELETE_USER', description: '행위 코드 (audit일 때)' })
  action?: string;

  @ApiProperty({ example: 'users', description: '리소스 타입 (audit일 때)' })
  resourceType?: string;

  @ApiProperty({ example: 5, description: '리소스 ID (audit일 때)' })
  resourceId?: number;

  @ApiProperty({ example: 500, description: '응답 상태 코드 (audit일 때)' })
  responseStatus?: number;

  @ApiProperty({ example: 'TypeError: x is not a function', description: '에러 타입 (error일 때)' })
  errorType?: string;

  @ApiProperty({ example: 'Cannot read property...', description: '에러 메시지 (error일 때)' })
  message?: string;

  @ApiProperty({ example: '2024-07-15T14:23:00Z', description: '이벤트 발생 시각' })
  createdAt: string = '';
}