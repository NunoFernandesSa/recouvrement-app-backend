import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ClientsModule } from './clients/clients.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule, ClientsModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
