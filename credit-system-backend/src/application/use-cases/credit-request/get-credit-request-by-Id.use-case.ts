import { Inject, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CacheKeys } from 'src/application/cache/cache.keys';
import { CreditRequest } from 'src/domain/entities/credit-request.entity';
import { CacheService } from 'src/domain/interfaces/cache.interface';
import { CreditRequestRepository } from 'src/domain/interfaces/repositories/credit-request.repository';
import { REDIS_SERVICE_TOKEN } from 'src/infrastructure/cache/redis.service';

export class GetCreditRequestByIdUseCase {
  constructor(
    private readonly creditRequestRepository: CreditRequestRepository,
    @Inject(REDIS_SERVICE_TOKEN)
    private cache: CacheService,
  ) {}

  async execute(id: string) {
    const key = CacheKeys.creditDetail(id);

    const cached = await this.cache.get(key);
    if (cached) return cached;

    const credit = await this.creditRequestRepository.findById(id);
    console.log('credit en detalle devuelve: ', credit);
    if (!credit)
      throw new NotFoundException('El credito seleccionado no está disponible');

    await this.cache.set(key, credit, 120);

    return credit;
  }
}
