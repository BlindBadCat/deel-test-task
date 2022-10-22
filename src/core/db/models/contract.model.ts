import { AllowNull, BelongsTo, Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Job } from './job.model';
import { Profile } from './profile.model';

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

  @BelongsTo(() => Profile, 'ContractorId')
  Contractor: Profile;

  @BelongsTo(() => Profile, 'ClientId')
  Client: Profile;

  @HasMany(() => Job)
  Jobs: Job[];
}

