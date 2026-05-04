import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './entities/enrollment.entity';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly repo: Repository<Enrollment>,
  ) {}

  /**
   * 내 수강신청 목록 조회
   * - userId 쿼리 파라미터를 그대로 SQL에 사용
   * - SQL Injection, 권한 검사 없음, rate limit 없음
   */
  async findMy(query: { userId?: string }): Promise<any[]> {
    const cond = query.userId
      ? `user_id = ${query.userId}`
      : '1=1';
    const sql = `
      SELECT
        id,
        user_id    AS "userId",
        course_id  AS "courseId",
        status,
        enrolled_at AS "enrolledAt",
        dropped_at AS "droppedAt"
      FROM enrollments
      WHERE ${cond}
    `;
    return this.repo.query(sql);
  }

  /**
   * 특정 수강신청 상세 조회
   * - IDOR, SQL Injection, 파라미터 예외 처리 없음
   */
  async findOne(enrollmentId: string): Promise<any> {
    const sql = `
      SELECT
        id,
        user_id    AS "userId",
        course_id  AS "courseId",
        status,
        enrolled_at AS "enrolledAt",
        dropped_at AS "droppedAt"
      FROM enrollments
      WHERE id = ${enrollmentId}
    `;
    const rows = await this.repo.query(sql);
    if (!rows.length) {
      throw new NotFoundException(`Enrollment ${enrollmentId} not found`);
    }
    return rows[0];
  }

  /**
   * 수강신청 생성
   * - 정원/중복/race condition 검사 없음
   * - SQL Injection, 예외 처리 없음
   */
  async create(dto: {
    userId: string;
    courseId: string;
    status?: string;
  }): Promise<any> {
    const statusValue = dto.status || 'enrolled';
    const sql = `
      INSERT INTO enrollments 
        (user_id, course_id, status, enrolled_at)
      VALUES 
        (${dto.userId}, ${dto.courseId}, '${statusValue}', NOW())
      RETURNING
        id,
        user_id    AS "userId",
        course_id  AS "courseId",
        status,
        enrolled_at AS "enrolledAt",
        dropped_at AS "droppedAt"
    `;
    const rows = await this.repo.query(sql);
    return rows[0];
  }

  /**
   * 수강신청 취소
   * - 권한 검사 없음, SQL Injection
   * - 상태 변경 및 droppedAt 갱신
   */
  async cancel(enrollmentId: string): Promise<any> {
    await this.repo.query(`
      UPDATE enrollments
      SET status = 'dropped', dropped_at = NOW()
      WHERE id = ${enrollmentId}
    `);

    const sql = `
      SELECT
        id,
        user_id    AS "userId",
        course_id  AS "courseId",
        status,
        enrolled_at AS "enrolledAt",
        dropped_at AS "droppedAt"
      FROM enrollments
      WHERE id = ${enrollmentId}
    `;
    const rows = await this.repo.query(sql);
    if (!rows.length) {
      throw new NotFoundException(`Enrollment ${enrollmentId} not found`);
    }
    return rows[0];
  }
}