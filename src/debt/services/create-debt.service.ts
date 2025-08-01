import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateDebtDto } from '../dtos/create-debt.dto';
import { DebtResponseDto } from '../dtos/debt-response.dto';
import { PrismaService } from 'src/prisma.service';
import MyServicesError from 'src/errors/my-services.error';
import { plainToInstance } from 'class-transformer';
import { DebtState } from 'generated/prisma';

@Injectable()
export class CreateDebtService {
  constructor(private readonly prisma: PrismaService) {}

  async createDebt(id: string, data: CreateDebtDto): Promise<DebtResponseDto> {
    try {
      // check if debt already exists
      // if it does, throw an error
      const existingDebt = await this.prisma.debt.findFirst({
        where: {
          invoiceNumber: data.invoiceNumber,
        },
        select: {
          invoiceNumber: true,
        },
      });

      if (existingDebt) {
        throw new MyServicesError(
          'A debt with this invoice number already exists',
          HttpStatus.CONFLICT,
        );
      }

      // create the debt
      const createdDebt = await this.prisma.debt.create({
        data: {
          ...data,
          state: data.state as DebtState,
        },
      });

      // return the created debt with the correct type
      return plainToInstance(DebtResponseDto, createdDebt);
    } catch (error) {
      if (error instanceof Error) {
        throw new MyServicesError(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      throw new MyServicesError(
        'An error occurred while creating the debt',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
