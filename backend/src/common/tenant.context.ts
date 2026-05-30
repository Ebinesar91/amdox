import { createParamDecorator, ExecutionContext, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export interface TenantRequest extends Request {
  tenantId?: string;
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: TenantRequest, res: Response, next: NextFunction) {
    // Extract tenantId from headers or JWT tokens
    const tenantHeader = req.headers['x-tenant-id'] as string;
    if (tenantHeader) {
      req.tenantId = tenantHeader;
    } else {
      req.tenantId = 'default-tenant-uuid-001'; // Default tenant fallback for development
    }
    next();
  }
}

// Request param decorator to retrieve tenant context in routes
export const GetTenantId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<TenantRequest>();
    return request.tenantId;
  },
);
