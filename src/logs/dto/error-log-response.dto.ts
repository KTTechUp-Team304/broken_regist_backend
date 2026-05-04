import { ApiProperty } from '@nestjs/swagger';

export class ErrorLogResponseDto {
  @ApiProperty({ example: 5001 })             id!: number;
  @ApiProperty({ example: 'TypeError' })      errorType!: string;
  @ApiProperty({ example: 'x is not a function' }) message!: string;
  @ApiProperty({ example: 'stack trace...' }) stackTrace!: string;
  @ApiProperty({ example: '/api/users' })     requestPath!: string;
  @ApiProperty({ example: 'POST' })           requestMethod!: string;
  @ApiProperty({ example: '{"foo":"bar"}' })  requestBody!: string;
  @ApiProperty({ example: 1 })                userId!: number;
  @ApiProperty({ example: '2026-04-01T12:01:00Z' }) createdAt!: string;
}