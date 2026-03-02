import { BadRequestException, Inject } from '@nestjs/common';
import { CacheKeys, LIST_VERSION_KEY } from 'src/application/cache/cache.keys';
import { CacheService } from 'src/domain/interfaces/cache.interface';
import { CreditRequestRepository } from 'src/domain/interfaces/repositories/credit-request.repository';
import { REDIS_SERVICE_TOKEN } from 'src/infrastructure/cache/redis.service';

export class DeleteCreditRequestByIdUseCase {
  constructor(
    private readonly creditRequestRepository: CreditRequestRepository,
    @Inject(REDIS_SERVICE_TOKEN)
    private cache: CacheService,
  ) {}

  async execute(id: string) {
    const creditRequest = await this.creditRequestRepository.findById(id);

    if (!creditRequest)
      throw new BadRequestException('La solicitud de credito no es válida');

    await this.creditRequestRepository.delete(id);

    await this.cache.del(CacheKeys.creditDetail(creditRequest.id));

    await this.cache.incr(LIST_VERSION_KEY);
  }
}
