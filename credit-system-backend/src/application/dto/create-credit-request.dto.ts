import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

export class CreateCreditRequestDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @Length(3, 3)
  currency: string;

  @IsString()
  @IsNotEmpty()
  applicantName: string;

  @IsEmail()
  applicantEmail: string;

  @IsNotEmpty()
  document: string;

  @IsString()
  @IsNotEmpty()
  countryId: string;
}
