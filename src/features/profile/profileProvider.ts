import { Profile } from '../../core/db/models/profile.model';


export const profileProviders = [
  {
    provide: Profile.name,
    useValue: Profile,
  }
]
