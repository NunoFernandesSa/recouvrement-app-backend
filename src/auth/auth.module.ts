import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthLoginService } from './services/auth-login.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthRegisterService } from './services/auth-register.service';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    AuthLoginService,
    AuthRegisterService,
    JwtStrategy,
    JwtRefreshStrategy,
    JwtAuthGuard,
    JwtRefreshGuard,
  ],
  exports: [AuthService, JwtAuthGuard, JwtRefreshGuard],
})
export class AuthModule {}
