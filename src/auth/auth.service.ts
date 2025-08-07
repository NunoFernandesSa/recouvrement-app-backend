import { AuthRegisterService } from './services/auth-register.service';
import { LoginDto } from './dtos/login.dto';
import { AuthLoginService } from './services/auth-login.service';
import { Injectable } from '@nestjs/common';
import { VerifyUserService } from './services/verifyUser.service';
import { User } from 'generated/prisma';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly authLoginService: AuthLoginService,
    private readonly authRegisterService: AuthRegisterService,
    private readonly verifyUserService: VerifyUserService,
  ) {}

  async verifyUser(email: string, password: string) {
    return await this.verifyUserService.verifyUser(email, password);
  }

  // ----- Login -----
  async userLogin(user: User, response: Response) {
    return await this.authLoginService.login(user, response);
  }

  // ----- Register -----
  async userRegister(dto: LoginDto): Promise<any> {
    return await this.authRegisterService.register(dto);
  }
}
