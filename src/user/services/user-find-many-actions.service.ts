import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserFindManyActionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findManyActions(id: string): Promise<any> {
    // find all actions of a user
    await this.prisma.action.findMany({});

    return;
  }
}
