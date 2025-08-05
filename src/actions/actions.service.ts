import { Injectable } from '@nestjs/common';
import { CreateActionService } from './services/create-action.service';
import { CreateActionDto } from './dtos/create-action.dto';
import { ActionResponseDto } from './dtos/action-response.dto';

@Injectable()
export class ActionsService {
  constructor(private readonly createActionService: CreateActionService) {}

  async createAction(
    userId: string,
    data: CreateActionDto,
  ): Promise<ActionResponseDto> {
    return this.createActionService.createAction(userId, data);
  }
}
