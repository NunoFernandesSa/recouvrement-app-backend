import { HttpStatus, Injectable } from '@nestjs/common';
import MyServicesError from 'src/errors/my-services.error';
import { PrismaService } from 'src/prisma.service';
import { DebtorResponseDto } from '../dtos/debtor-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class FindManyDebtorsService {
  constructor(private readonly prisma: PrismaService) {}

  async findManyDebtors(): Promise<DebtorResponseDto[]> {
    const existingDebtors = await this.prisma.debtor.findMany({
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
        client: {
          select: {
            id: true,
            internalRef: true,
            name: true,
          },
        },
      },
    });

    if (!existingDebtors) {
      throw new MyServicesError('No debtors found', HttpStatus.NOT_FOUND);
    }

    return plainToInstance(DebtorResponseDto, existingDebtors);
  }
}
