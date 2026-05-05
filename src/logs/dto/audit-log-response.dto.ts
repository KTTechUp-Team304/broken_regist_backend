import { ApiProperty } from '@nestjs/swagger';

export class AuditLogResponseDto {
  @ApiProperty({ example: 1001 })         id!: number;
  @ApiProperty({ example: 1 })            userId!: number;
  @ApiProperty({ example: 'CREATE' })     action!: string;
  @ApiProperty({ example: 'USER' })       resourceType!: string;
  @ApiProperty({ example: 42 })           resourceId!: number;
  @ApiProperty({ example: '127.0.0.1' })   ipAddress!: string;
  @ApiProperty({ example: 'GET' })        requestMethod!: string;
  @ApiProperty({ example: '/api/users' }) requestPath!: string;
  @ApiProperty({ example: 200 })          responseStatus!: number;
  @ApiProperty({ example: '2026-04-01T12:00:00Z' }) createdAt!: string;
}