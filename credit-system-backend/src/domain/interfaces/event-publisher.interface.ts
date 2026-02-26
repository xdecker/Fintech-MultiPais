export interface EventPublisher {
  publish(event: DomainEvent): Promise<void>;
}

export interface DomainEvent {
  name: string;
  payload: any;
}
