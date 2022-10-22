import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../core/db/db.module';
import { ContractController } from './contract.controller';
import { ContractService } from './contract.service';
import { contractProviders } from './contractProvider';

@Module({
  imports: [DatabaseModule],
  controllers: [ContractController],
  providers: [
    ContractService,
    ...contractProviders
  ],
  exports: [
    ContractService,
  ]
})
export class ContractModule {}
