import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CreditRequestService } from 'src/application/services/credit-request.service';
import { CreateCreditRequestDto } from 'src/application/dto/create-credit-request.dto';
import { JwtAuthGuard } from 'src/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from 'src/infrastructure/auth/roles.guard';
import { Roles } from 'src/infrastructure/auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('credit-request')
export class CreditRequestController {
  constructor(private readonly creditRequestService: CreditRequestService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  async create(@Body() dto: CreateCreditRequestDto) {
    const result = await this.creditRequestService.create(dto);

    return {
      id: result.id,
      status: result.status,
      amount: result.amount,
      currency: result.currency,
    };
  }
}
