import { LoginDto } from './dtos/login.dto';
import { AuthLoginService } from './services/auth-login.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private readonly authLoginService: AuthLoginService) {}

  async userLogin(dto: LoginDto): Promise<any> {
    return await this.authLoginService.login(dto);
  }
}
