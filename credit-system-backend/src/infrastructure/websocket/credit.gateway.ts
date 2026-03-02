import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class CreditGateway {
  @WebSocketServer()
  server: Server;

  emit(event: string, payload: any) {
    this.server.emit(event, payload);
  }
}
