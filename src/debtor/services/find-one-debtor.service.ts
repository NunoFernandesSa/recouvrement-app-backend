import { HttpStatus, Injectable } from '@nestjs/common';
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

  /**
   * Finds a debtor by their ID and returns their information
   * @param id - The unique identifier of the debtor to find
   * @returns A Promise containing the debtor's information in DebtorResponseDto format
   * @throws MyServicesError with NOT_FOUND status if debtor doesn't exist
   * @throws MyServicesError with INTERNAL_SERVER_ERROR status if any other error occurs
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
      throw new MyServicesError(
        error instanceof Error
          ? error.message
          : 'An unknown error occurred while trying to find the debtor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
