import { ActionsService } from './actions.service';
import { CreateActionDto } from './dtos/create-action.dto';
import { ActionResponseDto } from './dtos/action-response.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller('actions')
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  @ApiOperation({
    summary: 'Create a new action',
    description: 'Create a new action record',
  })
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

  @ApiOperation({
    summary: 'Get all actions',
    description: 'Retrieve all action records',
  })
  @Get()
  async findMany(): Promise<ActionResponseDto[]> {
    return this.actionsService.findManyActions();
  }

  @ApiOperation({
    summary: 'Get an action by ID',
    description: 'Retrieve a specific action record by its unique ID',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ActionResponseDto> {
    return this.actionsService.findOneAction(id);
  }

  @ApiOperation({
    summary: 'Get an action detail by ID',
    description: 'Retrieve a specific action record detail by its unique ID',
  })
  @Get(':id/detail')
  async findOneActionDetail(
    @Param('id') id: string,
  ): Promise<ActionResponseDto> {
    return this.actionsService.findOneActionDetail(id);
  }
}
