import { HttpStatus, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import MyServicesError from 'src/errors/my-services.error';
import { PrismaService } from 'src/prisma.service';
import { DebtResponseDto } from '../dtos/debt-response.dto';

@Injectable()
export class FindOneDebtDetailService {
  constructor(private readonly prisma: PrismaService) {}

  async findOneDebtDetail(id: string): Promise<DebtResponseDto> {
    try {
      // find the debt in the database and check if it exists
      const existingDebt = await this.prisma.debt.findUnique({
        where: { id },
        select: {
          id: true,
          invoiceNumber: true,
          amountHT: true,
          amountTTC: true,
          amountPaid: true,
          amountRemaining: true,
          amountOverdue: true,
          dueDate: true,
          state: true,
          notes: true,
          lastReminderSentAt: true,
          createdAt: true,
          updatedAt: true,
          debtor: {
            select: {
              id: true,
              reference: true,
              name: true,
              email: true,
              phone: true,
              address: true,
              city: true,
              zipcode: true,
              country: true,
              siret: true,
              type: true,
              status: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

      if (!existingDebt) {
        throw new MyServicesError(
          `Debt with id '${id}' not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return plainToInstance(DebtResponseDto, existingDebt);
    } catch (error) {
      if (error instanceof Error) {
        throw new MyServicesError(error.message);
      }

      throw new MyServicesError(
        'An unexpected error occurred while retrieving the debt detail',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
