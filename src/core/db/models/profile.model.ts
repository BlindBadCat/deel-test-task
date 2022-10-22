import { AllowNull, Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Contract } from './contract.model';

export enum EProfileType {
  client = 'client',
  contractor = 'contractor',
}


@Table
export class Profile extends Model {
  @AllowNull(false)
  @Column
  firstName: string;

  @AllowNull(false)
  @Column
  lastName: string;

  @AllowNull(false)
  @Column
  profession: string;

  @Column({
    type: DataType.DECIMAL(12, 2)
  })
  balance: number;

  @Column({
    type: DataType.ENUM,
    values: Object.values(EProfileType),
  })
  type: EProfileType;

  @HasMany(() => Contract, 'ContractorId')
  Contractor: Contract[];

  @HasMany(() => Contract, 'ClientId')
  Client: Contract[];
}

