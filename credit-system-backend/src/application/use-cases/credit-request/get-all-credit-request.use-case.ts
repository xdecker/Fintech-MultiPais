import { Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CacheKeys, LIST_VERSION_KEY } from 'src/application/cache/cache.keys';
import { CreditRequest } from 'src/domain/entities/credit-request.entity';
import { CacheService } from 'src/domain/interfaces/cache.interface';
import { CreditRequestRepository } from 'src/domain/interfaces/repositories/credit-request.repository';
import { REDIS_SERVICE_TOKEN } from 'src/infrastructure/cache/redis.service';

export class GetAllCreditRequestsUseCase {
  constructor(
    private readonly creditRequestRepository: CreditRequestRepository,
    @Inject(REDIS_SERVICE_TOKEN)
    private cache: CacheService,
  ) {}

  async execute(page = 1, limit = 10) {
    const version = (await this.cache.get<number>(LIST_VERSION_KEY)) ?? 1;

    const key = CacheKeys.creditList(version, page, limit);

    const cached = await this.cache.get(key);
    if (cached) return cached;

    const result = await this.creditRequestRepository.findAll(page, limit);

    const response = {
      data: result.data,
      meta: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    };

    await this.cache.set(key, response, 60);

    return response;
  }
}
