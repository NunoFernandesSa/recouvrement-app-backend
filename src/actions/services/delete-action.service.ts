import { HttpStatus, Injectable } from '@nestjs/common';
import MyServicesError from 'src/errors/my-services.error';
import { PrismaService } from 'src/prisma.service';

@Injectable()
/**
 * Service responsible for handling the deletion of actions from the database
 *
 * @class DeleteActionService
 * @description Provides functionality to safely remove action records while
 */
export class DeleteActionService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Deletes an action from the database by its ID
   *
   * @param id - The unique identifier of the action to delete
   * @returns A promise resolving to an object containing a success message and status
   * @throws MyServicesError if the action is not found or if deletion fails
   */
  async deleteAction(
    id: string,
  ): Promise<{ message: string; success: boolean }> {
    try {
      const existingAction = await this.prisma.action.findUnique({
        where: {
          id: id,
        },
      });

      if (!existingAction) {
        throw new MyServicesError('Action not found', HttpStatus.NOT_FOUND);
      }

      const actionDeleted = await this.prisma.action.delete({
        where: {
          id: id,
        },
      });

      return {
        message: `Action 'ID: ${actionDeleted.id}, NAME: ${actionDeleted.title}' deleted successfully`,
        success: true,
      };
    } catch (error) {
      throw new MyServicesError(
        error instanceof Error
          ? error.message
          : 'Internal server error while deleting action',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
