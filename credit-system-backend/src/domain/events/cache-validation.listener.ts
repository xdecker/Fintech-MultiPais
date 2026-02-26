import { Injectable } from '@nestjs/common';
import { EventPublisher } from 'src/domain/interfaces/event-publisher.interface';
import { CacheService } from 'src/domain/interfaces/cache.interface';
import { CREDIT_EVENTS } from './credit-events';
import { CacheKeys } from 'src/application/cache/cache.keys';

@Injectable()
export class CacheInvalidationListener {
  constructor(private cache: CacheService) {}

  async handle(eventName: string, payload: any) {
    if (eventName === CREDIT_EVENTS.STATUS_CHANGED) {
      await this.cache.del(CacheKeys.creditDetail(payload.creditRequestId));

      // invalidamos listas (simple version)
      // en producción usarías tags/versioning
      await this.cache.del('credits:list:*');
    }
  }
}
