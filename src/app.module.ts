import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ClientsModule } from './clients/clients.module';

@Module({
  imports: [UserModule, ClientsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
