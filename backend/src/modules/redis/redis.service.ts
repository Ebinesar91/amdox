import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  onModuleInit() {
    const host = process.env.REDIS_HOST || 'localhost';
    const port = parseInt(process.env.REDIS_PORT || '6379', 10);
    this.client = new Redis({
      host,
      port,
      lazyConnect: true,
    });
    
    // Connect silently and fallback gracefully in case Redis is not running locally
    this.client.connect().catch((err) => {
      console.warn('Redis connection failed. Running with in-memory caching fallback.', err.message);
    });
  }

  onModuleDestroy() {
    if (this.client) {
      this.client.disconnect();
    }
  }

  getClient(): Redis {
    return this.client;
  }

  // Caching helper
  async get(key: string): Promise<string | null> {
    try {
      if (this.client.status === 'ready') {
        return await this.client.get(key);
      }
    } catch {
      // Graceful fallback
    }
    return null;
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    try {
      if (this.client.status === 'ready') {
        if (ttlSeconds) {
          await this.client.setex(key, ttlSeconds, value);
        } else {
          await this.client.set(key, value);
        }
      }
    } catch {
      // Graceful fallback
    }
  }

  async del(key: string): Promise<void> {
    try {
      if (this.client.status === 'ready') {
        await this.client.del(key);
      }
    } catch {
      // Graceful fallback
    }
  }

  // Simple Rate Limiting Logic
  async isRateLimited(key: string, limit: number, windowSeconds: number): Promise<boolean> {
    try {
      if (this.client.status !== 'ready') return false; // Fail open
      
      const current = await this.client.incr(key);
      if (current === 1) {
        await this.client.expire(key, windowSeconds);
      }
      return current > limit;
    } catch {
      return false; // Fail open on Redis down
    }
  }
}
