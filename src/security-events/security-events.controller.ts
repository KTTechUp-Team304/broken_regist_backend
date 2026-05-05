import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SecurityEventsService } from './security-events.service';
import { SecurityEventDto } from '../logs/dto/security-event.dto';

@ApiTags('Security Events')
@Controller('api/security/events')
export class SecurityEventsController {
    constructor(private readonly svc: SecurityEventsService) { }

    @Get()
    @ApiOperation({ summary: '보안 이벤트 조회' })
    @ApiResponse({ status: 200, type: [SecurityEventDto] })
    getEvents(): SecurityEventDto[] {
        return this.svc.findAll();
    }
}