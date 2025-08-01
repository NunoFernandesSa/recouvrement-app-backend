import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateDebtDto } from '../dtos/create-debt.dto';
import { DebtResponseDto } from '../dtos/debt-response.dto';
import { PrismaService } from 'src/prisma.service';
import MyServicesError from 'src/errors/my-services.error';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CreateDebtService {
  constructor(private readonly prisma: PrismaService) {}

  async createDebt(id: string, data: CreateDebtDto): Promise<DebtResponseDto> {
    // check if invoiceNumber exists
    if (!data.invoiceNumber) {
      throw new MyServicesError(
        'Invoice number is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    // check if amount exists
    if (!data.amountHT) {
      throw new MyServicesError('Amount is required', HttpStatus.BAD_REQUEST);
    }
    // check if amountHT is a number and greater than 0
    if (typeof data.amountHT !== 'number' || data.amountHT <= 0) {
      throw new MyServicesError(
        'AmountHT must be a number greater than 0',
        HttpStatus.BAD_REQUEST,
      );
    }

    // check if amountTTC exists
    if (!data.amountTTC) {
      throw new MyServicesError(
        'Amount TTC is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    // check if amountTTC is a number and greater than 0
    if (typeof data.amountTTC !== 'number' || data.amountTTC <= 0) {
      throw new MyServicesError(
        'AmountTTC must be a number greater than 0',
        HttpStatus.BAD_REQUEST,
      );
    }

    // check if dueDate exists
    if (!data.dueDate) {
      throw new MyServicesError('dueDate is required', HttpStatus.BAD_REQUEST);
    }

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
          state: 'PENDING',
        },
        include: {
          debtor: true,
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
        'An unknow error occurred while creating the debt',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
