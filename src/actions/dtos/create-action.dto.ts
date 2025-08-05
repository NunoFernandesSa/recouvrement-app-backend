import { OmitType } from '@nestjs/mapped-types';
import { ActionBaseDto } from './action-base.dto';

export class CreateActionDto extends OmitType(ActionBaseDto, [
  'id',
  'createdAt',
  'updatedAt',
  'userId',
]) {}
