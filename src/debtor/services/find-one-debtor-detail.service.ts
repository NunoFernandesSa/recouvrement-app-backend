import { HttpStatus, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import MyServicesError from 'src/errors/my-services.error';
import { PrismaService } from 'src/prisma.service';
import { DebtorResponseDto } from '../dtos/debtor-response.dto';

@Injectable()
export class FindOneDebtorDetailService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Service for retrieving a single debtor with detailed information from the database
   * @class FindOneDebtorDetailService
   */

  /**
   * Retrieves detailed information for a single debtor by ID, including associated client, debt and actions
   *
   * @param {string} id - Unique identifier of the debtor
   * @returns {Promise<DebtorResponseDto>} Object containing:
   * - Basic debtor information (id, reference, name, contact details, etc.)
   * - Associated client details (id, reference, name, email)
   * - Linked debt information (id, state, invoice number)
   * - Related actions (id, title, description, state)
   *
   * @throws {MyServicesError}
   * - HttpStatus.NOT_FOUND if debtor with given ID does not exist
   * - HttpStatus.INTERNAL_SERVER_ERROR if database query fails or other errors occur
   */
  async findOneDebtorDetail(id: string): Promise<DebtorResponseDto> {
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
              email: true,
            },
          },
          debt: {
            select: {
              id: true,
              state: true,
              invoiceNumber: true,
            },
          },
          actions: {
            select: {
              id: true,
              title: true,
              description: true,
              state: true,
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
          : 'An unknown error occurred while trying to find the debtor detail',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
