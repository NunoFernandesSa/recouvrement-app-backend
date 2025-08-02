import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import MyServicesError from 'src/errors/my-services.error';
import { PrismaService } from 'src/prisma.service';
import { DebtorResponseDto } from '../dtos/debtor-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class FindOneDebtorService {
  constructor(private readonly prisma: PrismaService) {}
  /**
   * Service for finding a debtor by their ID
   * @class FindOneDebtorService
   */

  async findOneDebtor(id: string): Promise<DebtorResponseDto> {
    try {
      // Check if debtor exists
      // If not, throw error
      const existingDebtor = await this.prisma.debtor.findUnique({
        where: {
          id: id,
        },
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
          debt: {
            select: {
              id: true,
              state: true,
              invoiceNumber: true,
            },
          },
        },
      });
      if (!existingDebtor) {
        throw new MyServicesError(`Debtor not found`, HttpStatus.NOT_FOUND);
      }

      return plainToInstance(DebtorResponseDto, existingDebtor);
    } catch (error) {
      if (error instanceof Error) {
        throw new MyServicesError(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      throw new InternalServerErrorException(
        'An unknown error occurred while trying to find the debtor',
      );
    }
  }
}
