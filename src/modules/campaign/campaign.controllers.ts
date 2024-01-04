import {
  getCampaigns,
  getCampaignById,
  createCampaign,
  deleteCampaign
} from './campaign.services';
import { catchAsync } from '@/common/utils/errorHandler';
import AppError from '@/common/utils/appError';
const httpGetCampaign = catchAsync(async (req, res) => {
  const { userId } = req;
  if (!userId) {
    throw new AppError('Your token has expired. Please login again');
  }
  const currentCampaign = await getCampaigns(userId);
  console.log(currentCampaign);
  return res.status(200).json({
    message: 'Campaigns retrieved succesfully',
    data: currentCampaign
  });
});

const httpGetCampaignById = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError('Campaign Id required');
  }
  const campaignById = await getCampaignById(id);
  console.log(campaignById);
  return res
    .status(200)
    .json({ message: 'Campaign retrieved succesfully', data: campaignById });
});

const httpCreateCampaign = catchAsync(async (req, res) => {
  const { userId } = req;
  const { name, description, campaignLink, paymentLink } = req.body;
  if (!(name, description, campaignLink, paymentLink)) {
    throw new AppError('Some details are missing in the Create Campaign form');
  }
  const newCampaign = await createCampaign(
    userId,
    name,
    description,
    campaignLink,
    paymentLink
  );
  return res
    .status(200)
    .json({ message: 'Campaign Created Succesfully', newCampaign });
});

const httpDeleteCampaign = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError('Campaign Id required');
  }
  const deletedCampaign = await deleteCampaign(id);
  console.log(deletedCampaign);
  return res.status(200).json({
    message: 'Campaign Deleted Successfully',
    data: deletedCampaign
  });
});

export {
  httpGetCampaign,
  httpGetCampaignById,
  httpCreateCampaign,
  httpDeleteCampaign
};

// CREATE TABLE campaigns (
//     campaign_id VARCHAR(255) NOT NULL PRIMARY KEY,
//     owner_id VARCHAR(255) REFERENCES campaign_owners(owner_id),
//     campaign_name TEXT NOT NULL,
//     campaign_description TEXT,
//     start_date TIMESTAMP,
//     end_date TIMESTAMP,
//     reward_details TEXT
// );
