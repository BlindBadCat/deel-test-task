import { Inject, Injectable } from '@nestjs/common';
import { Profile } from '../../core/db/models/profile.model';

@Injectable()
export class ProfileService {
  constructor(
    @Inject(Profile.name)
    private profile: typeof Profile
  ) {}

  async getProfiles(): Promise<Profile[]> {
    return this.profile.findAll();
  }
}
