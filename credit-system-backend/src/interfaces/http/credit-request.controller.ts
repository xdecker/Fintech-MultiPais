import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
  Query,
  Delete,
  Patch,
} from '@nestjs/common';
import { CreditRequestService } from 'src/application/services/credit-request.service';
import { CreateCreditRequestDto } from 'src/application/dto/create-credit-request.dto';
import { JwtAuthGuard } from 'src/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from 'src/infrastructure/auth/roles.guard';
import { Roles } from 'src/infrastructure/auth/roles.decorator';
import { Role } from '@prisma/client';
import { CreditRequestStatus } from 'src/domain/entities/enums/credit-request-status.enum';

@Controller('credit-request')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CreditRequestController {
  constructor(private readonly creditRequestService: CreditRequestService) {}

  @Post()
  @Roles(Role.ADMIN, Role.USER, Role.REVIEWER)
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
  @Roles(Role.ADMIN, Role.USER, Role.REVIEWER)
  async getAll(@Query('page') page = 1, @Query('limit') limit = 10, @Req() req) {
    return this.creditRequestService.getAll(page, limit, req.user.id);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.USER, Role.REVIEWER)
  async getById(@Param('id') id: string) {
    return this.creditRequestService.getById(id);
  }

  @Get('country/:countryId')
  @Roles(Role.ADMIN, Role.USER, Role.REVIEWER)
  async getByCountry(@Param('countryId') countryId: string) {
    return this.creditRequestService.getByCountry(countryId);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async delete(@Param('id') id: string) {
    return this.creditRequestService.delete(id);
  }

  @Patch('status/:id')
  @Roles(Role.ADMIN, Role.REVIEWER)
  async updateStatus(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: { status: CreditRequestStatus },
  ) {
    return this.creditRequestService.updateStatus(id, dto.status, req.user.id);
  }
}
