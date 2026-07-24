import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as crypto from 'crypto';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();

    // Assign a unique Request ID using native crypto module
    const requestId = request.headers['x-request-id'] || crypto.randomUUID();
    request.headers['x-request-id'] = requestId;

    return next.handle().pipe(
      tap(() => {
        const delay = Date.now() - now;
        console.log(`[REQUEST] ID: ${requestId} | ${method} ${url} - Completed in ${delay}ms`);
      }),
    );
  }
}
