import { HttpStatus, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import MyServicesError from 'src/errors/my-services.error';
import { PrismaService } from 'src/prisma.service';
import { ActionResponseDto } from '../dtos/action-response.dto';

@Injectable()
/**
 * Service responsible for retrieving detailed information about a specific action
 * @class FindOneActionDetailService
 * @description Provides functionality to fetch a single action with its associated debtor and user details
 */
export class FindOneActionDetailService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves detailed information about a specific action by its ID
   * @param id - The unique identifier of the action to find
   * @returns Promise containing the action details in ActionResponseDto format
   * @throws MyServicesError if action is not found or if an error occurs during the process
   */
  async findOneActionDetail(id: string): Promise<ActionResponseDto> {
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
          debtor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
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
