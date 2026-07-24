import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: (exception as Error).message || 'Internal server error' };

    const requestId = request.headers['x-request-id'] || 'system';

    const normalizedResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      requestId,
      ...(typeof message === 'object' ? message : { message }),
    };

    response.status(status).json(normalizedResponse);
  }
}
