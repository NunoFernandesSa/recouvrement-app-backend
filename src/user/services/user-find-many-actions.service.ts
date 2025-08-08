import { HttpStatus, Injectable } from '@nestjs/common';
import MyServicesError from 'src/errors/my-services.error';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserFindManyActionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findManyActions(id: string): Promise<any> {
    try {
      // find all actions of a user
      const actions = await this.prisma.action.findMany({
        where: {
          userId: id,
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
        },
      });

      if (!actions) {
        throw new MyServicesError('No actions found', HttpStatus.NOT_FOUND);
      }

      return actions;
    } catch (error) {
      throw new MyServicesError(
        error instanceof Error
          ? error.message
          : 'Error while finding all actions for this user',
      );
    }
  }
}
