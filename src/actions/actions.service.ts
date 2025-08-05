import { Injectable } from '@nestjs/common';
import { CreateActionService } from './services/create-action.service';
import { FindManyActionsService } from './services/find-many-actions.service';
import { CreateActionDto } from './dtos/create-action.dto';
import { ActionResponseDto } from './dtos/action-response.dto';

@Injectable()
export class ActionsService {
  constructor(
    private readonly createActionService: CreateActionService,
    private readonly findManyActionsService: FindManyActionsService,
  ) {}

  async createAction(
    userId: string,
    data: CreateActionDto,
  ): Promise<ActionResponseDto> {
    return this.createActionService.createAction(userId, data);
  }

  async findManyActions(): Promise<ActionResponseDto[]> {
    return this.findManyActionsService.findManyActions();
  }
}
