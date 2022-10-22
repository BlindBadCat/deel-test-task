import { Sequelize } from 'sequelize-typescript';
import { Profile } from './models/profile.model';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: './database.sqlite3',
      });
      sequelize.addModels([Profile]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
