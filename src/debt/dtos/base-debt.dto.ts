import { Exclude, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class BaseDebtDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  invoiceNumber: string;

  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  amountHT: number;

  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  amountTTC: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  amountPaid?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  amountRemaining?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  amountOverdue?: number;

  @IsDate()
  @Type(() => Date)
  dueDate: Date;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  notes: string[];

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  lastReminderSentAt: Date;

  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @IsDate()
  @Type(() => Date)
  updatedAt: Date;

  @IsString()
  @IsNotEmpty()
  debtorId: string;
}
