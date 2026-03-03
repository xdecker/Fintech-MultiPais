import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { CountryService } from 'src/application/services/country.service';
import { CreditRequestService } from 'src/application/services/credit-request.service';
import { JwtAuthGuard } from 'src/infrastructure/auth/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly creditRequestService: CreditRequestService) {}

  @Get()
  async getSummary() {
    return this.creditRequestService.getSummaryOfDashboard();
  }
}
