import { AllowNull, BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Contract } from './contract.model';

export enum EProfileType {
  client = 'client',
  contractor = 'contractor',
}


@Table
export class Job extends Model {
  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  description: string;

  @Column({
    type: DataType.DECIMAL(12, 2)
  })
  price: number;

  @Column({ defaultValue: false })
  paid: boolean;

  @Column({ type: DataType.DATE })
  paymentDate: Date;

  @BelongsTo(() => Contract)
  Contract: Contract;

  @ForeignKey(() => Contract)
  @Column
  contractId: number;
}

