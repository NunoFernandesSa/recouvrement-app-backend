import { HttpStatus, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import MyServicesError from 'src/errors/my-services.error';
import { PrismaService } from 'src/prisma.service';
import { ActionResponseDto } from '../dtos/action-response.dto';

@Injectable()
export class FindManyActionsService {
  constructor(private readonly prisma: PrismaService) {}

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
