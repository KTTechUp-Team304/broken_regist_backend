import { ApiProperty } from '@nestjs/swagger';

export class CourseResponseDto {
  @ApiProperty({ example: 101 })
  id!: number;

  @ApiProperty({ example: 'CS101' })
  code!: string;

  @ApiProperty({ example: 'Intro to Computer Science' })
  name!: string;

  @ApiProperty({ example: '기초 컴퓨터 과학 개론' })
  description!: string;

  @ApiProperty({ example: 5 })
  professorId!: number;

  @ApiProperty({ example: 'engineering' })
  category!: string;

  @ApiProperty({ example: 30 })
  maxCapacity!: number;

  @ApiProperty({ example: 25 })
  currentCount!: number;

  @ApiProperty({ example: true })
  isVisible!: boolean;

  @ApiProperty({ example: '2026-04-01T09:00:00.000Z' })
  createdAt!: string;
}