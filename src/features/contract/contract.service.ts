import { Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { Contract } from '../../core/db/models/contract.model';

@Injectable()
export class ContractService {
  constructor(
    @Inject(Contract.name)
    private contract: typeof Contract,
  ) {}

  async getContractById(contractId: number, profileId: number): Promise<Contract[]> {
    return this.contract.findAll({
      where: {
        id: contractId,
        [Op.or]: [
          { ClientId: profileId },
          { ContractorId: profileId },
        ],
      },
    });
  }
}
