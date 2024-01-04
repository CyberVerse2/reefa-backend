import AppError from '../utils/appError';
import { ENVIRONMENT } from './environment';
import { DataSource } from 'typeorm';

export const Reefa = new DataSource({
  url: ENVIRONMENT.DB.URL,
  entities: ['src/entity/*.js'],
  database: 'Reefa',
  logging: true,
  synchronize: ENVIRONMENT.APP.ENV === 'local' ? true : false
});

export function initializeDB() {
  Reefa.initialize()
    .then(() => console.log('Reefa DB has been initialized'))
    .catch((err: AppError) => {
      throw new AppError('Error During Data Source Initialization');
    });
}
