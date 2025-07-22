import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthLoginService } from './services/auth-login.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthRegisterService } from './services/auth-register.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    AuthLoginService,
    JwtStrategy,
    AuthRegisterService,
  ],
})
export class AuthModule {}
