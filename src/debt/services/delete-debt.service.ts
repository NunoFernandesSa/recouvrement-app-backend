import { HttpStatus, Injectable } from '@nestjs/common';
import MyServicesError from 'src/errors/my-services.error';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class DeleteDebtService {
  constructor(private readonly prisma: PrismaService) {}
  /**
   * Service to delete a debt by its ID
   * @class DeleteDebtService
   */

  /**
   * Deletes a debt by its ID
   * @param {string} id - The ID of the debt to delete
   * @returns {Promise<{ message: string }>} A message indicating the success of the deletion
   * @throws {MyServicesError} When the debt with the specified ID is not found
   * @throws {MyServicesError} When there's an error during deletion with status 500
   */
  async deleteDebt(id: string): Promise<{ message: string }> {
    const existingDebt = await this.prisma.debt.findUnique({
      where: { id },
      select: {
        id: true,
      },
    });

    if (!existingDebt) {
      throw new MyServicesError(
        `Debt with id '${id}' not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      const deletedDebt = await this.prisma.debt.delete({
        where: { id },
      });

      return {
        message: `Debt with id '${deletedDebt.id}' deleted successfully`,
      };
    } catch (error) {
      throw new MyServicesError(
        error instanceof Error ? error.message : 'Error deleting debt',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
