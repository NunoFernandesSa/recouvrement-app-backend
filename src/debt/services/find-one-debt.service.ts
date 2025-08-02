import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { DebtResponseDto } from '../dtos/debt-response.dto';
import MyServicesError from 'src/errors/my-services.error';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class FindOneDebtService {
  constructor(private readonly prisma: PrismaService) {}

  async findOneDebt(id: string): Promise<DebtResponseDto> {
    try {
      // find the debt in the database and check if it exists
      const existingDebt = await this.prisma.debt.findUnique({
        where: { id },
        include: {
          debtor: true,
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
        'An unexpected error occurred while retrieving the debt',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
