import { AllowNull, Column, DataType, Model, Table } from 'sequelize-typescript';

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
}

