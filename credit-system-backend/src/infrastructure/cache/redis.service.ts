import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { CacheService } from 'src/domain/interfaces/cache.interface';

@Injectable()
export class RedisService implements CacheService {
  private client = new Redis(process.env.REDIS_URL || 'redis://redis:6379');
  constructor() {
    console.log('Connecting to Redis at:', process.env.REDIS_URL);
  }
  async get<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set(key: string, value: unknown, ttl = 60): Promise<void> {
    await this.client.set(key, JSON.stringify(value), 'EX', ttl);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async incr(key: string): Promise<number> {
    return this.client.incr(key);
  }
}

export const REDIS_SERVICE_TOKEN = 'CacheService';
