import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly repo: Repository<Course>,
  ) {}

  /**
   * GET /api/courses
   * - raw SQL + 파라미터 검증 없음 → SQL Injection, 숨김 강의 노출
   */
  async findAll(query: {
    keyword?: string;
    category?: string;
    isVisible?: string;
  }): Promise<any[]> {
    let whereClause = '1=1';
    if (query.keyword !== undefined) {
      // name/code/description 검색
      whereClause += ` AND (name LIKE '%${query.keyword}%' OR code LIKE '%${query.keyword}%' OR description LIKE '%${query.keyword}%')`;
    }
    if (query.category !== undefined) {
      whereClause += ` AND category = '${query.category}'`;
    }
    if (query.isVisible !== undefined) {
      whereClause += ` AND is_visible = ${query.isVisible}`;
    }
    const sql = `
      SELECT
        id, code, name, description, professor_id AS "professorId",
        category, max_capacity AS "maxCapacity", current_count AS "currentCount",
        is_visible AS "isVisible", created_at AS "createdAt"
      FROM courses
      WHERE ${whereClause}
    `;
    return this.repo.query(sql);
  }

  /**
   * GET /api/courses/:courseId
   * - IDOR(숨김 강의 접근), 파라미터 검증 없음 → 스택 트레이스 노출
   */
  async findOne(courseId: string): Promise<any> {
    const sql = `
      SELECT
        id, code, name, description, professor_id AS "professorId",
        category, max_capacity AS "maxCapacity", current_count AS "currentCount",
        is_visible AS "isVisible", created_at AS "createdAt"
      FROM courses
      WHERE id = ${courseId}
    `;
    const rows = await this.repo.query(sql);
    if (!rows.length) {
      throw new NotFoundException(`Course ${courseId} not found`);
    }
    return rows[0];
  }

  /**
   * POST /api/courses/:courseId/visibility
   * - 권한 검증 없음 → 모든 사용자가 호출 가능
   * - 파라미터 검증 없음 → SQL Injection
   */
  async changeVisibility(courseId: string, isVisible: boolean): Promise<any> {
    await this.repo.query(`
      UPDATE courses
      SET is_visible = ${isVisible}
      WHERE id = ${courseId}
    `);
    return this.findOne(courseId);
  }
}