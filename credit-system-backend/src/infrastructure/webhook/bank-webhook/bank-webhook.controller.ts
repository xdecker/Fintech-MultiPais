import { Body, Controller, Post } from '@nestjs/common';
import { ProcessBankWebhookUseCase } from 'src/application/use-cases/webhook/process-bank-webhook.use-case';
import { BankWebhookService } from './bank-webhook.service';

@Controller('webhooks')
export class BankWebhookController {
  constructor(private readonly bankWebhookService: BankWebhookService) {}

  @Post('bank-result')
  async handle(@Body() body: any) {
    await this.bankWebhookService.handle(body);
    return { ok: true };
  }
}
