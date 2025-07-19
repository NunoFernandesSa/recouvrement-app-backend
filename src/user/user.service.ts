import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  findall(): string {
    return 'This action returns all users';
  }
}
