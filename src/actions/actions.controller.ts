import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ActionsService } from './actions.service';
import { CreateActionDto } from './dtos/create-action.dto';
import { ActionResponseDto } from './dtos/action-response.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('actions')
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  @Post('new')
  async create(
    @Req() req: Request,
    @Body() data: CreateActionDto,
  ): Promise<ActionResponseDto> {
    const user = req['user'] as { id: string };
    if (!user?.id) {
      throw new Error('User ID is required');
    }
    return this.actionsService.createAction(user.id, data);
  }

  @Get()
  async findMany(): Promise<ActionResponseDto[]> {
    return this.actionsService.findManyActions();
  }
}
