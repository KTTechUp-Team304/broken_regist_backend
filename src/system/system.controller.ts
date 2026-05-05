import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SystemService } from './system.service';
import { DependencyResponseDto } from './dto/dependency-response.dto';
import { BuildInfoResponseDto } from './dto/build-info-response.dto';

@ApiTags('System')
@Controller('api/system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  /**
   * GET /api/system/dependencies
   * 의존성 패키지 목록 조회
   */
  @Get('dependencies')
  @ApiOperation({ summary: '의존성 패키지 목록 조회' })
  @ApiResponse({ status: 200, type: [DependencyResponseDto] })
  dependencies() {
    return this.systemService.getDependencies();
  }

  /**
   * GET /api/system/build-info
   * 빌드/런타임 정보 조회
   */
  @Get('build-info')
  @ApiOperation({ summary: '빌드 및 런타임 정보 조회' })
  @ApiResponse({ status: 200, type: BuildInfoResponseDto })
  buildInfo() {
    return this.systemService.getBuildInfo();
  }
}