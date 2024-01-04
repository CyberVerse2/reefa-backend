import { Router } from 'express';
import {
  httpGetCampaign,
  httpGetCampaignById,
  httpCreateCampaign,
  httpDeleteCampaign
} from './campaign.controllers';

const campaignRouter = Router();

campaignRouter.use(authenticateUser);

campaignRouter.get('/', httpGetCampaign);
campaignRouter.get('/:id', httpGetCampaignById);
campaignRouter.post(
  '/new',
  (req, res, next) => validateData(campaignSchema, req, res, next),
  httpCreateCampaign
);
// campaignRouter.post(
//   '/update',
//   () => validateData(campaignSchema),
//   httpUpdateCampaign
// );
campaignRouter.delete('/delete/:id', httpDeleteCampaign);

export default campaignRouter;
