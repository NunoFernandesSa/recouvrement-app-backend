import { Module } from '@nestjs/common';
import { ActionsController } from './actions.controller';
import { ActionsService } from './actions.service';
import { CreateActionService } from './services/create-action.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ActionsController],
  providers: [ActionsService, CreateActionService, PrismaService],
  exports: [ActionsService],
})
export class ActionsModule {}
