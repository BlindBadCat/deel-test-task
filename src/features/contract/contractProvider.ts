import { Contract } from '../../core/db/models/contract.model';


export const contractProviders = [
  {
    provide: Contract.name,
    useValue: Contract,
  }
]
