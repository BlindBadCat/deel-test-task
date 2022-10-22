import { Sequelize } from 'sequelize-typescript';
import { Contract } from './models/contract.model';
import { Profile } from './models/profile.model';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: './database.sqlite3',
      });
      sequelize.addModels([
        Profile,
        Contract,
      ]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
