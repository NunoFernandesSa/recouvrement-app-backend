import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthLoginService } from './services/auth-login.service';
import { AuthRegisterService } from './services/auth-register.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshTokenGuard } from './guards/jwt-refresh.guard';
import { PassportModule } from '@nestjs/passport';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { VerifyUserService } from './services/verifyUser.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: '1m' },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    AuthLoginService,
    AuthRegisterService,
    LocalAuthGuard,
    JwtAuthGuard,
    RefreshTokenGuard,
    VerifyUserService,
  ],
  exports: [AuthService, JwtAuthGuard, RefreshTokenGuard],
})
export class AuthModule {}
