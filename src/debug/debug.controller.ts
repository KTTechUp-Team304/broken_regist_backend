import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DebugService } from './debug.service';
import { UpdateConfigDto } from './dto/update-config.dto';
import { QueryTestDto } from './dto/query-test.dto';

@ApiTags('Debug')
@Controller('api/debug')
export class DebugController {
  constructor(private readonly svc: DebugService) {}

  @Get('configs')
  @ApiOperation({ summary: 'Debug 설정 목록 조회' })
  @ApiResponse({ status: 200, type: [Object] })
  getConfigs() {
    return this.svc.getConfigs();
  }

  @Post('configs/:key')
  @ApiOperation({ summary: 'Debug 설정 변경' })
  @ApiResponse({ status: 200, type: Object })
  updateConfig(@Param('key') key: string, @Body() dto: UpdateConfigDto) {
    return this.svc.updateConfig(key, dto);
  }

  @Get('secrets')
  @ApiOperation({ summary: '민감 Debug 설정(Secrets) 조회' })
  @ApiResponse({ status: 200, type: [Object] })
  getSecrets() {
    return this.svc.getSecrets();
  }

  @Post('query-test')
  @ApiOperation({ summary: 'Raw query 테스트용 엔드포인트' })
  @ApiResponse({ status: 200, type: Object })
  queryTest(@Body() dto: QueryTestDto) {
    return this.svc.queryTest(dto);
  }
}