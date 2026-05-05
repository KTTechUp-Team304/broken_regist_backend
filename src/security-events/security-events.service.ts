import { Injectable } from '@nestjs/common';
import { SecurityEventDto } from '../logs/dto/security-event.dto';

@Injectable()
export class SecurityEventsService {
    // TODO: 실제 DB나 AdminService 에서 가져오도록 교체
    private readonly events: SecurityEventDto[] = [
        {
            id: 1,
            type: 'audit',
            userId: 10,
            requestMethod: 'GET',
            requestPath: '/api/admin/audit-logs',
            action: 'VIEW_LOGS',
            resourceType: 'audit_logs',
            resourceId: 0,
            responseStatus: 200,
            createdAt: new Date().toISOString(),
        },
        {
            id: 2,
            type: 'error',
            userId: 0,
            requestMethod: 'POST',
            requestPath: '/api/auth/login',
            errorType: 'AuthError',
            message: 'Invalid credentials',
            createdAt: new Date().toISOString(),
        },
    ];

    findAll(): SecurityEventDto[] {
        return this.events;
    }
}