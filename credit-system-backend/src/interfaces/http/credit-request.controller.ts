import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
} from '@nestjs/common';
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
  async create(@Req() req, @Body() dto: CreateCreditRequestDto) {
    const result = await this.creditRequestService.create(dto, req.user.id);

    return {
      id: result.id,
      status: result.status,
      amount: result.amount,
      currency: result.currency,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.REVIEWER)
  async getAll() {
    return this.creditRequestService.getAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.REVIEWER)
  async getById(@Param('id') id: string) {
    return this.creditRequestService.getById(id);
  }

  @Get('country/:countryId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.REVIEWER)
  async getByCountry(@Param('countryId') countryId: string) {
    return this.creditRequestService.getByCountry(countryId);
  }
}
