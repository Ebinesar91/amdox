import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from './prisma.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, user } = request;

    // Track write operations (POST, PUT, DELETE)
    const isWriteOperation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
    
    // Ignore auth login route to prevent logging passwords if any
    const isAuthRoute = url.includes('/api/auth');

    return next.handle().pipe(
      tap(async (response) => {
        if (isWriteOperation && !isAuthRoute && user) {
          try {
            const entity = url.split('/')[2] || 'Unknown';
            const tenantId = user.tenantId || request.tenantId || 'default-tenant-uuid-001';

            await this.prisma.auditLog.create({
              data: {
                tenantId,
                userId: user.userId || 'system',
                action: `${method} ${url}`,
                entity,
                entityId: response?.id || 'N/A',
                oldValues: null, // In production, fetch database before write for diffs
                newValues: body ? JSON.parse(JSON.stringify(body)) : null,
                ipAddress: request.ip || request.headers['x-forwarded-for'] || '127.0.0.1',
                userAgent: request.headers['user-agent'] || 'Unknown',
              },
            });
          } catch (err) {
            console.error('Failed to write audit log entry:', err.message);
          }
        }
      }),
    );
  }
}
