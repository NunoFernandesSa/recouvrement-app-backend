import { HttpException, HttpStatus } from '@nestjs/common';

export default class MyServicesError extends HttpException {
  constructor(
    message: string,
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super(message, status);
    this.name = 'UserServiceError';
  }
}
