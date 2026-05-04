import { ApiProperty } from '@nestjs/swagger';

/**
 * 애플리케이션 빌드 및 런타임 정보를 반환하는 DTO
 */
export class BuildInfoResponseDto {
  @ApiProperty({ example: '1.0.0', description: '애플리케이션 버전' })
  appVersion: string = '';

  @ApiProperty({ example: '2024-07-01T12:34:56Z', description: '빌드 일시' })
  builtAt: string = '';

  @ApiProperty({ example: 'v20.5.1', description: 'Node.js 런타임 버전' })
  nodeVersion: string = '';
}