import { randomUUID } from 'crypto';
import { CreditRequest } from 'src/domain/entities/credit-request.entity';
import { CreditRequestRepository } from 'src/domain/interfaces/repositories/credit-request.repository';
import { BadRequestException } from '@nestjs/common';
import { CreditRequestStatus } from 'src/domain/entities/enums/credit-request-status.enum';
import { CreditGateway } from 'src/infrastructure/websocket/credit.gateway';

export class UpdateStatusCreditUseCase {
  constructor(
    private readonly creditRequestRepository: CreditRequestRepository,
    private readonly creditGateway: CreditGateway,
  ) {}

  async execute(
    id: string,
    status: CreditRequestStatus,
    userId: string,
  ): Promise<CreditRequest> {
    let creditRequest = await this.creditRequestRepository.findById(id);

    if (!creditRequest)
      throw new BadRequestException('La solicitud seleccionada no es válida');

    creditRequest = await this.creditRequestRepository.changeStatus(id, status);

    await this.creditRequestRepository.addStatusHistory({
      creditRequestId: creditRequest.id,
      previousStatus: creditRequest.status,
      newStatus: status,
      changedById: userId,
    });

    this.creditGateway.emit('credit.updated', {
      id: creditRequest.id,
    });

    return creditRequest;
  }
}
