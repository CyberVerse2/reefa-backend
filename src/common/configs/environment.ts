import * as dotenv from 'dotenv';
import { IEnvironment } from '../interfaces/Ienvironment';
dotenv.config();

export const ENVIRONMENT: IEnvironment = {
  APP: {
    NAME: process.env.APP_NAME!,
    PORT: parseInt(process.env.PORT || '3000'),
    ENV: process.env.APP_ENV!
  },
  DB: {
    URL: process.env.POSTGRES_URL!
  },
  JWT: {
    ACCESS_KEY: process.env.ACCESS_JWT_KEY!,
    REFRESH_KEY: process.env.REFRESH_JWT_KEY!
  },
  JWT_EXPIRES_IN: {
    ACCESS: process.env.ACCESS_JWT_EXPIRES_IN!,
    REFRESH: process.env.REFRESH_JWT_EXPIRES_IN!
  },
  EMAIL: {
    API_KEY: process.env.RESEND_API_KEY!
  },
  CACHE_REDIS: {
    URL: process.env.REDIS_URL!
  }
};
