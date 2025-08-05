import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UpdateDebtDto } from '../dtos/update-debt.dto';
import MyServicesError from 'src/errors/my-services.error';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UpdateDebtService {
  constructor(private readonly prisma: PrismaService) {}

  async updateDebt(
    id: string,
    data: UpdateDebtDto,
  ): Promise<{ message: string; data: UpdateDebtDto }> {
    try {
      const existingDebt = await this.prisma.debt.findUnique({
        where: {
          id,
        },
      });

      if (!existingDebt) {
        throw new MyServicesError('Debt not found', HttpStatus.NOT_FOUND);
      }

      const updatedDebt = await this.prisma.debt.update({
        where: {
          id,
        },
        data,
      });

      return {
        message: 'Debt updated successfully',
        data: plainToInstance(UpdateDebtDto, updatedDebt),
      };
    } catch (error) {
      throw new MyServicesError(
        error instanceof Error ? error.message : 'Error on update debt',
      );
    }
  }
}
