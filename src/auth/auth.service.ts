import { AuthRegisterService } from './services/auth-register.service';
import { LoginDto } from './dtos/login.dto';
import { AuthLoginService } from './services/auth-login.service';
import { Injectable } from '@nestjs/common';

@Injectable()
/**
 * Service handling authentication operations
 * @class AuthService
 *
 * @description
 * This service provides authentication functionality by coordinating with the AuthLoginService.
 * It acts as a facade for authentication-related operations like user login.
 *
 * @example
 * ```typescript
 * // Inject the service
 * constructor(private authService: AuthService) {}
 *
 * // Use the login method
 * const result = await authService.userLogin(loginDto);
 * ```
 */
export class AuthService {
  constructor(
    private readonly authLoginService: AuthLoginService,
    private readonly authRegisterService: AuthRegisterService,
  ) {}

  /**
   * Authentication service that handles user authentication operations
   * @class AuthService
   */
  async userLogin(dto: LoginDto): Promise<any> {
    return await this.authLoginService.login(dto);
  }

  /**
   * Authenticates a user by validating their credentials
   * @param dto - The login credentials DTO containing username/email and password
   * @returns Promise containing the authentication result (e.g. access token)
   *
   * @example
   * ```typescript
   * const loginDto = { email: 'user@example.com', password: 'password123' };
   * const result = await authService.userLogin(loginDto);
   * ```
   */
  async userRegister(dto: LoginDto): Promise<any> {
    return await this.authRegisterService.register(dto);
  }
}
