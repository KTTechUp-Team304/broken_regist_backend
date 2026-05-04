import { Injectable } from '@nestjs/common';
import type { DependencyResponseDto } from './dto/dependency-response.dto';
import type { BuildInfoResponseDto } from './dto/build-info-response.dto';

// package.json 로드 (타입 에러 방지용 최소 정의)
const pkg: { dependencies?: Record<string,string>; version?: string } =
  require('../../package.json');

@Injectable()
export class SystemService {
  /**
   * package.json 의 dependencies를 기반으로 리스트 반환
   */
  getDependencies(): DependencyResponseDto[] {
    const deps = pkg.dependencies || {};
    return Object.entries(deps).map(([name, version]) => ({
      name,
      version,
      vulnerable: false,
    }));
  }

  /**
   * 애플리케이션 버전, 빌드 시각, Node.js 버전 반환
   */
  getBuildInfo(): BuildInfoResponseDto {
    return {
      appVersion: pkg.version ?? 'unknown',
      builtAt: new Date().toISOString(),
      nodeVersion: process.version,
    };
  }
}