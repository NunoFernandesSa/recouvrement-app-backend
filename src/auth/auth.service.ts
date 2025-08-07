import { AuthRegisterService } from './services/auth-register.service';
import { LoginDto } from './dtos/login.dto';
import { AuthLoginService } from './services/auth-login.service';
import { Injectable } from '@nestjs/common';
import { VerifyUserService } from './services/verifyUser.service';

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

  async userLogin(dto: LoginDto): Promise<any> {
    return await this.authLoginService.login(dto);
  }

  async userRegister(dto: LoginDto): Promise<any> {
    return await this.authRegisterService.register(dto);
  }
}
