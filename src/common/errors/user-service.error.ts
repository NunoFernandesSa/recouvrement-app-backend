import { HttpException, HttpStatus } from '@nestjs/common';

export default class UserServiceError extends HttpException {
  constructor(
    message: string,
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super(message, status);
    this.name = 'UserServiceError';
  }
}
