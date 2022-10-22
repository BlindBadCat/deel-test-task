import { Injectable } from '@nestjs/common';
import { ProfileService } from './features/profile/profile.service';

@Injectable()
export class AppService {
  constructor(
    private readonly profileService: ProfileService,
  ) {
  }
  async getHello(): Promise<any> {
    return this.profileService.getProfiles();
  }
}
