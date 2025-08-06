import { HttpStatus, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import MyServicesError from 'src/errors/my-services.error';
import { PrismaService } from 'src/prisma.service';
import { ActionResponseDto } from '../dtos/action-response.dto';

@Injectable()
/**
 * Service responsible for finding many actions in the system.
 * Handles the retrieval of action records with associated user and debtor relationships.
 *
 * @class FindManyActionsService
 * @description Provides functionality to find many actions with proper error handling and data validation
 */
export class FindManyActionsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves multiple actions from the system
   *
   * @description Fetches all actions from the database with their basic properties
   * @returns Promise<ActionResponseDto[]> Array of action objects transformed into DTOs
   * @throws {MyServicesError} When no actions are found (404) or on server errors (500)
   */
  async findManyActions(): Promise<ActionResponseDto[]> {
    try {
      const existingActions = await this.prisma.action.findMany({
        select: {
          id: true,
          title: true,
          description: true,
          state: true,
          dueDate: true,
          completedAt: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!existingActions) {
        throw new MyServicesError('No actions found', HttpStatus.NOT_FOUND);
      }

      return plainToInstance(ActionResponseDto, existingActions);
    } catch (error) {
      throw new MyServicesError(
        error instanceof Error
          ? error.message
          : 'Internal server error while fetching actions',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
