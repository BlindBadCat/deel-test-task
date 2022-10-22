import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../core/db/db.module';
import { ProfileService } from './profile.service';
import { profileProviders } from './profileProvider';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [
    ProfileService,
    ...profileProviders
  ],
  exports: [
    ProfileService,
  ]
})
export class ProfileModule {}
