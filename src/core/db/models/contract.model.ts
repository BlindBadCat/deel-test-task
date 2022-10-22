import { AllowNull, Column, DataType, Model, Table } from 'sequelize-typescript';

export enum EContractStatus {
  new = 'new',
  in_progress = 'in_progress',
  terminated = 'terminated',
}

@Table
export class Contract extends Model {
  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  terms: string;

  @Column({
    type: DataType.ENUM,
    values: Object.values(EContractStatus),
  })
  status: EContractStatus;
}

