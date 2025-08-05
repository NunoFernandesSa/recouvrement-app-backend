import { HttpStatus, Injectable } from '@nestjs/common';
import MyServicesError from 'src/errors/my-services.error';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class DeleteDebtorService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Service for deleting Debtor from the system
   * @class DeleteDebtorService
   */

  /**
   * Deletes a debtor from the database by their ID
   * @param {string} id - The unique identifier of the debtor to delete
   * @returns {Promise<{message: string, success: boolean}>} A promise that resolves with a success message and status
   * @throws {MyServicesError} If debtor is not found (404) or deletion fails (500)
   */
  async deleteDebtor(
    id: string,
  ): Promise<{ message: string; success: boolean }> {
    try {
      // Check if debtor exists
      // If not, throw error
      const existingDebtor = await this.prisma.debtor.findUnique({
        where: {
          id: id,
        },
      });

      if (!existingDebtor) {
        throw new MyServicesError(`Debtor not found`, HttpStatus.NOT_FOUND);
      }

      // delete debtor
      const deletedDebtor = await this.prisma.debtor.delete({
        where: {
          id: id,
        },
      });

      return {
        message: `Debtor '${deletedDebtor.reference}' deleted successfully`,
        success: true,
      };
    } catch (error) {
      throw new MyServicesError(
        error instanceof Error
          ? error.message
          : 'An unknown error occurred while trying to delete the debtor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
