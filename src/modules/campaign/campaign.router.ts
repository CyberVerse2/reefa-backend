import { Router } from 'express';
import {
  httpGetCampaignById,
  httpCreateCampaign,
  httpUpdateCampaign,
  httpDeleteCampaign
} from './campaign.controllers';
import { protect } from 'src/common/middlewares/protect';

const campaignRouter = Router();

campaignRouter.use(protect);
campaignRouter.get('/:id', httpGetCampaignById);
campaignRouter.post('/new', httpCreateCampaign);
campaignRouter.patch('/update/:id', httpUpdateCampaign);
campaignRouter.delete('/delete/:id', httpDeleteCampaign);

export default campaignRouter;
