import { Controller, Get, Param } from '@nestjs/common';
import { Contract } from '../../core/db/models/contract.model';
import { ContractService } from './contract.service';

@Controller('contracts')
export class ContractController {
  constructor(
    private readonly contractService: ContractService
  ) {
  }

  @Get('/:id')
  async getContractById(@Param() { id }: { id: number }): Promise<Contract[]> {
    return this.contractService.getContractById(id, 1);
  }
}
