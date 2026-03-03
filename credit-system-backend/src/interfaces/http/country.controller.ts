import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { CountryService } from 'src/application/services/country.service';
import { JwtAuthGuard } from 'src/infrastructure/auth/jwt-auth.guard';

@Controller('country')
@UseGuards(JwtAuthGuard)
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  async getAll(@Req() req) {
    return this.countryService.getAllAssigned(req.user.id);
  }
}
