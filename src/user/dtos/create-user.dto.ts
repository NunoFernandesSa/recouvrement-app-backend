import { PickType } from '@nestjs/mapped-types';
import { BaseUserDto } from './base-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto extends PickType(BaseUserDto, [
  'name',
  'email',
  'password',
]) {
  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
    required: false,
  })
  name: string;

  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User password (min 8 characters)',
    example: 'secret123',
  })
  password: string;
}
