import { HttpStatus, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import MyServicesError from 'src/errors/my-services.error';
import { PrismaService } from 'src/prisma.service';
import { ActionResponseDto } from '../dtos/action-response.dto';

@Injectable()
/**
 * Service responsible for retrieving a single action from the database
 *
 * @class FindOneActionService
 * @description Provides functionality to find and return a specific action by its ID
 */
export class FindOneActionService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves a single action from the database by its ID
   *
   * @param id - The unique identifier of the action to retrieve
   * @returns A promise that resolves to an ActionResponseDto containing the action details
   * @throws MyServicesError if the action is not found or if an error occurs during the operation
   */
  async findOneAction(id: string): Promise<ActionResponseDto> {
    try {
      const existingAction = await this.prisma.action.findUnique({
        where: {
          id: id,
        },
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

      if (!existingAction) {
        throw new MyServicesError('No action found', HttpStatus.NOT_FOUND);
      }

      return plainToInstance(ActionResponseDto, existingAction);
    } catch (error) {
      throw new MyServicesError(
        error instanceof Error
          ? error.message
          : 'An unknown error occurred while trying to find the action',
      );
    }
  }
}
