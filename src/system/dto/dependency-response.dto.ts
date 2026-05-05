import { ApiProperty } from '@nestjs/swagger';

/**
 * 패키지 의존성 정보를 반환하는 DTO
 */
export class DependencyResponseDto {
  @ApiProperty({ example: 'nestjs/common', description: '패키지명' })
  name: string = '';

  @ApiProperty({ example: '^10.0.0', description: '설치된 버전' })
  version: string = '';

  @ApiProperty({ example: false, description: '알려진 취약점 여부' })
  vulnerable: boolean = false;
}