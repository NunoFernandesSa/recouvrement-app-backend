import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ActionState } from 'generated/prisma';

export class ActionBaseDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsNotEmpty()
  state: ActionState;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  dueDate: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  completedAt: Date;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  createdAt: Date;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  updatedAt: Date;

  @IsString()
  @IsNotEmpty()
  debtorId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
