import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from 'pg';
import { CacheKeys, LIST_VERSION_KEY } from 'src/application/cache/cache.keys';
import { CacheService } from 'src/domain/interfaces/cache.interface';
import { REDIS_SERVICE_TOKEN } from 'src/infrastructure/cache/redis.service';
import { logger } from 'src/shared/logger/pino.logger';

@Injectable()
export class PostgresListenerService implements OnModuleInit {
  private client: Client;
  constructor(
    @Inject(REDIS_SERVICE_TOKEN)
    private cache: CacheService,
  ) {}

  async onModuleInit() {
    this.client = new Client({
      connectionString: process.env.DATABASE_URL,
    });

    await this.client.connect();

    await this.client.query('LISTEN credit_status_changed');

    logger.info('Listening to Postgres notifications...');

    this.client.on('notification', async (msg) => {
      if (msg.channel === 'credit_status_changed') {
        const payload = JSON.parse(msg.payload!);

        logger.info(payload, 'DB EVENT RECEIVED');

        // 👇 AQUÍ reaccionas
        await this.handleStatusChanged(payload);
      }
    });
  }

  private async handleStatusChanged(event: any) {
    const { creditRequestId } = event;
    await this.cache.del(CacheKeys.creditDetail(creditRequestId));

    // bump list cache version
    await this.cache.incr(LIST_VERSION_KEY);
  }
}
