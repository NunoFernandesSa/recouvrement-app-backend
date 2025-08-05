import { Module } from '@nestjs/common';
import { ActionsController } from './actions.controller';
import { ActionsService } from './actions.service';
import { CreateActionService } from './services/create-action.service';
import { PrismaService } from 'src/prisma.service';
import { FindManyActionsService } from './services/find-many-actions.service';

@Module({
  controllers: [ActionsController],
  providers: [
    ActionsService,
    CreateActionService,
    FindManyActionsService,
    PrismaService,
  ],
  exports: [ActionsService],
})
export class ActionsModule {}
