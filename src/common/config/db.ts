import { User } from './../../modules/user/user.model';
import AppError from '../utils/appError';
import { ENVIRONMENT } from './environment';
import { DataSource } from 'typeorm';
import { Referral } from './../../modules/referrals/models/referral.model';
import { Referred } from './../../modules/referrals/models/referred.model';
import { Referrer } from './../../modules/referrals/models/referrer.model';
import { Campaign } from './../../modules/campaign/campaign.model';
import { ReferrerCampaignStats } from '../../modules/referrals/models/referrer-campaign-stats.model';

export const Reefa = new DataSource({
  type: 'postgres',
  url: ENVIRONMENT.DB.URL,
  entities: [
    User,
    Referral,
    Referred,
    Referrer,
    Campaign,
    ReferrerCampaignStats
  ],
  migrations: [`src\common\migrations/*.ts`],
  synchronize: ENVIRONMENT.APP.ENV === 'local' ? true : false
});

export function initializeDB() {
  Reefa.initialize()
    .then((options) =>
      console.log(`Reefa Database has been initialized: ${options.driver.database}`)
    )
    .catch((err) => {
      console.error('Error During Data Source Initialization:', err);
      process.exit(1);
    });
}
