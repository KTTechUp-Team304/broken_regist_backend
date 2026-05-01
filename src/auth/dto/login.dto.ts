import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'student01' })
  username!: string;

  @ApiProperty({
    example: 'plain-password-input',
    description:
      'MVP 문서 기준으로 원문 비밀번호 입력 필드명은 passwordHash를 사용',
  })
  passwordHash!: string;
}
