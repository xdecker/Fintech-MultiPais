import { Injectable } from '@nestjs/common';
import { CreditGateway } from './credit.gateway';
import { EventPublisher, DomainEvent } from '../event-publisher.interface';

@Injectable()
export class WebsocketEventPublisher implements EventPublisher {
  constructor(private gateway: CreditGateway) {}

  async publish(event: DomainEvent): Promise<void> {
    this.gateway.emit(event.name, event.payload);
  }
}

export const EVENTPUBLISHER = "EventPublisher";
