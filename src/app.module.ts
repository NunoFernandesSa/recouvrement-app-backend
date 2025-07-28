import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ClientsModule } from './clients/clients.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DebtorModule } from './debtor/debtor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // disponible partout sans import
    }),
    UserModule,
    ClientsModule,
    AuthModule,
    DebtorModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
