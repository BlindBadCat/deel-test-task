import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './core/db/db.module';
import { ContractModule } from './features/contract/contract.module';
import { ProfileModule } from './features/profile/profile.module';

@Module({
  imports: [
    DatabaseModule,
    ProfileModule,
    ContractModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
