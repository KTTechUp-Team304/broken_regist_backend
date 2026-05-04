import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SecurityEventsService } from '../security-events/security-events.service';
import { SecurityEventDto } from './dto/security-event.dto';

@ApiTags('Security Events')
@Controller('api/security/events')
export class SecurityEventsController {
  constructor(private readonly svc: SecurityEventsService) {}

  @Get()
  list(): SecurityEventDto[] {
    return this.svc.findAll();
  }
}