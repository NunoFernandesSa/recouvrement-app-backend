import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import MyServicesError from 'src/errors/my-services.error';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class VerifyUserService {
  constructor(private readonly userService: UserService) {}

  async verifyUser(email: string, password: string) {
    try {
      const user = await this.userService.getUser(email);

      if (!user) {
        throw new MyServicesError(
          'This user does not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (!user.isActive) {
        throw new UnauthorizedException('This user is not active');
      }

      const authenticated = await bcrypt.compare(password, user.password);

      if (!authenticated) {
        throw new MyServicesError(
          'Password not match',
          HttpStatus.UNAUTHORIZED,
        );
      }
      return user;
    } catch (error) {
      throw new MyServicesError(
        error instanceof Error ? error.message : 'Credentials are not valid',
      );
    }
  }
}
