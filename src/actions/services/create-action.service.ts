import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateActionDto } from '../dtos/create-action.dto';
import MyServicesError from 'src/errors/my-services.error';
import { plainToInstance } from 'class-transformer';
import { ActionResponseDto } from '../dtos/action-response.dto';
import { ActionState } from 'generated/prisma';

@Injectable()
export class CreateActionService {
  constructor(private readonly prisma: PrismaService) {}
  /**
   * Service responsible for creating new actions in the system
   * @class CreateActionService
   */

  /**
   * Creates a new action for a given user
   * @param userId - The ID of the user creating the action
   * @param data - The action data containing title, description, state, etc.
   * @returns Promise containing the created action details
   */
  async createAction(
    userId: string,
    data: CreateActionDto,
  ): Promise<ActionResponseDto> {
    try {
      const createdAction = await this.prisma.action.create({
        data: {
          ...data,
          userId: userId,
          state: data.state ?? ActionState.PENDING,
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
              phone: true,
              address: true,
              createdAt: true,
              updatedAt: true,
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

      return plainToInstance(ActionResponseDto, createdAction);
    } catch (error) {
      throw new MyServicesError(
        error instanceof Error
          ? error.message
          : 'An unknown error occurred while trying to create the action',
      );
    }
  }
}
