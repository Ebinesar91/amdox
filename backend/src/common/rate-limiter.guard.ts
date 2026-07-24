import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { RedisService } from '../modules/redis/redis.service';

@Injectable()
export class RateLimiterGuard implements CanActivate {
  constructor(private readonly redisService: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip || request.headers['x-forwarded-for'] || 'unknown-ip';
    const key = `ratelimit:${ip}:${request.url}`;

    // Limit to 60 requests per minute
    const isLimited = await this.redisService.isRateLimited(key, 60, 60);
    if (isLimited) {
      throw new HttpException('Too Many Requests. Rate limit exceeded.', HttpStatus.TOO_MANY_REQUESTS);
    }

    return true;
  }
}
