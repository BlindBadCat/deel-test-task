import { AllowNull, Column, DataType, Model, Table } from 'sequelize-typescript';

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
}

